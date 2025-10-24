# Page Refactoring Steps - Redux-Saga + i18n + JSON

This document outlines the systematic steps to refactor any page to use Redux-Saga, internationalization, and JSON data.

## Prerequisites
- Redux store with slices and sagas already set up
- i18n configuration with translation files
- Mock JSON API structure in place

## Step-by-Step Refactoring Process

### 1. **Identify Hardcoded Data**
- [ ] Find all hardcoded arrays (programs, contactInfo, faqs, etc.)
- [ ] Find all hardcoded text strings
- [ ] Find all hardcoded objects (locationDetails, etc.)

### 2. **Update JSON Structure**
- [ ] Add missing data sections to `public/api/mock/en/[page].json`
- [ ] Ensure proper data structure matches component expectations
- [ ] Copy updated JSON to all locale directories (es, hi, zh)

### 3. **Update Component to Use Redux-Saga**
- [ ] Import `useAppDispatch` and `useAppSelector` from store hooks
- [ ] Import the appropriate slice action (e.g., `fetchAboutRequested`)
- [ ] Add `useEffect` to dispatch fetch action on component mount
- [ ] Replace hardcoded arrays with `data?.arrayName ?? []`
- [ ] Replace hardcoded objects with `data?.objectName ?? {}`

### 4. **Add Internationalization**
- [ ] Import `useTranslations` from 'next-intl'
- [ ] Add translation hook: `const t = useTranslations('namespace')`
- [ ] Replace hardcoded strings with `t('key')` or `data?.key || t('key')`
- [ ] Add missing translation keys to `src/i18n/messages/en.json`
- [ ] Update other locale files (es.json, hi.json, zh.json) with same keys

### 5. **Update Icon Integration**
- [ ] Import `getIconComponent` from '@/lib/iconMap'
- [ ] Replace hardcoded icon mapping with `getIconComponent(iconName)`
- [ ] Add missing icons to `src/lib/iconMap.ts` if needed

### 6. **Test and Verify**
- [ ] Ensure page loads without errors
- [ ] Verify data loads from JSON files
- [ ] Test translation switching
- [ ] Check icon rendering
- [ ] Verify no hardcoded data remains

## Example: Contact Page Refactoring

### Before (Hardcoded):
```javascript
const programs = [
  { value: "math-courses", label: "Math Courses" },
  // ... more hardcoded data
];

const contactInfo = [
  {
    icon: "Phone",
    title: "Call Us",
    // ... hardcoded properties
  }
];
```

### After (Redux-Saga + i18n):
```javascript
const programs = contact?.programs ?? [];
const contactInfo = contact?.contactInfo ?? [];

// In JSX:
<h1>{contact?.hero?.title || t('title')}</h1>
<Button>{t('buttons.callNow')}</Button>
```

## Files to Update for Each Page

### JSON Files:
- `public/api/mock/en/[page].json`
- `public/api/mock/es/[page].json`
- `public/api/mock/hi/[page].json`
- `public/api/mock/zh/[page].json`

### Translation Files:
- `src/i18n/messages/en.json`
- `src/i18n/messages/es.json`
- `src/i18n/messages/hi.json`
- `src/i18n/messages/zh.json`

### Component Files:
- `src/components/sections/[Page].tsx`

### Utility Files (if needed):
- `src/lib/iconMap.ts`

## Checklist for Each Page

- [ ] All hardcoded arrays moved to JSON
- [ ] All hardcoded strings use translations
- [ ] Redux-Saga integration working
- [ ] Icons use global utility
- [ ] JSON files copied to all locales
- [ ] Translation keys added to all locale files
- [ ] No hardcoded data remains
- [ ] Page renders correctly
- [ ] Translation switching works
