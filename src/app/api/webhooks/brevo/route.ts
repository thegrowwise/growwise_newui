import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Brevo event structure:
    // { event: 'opened'|'click'|'bounce'|'blocked', email: 'parent@example.com', ... }
    const event = body.event;
    const email = body.email?.toLowerCase();
    const url = body.link; // URL clicked (only for click events)

    if (!email) {
      console.warn('[brevo-webhook] Missing email, skipping');
      return NextResponse.json({ success: false });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[brevo-webhook] Supabase env vars not configured');
      return NextResponse.json({ success: false });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Find lead by parent_email
    const { data: leads, error: findError } = await supabase
      .from('leads')
      .select('id, status, email_1_sent, email_2_sent')
      .eq('parent_email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (findError || !leads || leads.length === 0) {
      console.warn(`[brevo-webhook] Lead not found for email: ${email}`);
      return NextResponse.json({ success: false });
    }

    const lead = leads[0];
    const updateData: Record<string, any> = { updated_at: new Date().toISOString() };

    // Determine which email this event belongs to
    // If email_1_sent=true and email_2_sent=false, it's email 1 event
    // If both sent, we assume it's email 2 (most recent)
    const isEmail1 = lead.email_1_sent && !lead.email_2_sent;
    const isEmail2 = lead.email_1_sent && lead.email_2_sent;

    if (event === 'opened') {
      if (isEmail1) updateData.email_1_opened_at = new Date().toISOString();
      else if (isEmail2) updateData.email_2_opened_at = new Date().toISOString();
    } else if (event === 'click') {
      if (isEmail1) updateData.email_1_clicked_at = new Date().toISOString();
      else if (isEmail2) updateData.email_2_clicked_at = new Date().toISOString();
      if (url) updateData.last_click_url = url;
    }

    if (Object.keys(updateData).length > 1) {
      const { error: updateError } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', lead.id);

      if (updateError) {
        console.error('[brevo-webhook] Supabase update error:', updateError);
        return NextResponse.json({ success: false });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[brevo-webhook] Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
