import { test, expect, type Page, type Route } from '@playwright/test';
import { localePath } from '../localePath';

// ─── Shared mock helpers ──────────────────────────────────────────────────────

const SESSION = 'test-session-abc123';

/** Mock /api/self-check to return success (email-driven flow — no redirectUrl) */
async function mockSelfCheckSuccess(page: Page) {
  await page.route('**/api/self-check', async (route: Route) => {
    if (route.request().method() !== 'POST') { await route.continue(); return; }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
}

/** Mock /api/results to return a completed quiz result */
async function mockResultsCompleted(page: Page) {
  await page.route('**/api/results**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        status: 'completed',
        student_name: 'Alex',
        grade: 3,
        subject: 'math',
        patterns_confirmed: [
          {
            id: 'skipped_steps',
            title: 'Skipped Steps',
            riskLevel: 'HIGH',
            commonGrades: '3-5',
            description: 'Jumps from problem to answer without showing work.',
            blocksNext: 'Multi-step word problems',
            domain: 'operations',
          },
        ],
        patterns_possible: [],
        overall_risk: 'HIGH',
        parent_prediction: ['operations'],
        student_prediction: 'operations',
        award_tier: 'double_detective',
      }),
    });
  });
}

/** Mock /api/results to return quiz not yet completed */
async function mockResultsNotCompleted(page: Page) {
  await page.route('**/api/results**', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, status: 'quiz_not_completed' }),
    });
  });
}

/** Mock /api/save-prediction */
async function mockSavePrediction(page: Page) {
  await page.route('**/api/save-prediction', async (route: Route) => {
    if (route.request().method() !== 'POST') { await route.continue(); return; }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    });
  });
}

/** Navigate with retry — next dev can abort first compile-time request */
async function goto(page: Page, path: string) {
  for (let i = 0; i < 3; i++) {
    try {
      await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
      return;
    } catch {
      if (i === 2) throw new Error(`Failed to navigate to ${path} after 3 attempts`);
    }
  }
}

/** Fill and submit the self-check form */
async function fillAndSubmitForm(page: Page, grade = 'Grade 3') {
  await page.getByLabel(/Your First Name/i).fill('Sarah');
  await page.getByLabel(/Your Email/i).fill('test@example.com');
  await page.getByLabel(/Child.*First Name/i).fill('Alex');

  // Grade select (Radix)
  const gradeTrigger = page.locator('[id="sc-grade"]').locator('..');
  await gradeTrigger.click({ force: true });
  await page.getByRole('option', { name: new RegExp(`^${grade}$`, 'i') }).click();

  // Wait for predictions to appear (the form label, not the page heading)
  await expect(page.locator('label', { hasText: /Detective Challenge/i })).toBeVisible({ timeout: 5000 });
  await page.getByText(/Addition, Subtraction/i).click();

  await page.getByRole('button', { name: /Lock In My Prediction/i }).click();
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Self-Check funnel', () => {

  // ── 1. Self-check page renders ────────────────────────────────────────────
  test('self-check page loads with form', async ({ page }) => {
    await goto(page, localePath('/self-check'));
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByLabel(/Your First Name/i)).toBeVisible();
    await expect(page.getByLabel(/Your Email/i)).toBeVisible();
    await expect(page.getByLabel(/Child.*First Name/i)).toBeVisible();
  });

  // ── 2. Validation fires before submit ─────────────────────────────────────
  test('shows validation errors when submitting empty form', async ({ page }) => {
    await goto(page, localePath('/self-check'));
    await page.getByRole('button', { name: /Lock In My Prediction/i }).click();
    await expect(page.getByText(/Your first name is required/i)).toBeVisible();
    await expect(page.getByText(/Email is required/i)).toBeVisible();
  });

  // ── 3. Grade unavailable ──────────────────────────────────────────────────
  test('shows coming-soon message for unavailable grade', async ({ page }) => {
    await page.route('**/api/self-check', async (route: Route) => {
      if (route.request().method() !== 'POST') { await route.continue(); return; }
      await route.fulfill({
        status: 422,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, error: 'grade_unavailable' }),
      });
    });

    await goto(page, localePath('/self-check'));
    await fillAndSubmitForm(page, 'Grade 5');

    await expect(page.getByText(/This grade is coming soon/i)).toBeVisible({ timeout: 8000 });
    // Must not redirect
    await expect(page).toHaveURL(/self-check/, { timeout: 3000 });
  });

  // ── 4. Happy path — form submits and shows email confirmation ────────────
  test('successful form submission shows email confirmation', async ({ page }) => {
    await mockSelfCheckSuccess(page);
    await goto(page, localePath('/self-check'));
    await fillAndSubmitForm(page, 'Grade 3');

    // Email-driven flow: shows confirmation message instead of redirecting
    await expect(page.getByText(/Check your email/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/test@example\.com/i)).toBeVisible();
  });

  // ── 5. Expired session banner ─────────────────────────────────────────────
  test('shows expired session banner on /self-check?error=expired', async ({ page }) => {
    await goto(page, localePath('/self-check?error=expired'));
    await expect(page.getByText(/Your session expired/i)).toBeVisible();
  });

  // ── 6. Incomplete quiz banner ─────────────────────────────────────────────
  test('shows incomplete banner on /self-check?error=incomplete', async ({ page }) => {
    await goto(page, localePath('/self-check?error=incomplete'));
    await expect(page.getByText(/Please complete the quiz first/i)).toBeVisible();
  });

  // ── 7. Error banner is dismissible ───────────────────────────────────────
  test('error banner can be dismissed', async ({ page }) => {
    await goto(page, localePath('/self-check?error=expired'));
    const banner = page.getByText(/Your session expired/i);
    await expect(banner).toBeVisible();
    await page.getByRole('button', { name: /Dismiss/i }).click();
    await expect(banner).not.toBeVisible();
  });
});

test.describe('Detective page', () => {

  // ── 8. Detective page redirects to self-check (now a pass-through) ───────
  test('redirects to /self-check', async ({ page }) => {
    await goto(page, localePath('/detective'));
    await expect(page).toHaveURL(/self-check/, { timeout: 8000 });
  });
});

test.describe('Results page', () => {

  // ── 11. Results page redirects to self-check (now a pass-through) ─────────
  test('redirects to /self-check', async ({ page }) => {
    await goto(page, localePath('/results'));
    await expect(page).toHaveURL(/self-check/, { timeout: 8000 });
  });
});

test.describe('Done page', () => {

  // ── 16. Done page renders ─────────────────────────────────────────────────
  test('done page renders confirmation content', async ({ page }) => {
    await goto(page, localePath('/self-check/done'));
    await expect(page.getByRole('heading', { level: 1, name: /You.*re all set/i })).toBeVisible();
    await expect(page.getByText(/sent to your email/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Book My Free Workshop/i })).toBeVisible();
  });

  // ── 17. Back to Self-Check link ───────────────────────────────────────────
  test('done page has correct Back to Self-Check link', async ({ page }) => {
    await goto(page, localePath('/self-check/done'));
    const link = page.getByRole('link', { name: /Back to Self-Check/i });
    await expect(link).toHaveAttribute('href', '/self-check');
  });
});
