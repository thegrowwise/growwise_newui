🚨 ENGINEERING & QA CONSTITUTION (ENFORCED)

These rules apply to ALL AI-generated changes in this repository.
Violations = incorrect solution.

No confirmations. No skipped steps. No shortcuts.

**If constraints cannot be met:** STOP and explain the violation. Do not guess or invent compliance.

1. ENGINEERING MODE

Act as:

Principal Engineer

Senior QA Engineer

Design constraints:

Long-term maintainability

Minimal change surface

Enterprise, multi-tenant, multi-role

Predictable > clever

2. CHANGE SURFACE (CRITICAL)

Minimize files touched.

One concept → one registry/config location max (+ new files).

Multi-place edits = refactor first.

3. ZERO HARDCODING (ABSOLUTE)

Forbidden in components, services, hooks, APIs:

UI strings

Routes / paths

Menus

Roles / permissions

Feature flags

Env-specific values

Backend display text

console.*

Allowed sources only:

Typed registries

Typed config

Backend manifests

Feature flag services

i18n keys

Central logging framework

4. SINGLE SOURCE OF TRUTH (SSOT)

Backend authoritative

Feature flags / entitlements

Menu structure & visibility

Roles & permissions

Tenant plans

Frontend authoritative

Allowed routeIds / menuIds / featureKeys (typed)

UI metadata (i18n, icons, breadcrumbs)

Runtime gating (central services only)

Navigation =
Backend Manifest + Frontend Registry + Capability Service

Duplication = design failure.

5. REGISTRY-FIRST ARCHITECTURE

Routes, menus, features, permissions → registries only.

Components must NOT define:

routes

menus

permissions

feature flags

Page titles, headers, breadcrumbs → route metadata only.

No duplicated page titles.

6. CONFIGURATION-DRIVEN DESIGN

Behavior via config, not conditionals.

Config must be:

Typed

Schema-validated

Environment-overrideable

Invalid config → fail fast.

6A. CONTENT EXTERNALIZATION

Large content (>20 lines) must NOT live in business logic.

Prompts, templates, messages → external storage.

Loaded via content service/factory.

Must support versioning & parameterization.

Content changes must NOT require deployment.

Forbidden:

Large inline strings

Duplicated content

Logic mixed with content

7. SERVER-DRIVEN FEATURES & MENUS

Backend controls feature availability & menus.

Frontend:

Validates manifests

Rejects unknown IDs (fail closed)

Renders via registries only

Centralization:

Menus → MenuResolver

Feature checks → CapabilityService

Route guards → CapabilityService

7A. ADMIN FEATURE FLAGS

Backend is source of truth.

UI toggles:

Call backend API

Refresh manifest

Never toggle locally

Required:

RBAC

Audit logs

Tenant scope

Rollback support

Manifest versioning / ETag

8. SECURITY & AUTHORIZATION

Declarative, centralized authorization.

No permission logic in components.

Backend always enforces auth.

Menu visibility ≠ authorization.

8A. CROSS-CUTTING CONCERNS

Handled ONLY via interceptors/aspects/middleware:

Logging

Metrics

Rate limits

Quotas

Transactions

Business logic must stay pure.

9. LOCALIZATION

All user-visible text → i18n keys.

No readable text in UI or backend responses.

Minimum 2 locales required.

10. LOGGING & OBSERVABILITY

Forbidden:

console.*

Required:

Structured logging

CorrelationId, userId (safe), tenantId

No secrets / PII

Mockable in tests

11. API CONTRACTS

Contract-first (OpenAPI / GraphQL / Proto).

Breaking changes → versioning.

Feature flags must not alter API shape.

12. DATA & MIGRATIONS

Clear data ownership.

Versioned, reversible migrations.

Repositories only.

Flags guard partial migrations.

13. PERFORMANCE

No N+1 calls.

Pagination & caching for large data.

Loading / empty / degraded states required.

14. ACCESSIBILITY

WCAG AA minimum.

Keyboard navigation for core flows.

Automated a11y checks.

15. DEPENDENCIES

Justify new deps.

No overlaps.

Pin versions.

Vulnerabilities block builds.

16. TESTING (NON-NEGOTIABLE)

Every change includes tests:

Unit

Integration

E2E (critical flows)

Coverage:

Business logic ≥ 90%

Policy / gating = 100%

17. QUALITY GATES

Must pass:

Types

Lint

Tests

Schema validation

Security scans

A11y checks

No bypassing.

18. FAILURE MODES

Missing flags → OFF

Missing permissions → DENY

Partial data → degraded UI

Admin actions → reversible

19. DOCUMENTATION

Update docs when:

Patterns change

Assumptions change

Limitations are discovered

20. CHANGE IMPACT (ONLY WHEN CODE CHANGES)

Include only if code was modified:

Files touched

Why

Why no others

21. DEFAULT TO REFACTOR

Duplication, tight coupling, or multi-place edits → refactor first.

22. AI DISCIPLINE

No architectural drift.

Preserve existing patterns.

Prefer explicit, testable designs.

Explain trade-offs only when non-obvious.

23. SELF-REVIEW

Before final output:

- Run `.ai/review-checklist.md` (verify each item).
- State **PASS** or **FAIL** only.
- If FAIL: fix or refuse and explain.