/**
 * API tests for POST /api/webinar-workshop (workshop registration).
 * Mocks sendEmail so no real email is sent.
 */

const mockSendEmail = jest.fn();

jest.mock('@/lib/email', () => ({
  sendEmail: (...args: unknown[]) => mockSendEmail(...args),
}));

describe('POST /api/webinar-workshop', () => {
  beforeEach(() => {
    mockSendEmail.mockReset();
    mockSendEmail.mockResolvedValue({ success: true, messageId: 'test-id' });
  });

  async function post(body: Record<string, unknown>) {
    const { POST } = await import('../route');
    const request = new Request('http://localhost/api/webinar-workshop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return POST(request);
  }

  const validBody = {
    parentName: 'Jane Parent',
    email: 'jane@example.com',
    studentName: 'Student One',
    grade: '5',
    schoolDistrict: 'Oakland USD',
    howDidYouHear: 'google',
    eventType: 'workshop',
  };

  it('returns 200 and success when payload is valid and email succeeds', async () => {
    const res = await post(validBody);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBeDefined();
    expect(mockSendEmail).toHaveBeenCalledTimes(2);
  });

  it('returns 400 when required field is missing', async () => {
    const { email, ...rest } = validBody;
    const res = await post(rest as Record<string, unknown>);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toMatch(/invalid|missing/i);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when email format is invalid', async () => {
    const res = await post({ ...validBody, email: 'not-an-email' });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when howDidYouHear is not allowed', async () => {
    const res = await post({ ...validBody, howDidYouHear: 'other' });
    expect(res.status).toBe(400);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it('returns 400 when eventType is not webinar or workshop', async () => {
    const res = await post({ ...validBody, eventType: 'course' });
    expect(res.status).toBe(400);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
