# GrowWise School Landing Page

A modern, responsive landing page for GrowWise School built with Next.js, React, Redux-Saga, Tailwind CSS, and next-intl i18n.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Content**: All content is loaded from Redux store via Redux-Saga
- **Internationalization (i18n)**: Locale-aware routes using `next-intl` with `app/[locale]` and middleware
- **SEO Optimized**: Complete meta tags, sitemap, robots.txt, and structured data
- **PWA Ready**: Web app manifest and service worker support
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Beautiful, accessible design with smooth animations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux-Saga
- **UI Components**: Custom React components
- **SEO**: Next.js Metadata API, sitemap.xml, robots.txt

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── globals.css         # Global styles and utilities (@layer)
│   └── [locale]/           # Locale-scoped routes
│       ├── layout.tsx      # Per-locale provider via next-intl
│       ├── page.tsx        # Home page (localized)
│       ├── about/          # About page (localized entry)
│       ├── academic/       # Academic page (localized entry)
│       └── steam/...       # STEAM routes (localized entries)
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   └── providers/        # Context providers
├── store/                # Redux store configuration
│   ├── index.ts          # Store setup
│   ├── hooks.ts          # Typed Redux hooks
│   ├── slices/           # Redux Toolkit slices
│   └── sagas/            # Redux-Saga effects
└── lib/                  # Utilities (e.g., iconMap)

public/
├── api/mock/             # Mock API endpoints (JSON files consumed by Redux-Saga)
├── manifest.json         # PWA manifest
├── robots.txt           # SEO robots file
└── sitemap.xml          # SEO sitemap
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd newgrowwise
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Content & Data Management

### Redux-Saga Data Flow

All dynamic/page-configurable content is fetched via Redux-Saga from JSON under `public/api/mock`. Each feature has:

- A slice in `src/store/slices/*Slice.ts`
- A saga in `src/store/sagas/*Saga.ts` that fetches `/api/mock/*.json`
- Registration in `src/store/sagas/index.ts` and `src/store/index.ts`

Typical pattern:

- Create a slice in `src/store/slices` exposing `fetchXRequested/succeeded/failed`
- Create a saga in `src/store/sagas` that fetches `/api/mock/x.json`
- Register saga and reducer in `src/store/sagas/index.ts` and `src/store/index.ts`
- Dispatch `fetchXRequested` from the component and read `state.x.data`

All dynamic content is managed through Redux and loaded from JSON. The content includes:

- **Hero Section**: Title, subtitle, description, CTA
- **Features**: Array of feature cards with icons and descriptions
- **About**: School information and mission
- **Testimonials**: Student and parent testimonials
- **Contact**: Contact information and form
- **Navigation**: Menu items and logo
- **Footer**: Links and social media

### Adding New Content

1. Update the content in `public/api/mock/content.json`
2. The Redux-Saga will automatically fetch and update the store
3. Components will re-render with new content

### Replacing Mock API

This project can switch between local mock JSON and real server APIs via environment variables.

#### Environment Variables

Create a `.env.local` file in the project root (not committed) and set:

```
NEXT_PUBLIC_USE_MOCK=true
NEXT_PUBLIC_API_BASE=https://api.example.com
```

- `NEXT_PUBLIC_USE_MOCK`
  - `true` (default): load locale-aware mock JSON from `public/api/mock/{locale}/*.json` with fallback to `public/api/mock/*.json`.
  - `false`: call the real server at `NEXT_PUBLIC_API_BASE`.
- `NEXT_PUBLIC_API_BASE`
  - Base URL for your backend (only used when `NEXT_PUBLIC_USE_MOCK=false`).

After changing env vars, restart dev server.

#### How it works

- Sagas call a single helper `fetchJsonWithLocale(file, serverPath)` defined in `src/lib/api.ts`.
- When mocking, it loads `/api/mock/{locale}/{file}` → `/api/mock/{file}`.
- When not mocking, it requests `${NEXT_PUBLIC_API_BASE}${serverPath}`.

Sagas already use this helper for: header, home, about, contact, and academic.

## SEO Features

- **Meta Tags**: Complete Open Graph, Twitter Cards, and standard meta tags
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: Automatic sitemap generation
- **Robots.txt**: Search engine crawling instructions
- **Performance**: Optimized images and code splitting

## PWA Features

- **Web App Manifest**: App-like experience on mobile
- **Service Worker**: Offline support (can be added)
- **Installable**: Can be installed on mobile devices

## Customization

### Styling

The project uses Tailwind CSS. Styling approach:
- Small, one-off styles inline with Tailwind classes
- Reusable utilities via `@layer utilities` in `src/app/globals.css` (e.g., `header-*`, `contact-*`, `section-*`)
- Component variants handled in JSX via data/props (e.g., Header `variant`)

### Components

All components are modular and can be easily customized:
- Update component props and interfaces
- Modify styling classes
- Add new sections by creating new components

### Content Types

To add new content types:
1. Update the `ContentData` interface in `src/store/slices/contentSlice.ts`
2. Add the content to the JSON payload
3. Create new components to display the content

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.

---

## Internationalization (next-intl)

- Messages live in `src/i18n/messages/{en,es,hi,zh}.json`.
- Config/provider in `src/i18n/config.ts` and `app/[locale]/layout.tsx`.
- Middleware in `src/middleware.ts` enables locale prefixes and default locale redirect.
- Use in components:

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('about');
return <h1>{t('hero.title')}</h1>;
```

When adding keys, update all locale files. If messages don’t update during dev: stop Next, `rm -rf .next`, then `npm run dev`.

### Usage in Components

- Use `useTranslations('<namespace>')` for localized strings
- Use Redux state selectors for data; trigger fetch with `fetchXRequested`
- Keep styles maintainable: small inline Tailwind for one-offs, shared utilities in `globals.css` via `@layer`

---

## Development Tips

- Kill stray dev servers: `pkill -f "next dev"`
- Clear Next build cache: `rm -rf .next`
- Restart dev: `npm run dev`

