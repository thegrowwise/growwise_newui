import {
  __resetChatbotSupabaseEnvCacheForTests,
  getChatbotSupabaseEnv,
} from '../env';

describe('getChatbotSupabaseEnv', () => {
  const base = {
    NEXT_PUBLIC_SUPABASE_URL: 'https://abc123.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: 'service-role-secret',
    GROWWISE_CONTACT_EMAIL: 'contact@growwiseschool.org',
  };

  beforeEach(() => {
    __resetChatbotSupabaseEnvCacheForTests();
    jest.resetModules();
    for (const key of Object.keys(process.env)) {
      if (
        key.startsWith('NEXT_PUBLIC_SUPABASE') ||
        key === 'SUPABASE_URL' ||
        key === 'SUPABASE_SERVICE_ROLE_KEY' ||
        key === 'GROWWISE_CONTACT_EMAIL'
      ) {
        delete process.env[key];
      }
    }
    Object.assign(process.env, base);
  });

  afterEach(() => {
    __resetChatbotSupabaseEnvCacheForTests();
  });

  it('returns normalized config when all variables are valid', () => {
    const env = getChatbotSupabaseEnv();
    expect(env.url).toBe('https://abc123.supabase.co');
    expect(env.serviceRoleKey).toBe('service-role-secret');
    expect(env.contactEmail).toBe('contact@growwiseschool.org');
  });

  it('accepts SUPABASE_URL when NEXT_PUBLIC_SUPABASE_URL is unset', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.SUPABASE_URL = 'https://xyz.supabase.co';
    const env = getChatbotSupabaseEnv();
    expect(env.url).toBe('https://xyz.supabase.co');
  });

  it('throws when Supabase URL is missing', () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_URL;
    expect(() => getChatbotSupabaseEnv()).toThrow(/Missing NEXT_PUBLIC_SUPABASE_URL/);
  });

  it('throws when service role key is missing', () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(() => getChatbotSupabaseEnv()).toThrow(/SUPABASE_SERVICE_ROLE_KEY/);
  });

  it('throws when contact email is missing', () => {
    delete process.env.GROWWISE_CONTACT_EMAIL;
    expect(() => getChatbotSupabaseEnv()).toThrow(/GROWWISE_CONTACT_EMAIL/);
  });

  it('throws for legacy thegrowwise.com contact email', () => {
    process.env.GROWWISE_CONTACT_EMAIL = 'connect@thegrowwise.com';
    expect(() => getChatbotSupabaseEnv()).toThrow(/growwise\.com/);
  });

  it('throws for legacy growwise.com contact email', () => {
    process.env.GROWWISE_CONTACT_EMAIL = 'info@growwise.com';
    expect(() => getChatbotSupabaseEnv()).toThrow(/growwise\.com/);
  });

  it('throws when contact email is not growwiseschool.org', () => {
    process.env.GROWWISE_CONTACT_EMAIL = 'a@example.com';
    expect(() => getChatbotSupabaseEnv()).toThrow(/growwiseschool\.org/);
  });

  it('throws when URL is not HTTPS', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://insecure.supabase.co';
    expect(() => getChatbotSupabaseEnv()).toThrow(/Invalid Supabase URL/);
  });

  it('caches the resolved config', () => {
    const a = getChatbotSupabaseEnv();
    const b = getChatbotSupabaseEnv();
    expect(a).toBe(b);
  });
});
