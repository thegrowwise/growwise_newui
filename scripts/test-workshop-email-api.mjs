#!/usr/bin/env node
/**
 * API test for workshop registration (email sending).
 * Run with: node scripts/test-workshop-email-api.mjs [baseUrl]
 * Example: node scripts/test-workshop-email-api.mjs http://localhost:3002
 * Requires the dev server to be running if using localhost.
 */

const baseUrl = process.argv[2] || 'http://localhost:3002';

const validPayload = {
  parentName: 'Test Parent',
  email: 'test-registrant@example.com',
  studentName: 'Test Student',
  grade: '5',
  schoolDistrict: 'Test USD',
  howDidYouHear: 'google',
  eventType: 'workshop',
};

async function run() {
  console.log('Testing POST', `${baseUrl}/api/webinar-workshop`);
  console.log('Payload:', JSON.stringify(validPayload, null, 2));

  try {
    const res = await fetch(`${baseUrl}/api/webinar-workshop`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validPayload),
    });
    const data = await res.json();

    if (res.status !== 200) {
      console.error('FAIL: expected 200, got', res.status, data);
      process.exit(1);
    }
    if (!data.success) {
      console.error('FAIL: response success is false', data);
      process.exit(1);
    }

    console.log('PASS: 200 OK', data.message);
  } catch (err) {
    console.error('FAIL: request error', err.message);
    if (err.cause?.code === 'ECONNREFUSED') {
      console.error('Is the dev server running? Try: npm run dev');
    }
    process.exit(1);
  }
}

run();
