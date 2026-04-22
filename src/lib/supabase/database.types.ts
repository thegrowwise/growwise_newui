/**
 * Minimal public schema typings for GWA-163 tables (leads, analytics_events).
 * Extend when new tables or columns are added.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          status: string;
          page_url: string | null;
          utm_source: string | null;
          utm_medium: string | null;
          utm_campaign: string | null;
          utm_term: string | null;
          utm_content: string | null;
          recaptcha_score: number | null;
          conversation_excerpt: string | null;
          email: string | null;
          phone: string | null;
          name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: string;
          page_url?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
          recaptcha_score?: number | null;
          conversation_excerpt?: string | null;
          email?: string | null;
          phone?: string | null;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          page_url?: string | null;
          utm_source?: string | null;
          utm_medium?: string | null;
          utm_campaign?: string | null;
          utm_term?: string | null;
          utm_content?: string | null;
          recaptcha_score?: number | null;
          conversation_excerpt?: string | null;
          email?: string | null;
          phone?: string | null;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          session_id: string;
          page_url: string;
          event: string;
          meta: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          page_url: string;
          event: string;
          meta?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          page_url?: string;
          event?: string;
          meta?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type LeadRow = Database['public']['Tables']['leads']['Row'];
export type LeadInsert = Database['public']['Tables']['leads']['Insert'];
export type AnalyticsEventRow = Database['public']['Tables']['analytics_events']['Row'];
export type AnalyticsEventInsert =
  Database['public']['Tables']['analytics_events']['Insert'];
