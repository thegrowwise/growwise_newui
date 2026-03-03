/**
 * Tests for sendEmail (src/lib/email.ts).
 * Mocks nodemailer so no real SMTP is used.
 */

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

const originalEnv = process.env;

function setEnv(env: Record<string, string>) {
  Object.entries(env).forEach(([k, v]) => {
    process.env[k] = v;
  });
}

function clearEmailEnv() {
  ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'FROM_EMAIL', 'SMTP_SECURE'].forEach((k) => {
    delete process.env[k];
  });
}

describe('sendEmail', () => {
  beforeEach(() => {
    jest.resetModules();
    mockSendMail.mockReset();
    clearEmailEnv();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns success: false when SMTP env is missing', async () => {
    const { sendEmail } = await import('../email');
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
    });
    expect(result.success).toBe(false);
    expect(result.error).toBe('Email not configured');
    expect(mockSendMail).not.toHaveBeenCalled();
  });

  it('returns success: true when env is set and sendMail succeeds', async () => {
    setEnv({
      SMTP_HOST: 'mail.example.com',
      SMTP_PORT: '587',
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'secret',
      FROM_EMAIL: 'user@example.com',
    });
    mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

    const { sendEmail } = await import('../email');
    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
    });

    expect(result.success).toBe(true);
    expect(result.messageId).toBe('msg-123');
    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail.mock.calls[0][0]).toMatchObject({
      to: ['recipient@example.com'],
      subject: 'Test',
      text: 'Hi',
      html: '<p>Hi</p>',
    });
  });

  it('returns success: false when sendMail throws', async () => {
    setEnv({
      SMTP_HOST: 'mail.example.com',
      SMTP_USER: 'user@example.com',
      SMTP_PASS: 'secret',
      FROM_EMAIL: 'user@example.com',
    });
    mockSendMail.mockRejectedValue(new Error('EAUTH'));

    const { sendEmail } = await import('../email');
    const result = await sendEmail({
      to: 'recipient@example.com',
      subject: 'Test',
      html: '<p>Hi</p>',
      text: 'Hi',
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('EAUTH');
  });
});
