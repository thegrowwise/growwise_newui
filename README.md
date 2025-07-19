# GrowWise School Landing Page

A modern, responsive landing page for GrowWise School built with Next.js, React, Redux-Saga, and Tailwind CSS.

## Features

- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Content**: All content is loaded from Redux store via Redux-Saga
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
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── sections/         # Page sections (Hero, Features, etc.)
│   └── providers/        # Context providers
├── store/                # Redux store configuration
│   ├── index.ts          # Store setup
│   ├── hooks.ts          # Typed Redux hooks
│   ├── slices/           # Redux Toolkit slices
│   └── sagas/            # Redux-Saga effects
└── types/                # TypeScript type definitions

public/
├── api/mock/             # Mock API endpoints
│   └── content.json      # Dynamic content payload
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

## Content Management

### Dynamic Content Structure

All dynamic content is managed through Redux and loaded from a JSON payload. The content structure includes:

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

To replace the mock API with a real endpoint:

1. Update the `fetchContentAPI` function in `src/store/sagas/contentSaga.ts`
2. Replace the mock data with a real API call:

```typescript
async function fetchContentAPI(): Promise<ContentData> {
  const response = await fetch('/api/content');
  if (!response.ok) {
    throw new Error('Failed to fetch content');
  }
  return response.json();
}
```

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

The project uses Tailwind CSS for styling. Custom styles can be added in:
- `src/app/globals.css` for global styles
- Component-specific classes in each component

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
