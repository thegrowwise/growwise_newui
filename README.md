## GrowWise Frontend (`growwise_newui`)

Next.js 14 App Router frontend for GrowWise School with TypeScript, Tailwind CSS, Redux Toolkit + Redux-Saga, and `next-intl` i18n.

### Features
- Responsive marketing site and camp pages
- Enrollment forms (general + academic)
- Stripe checkout integration via backend
- Locale-aware routing (`/en`, `/es`, etc.) with `next-intl`
- Modern header, mobile nav, and calendar views

### Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Redux Toolkit + Redux-Saga
- next-intl (i18n)

### Getting Started
```bash
cd growwise_newui
npm install
cp .env.example .env.local   # then edit with your values
npm run dev                  # http://localhost:3000
```

Important env vars (examples):
- `NEXT_PUBLIC_BACKEND_URL=https://<your-backend-domain>`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`

### Notable Routes
- `/[locale]` – Home
- `/[locale]/enroll` – assessment/enrollment form
- `/[locale]/enroll-academic` – academic help form
- `/[locale]/camps/winter` – winter camps
- `/[locale]/camps/winter/calendar` – full calendar page
- `/[locale]/student-login` – iframe to WordPress minimal login

### Build & Deploy
```bash
cd growwise_newui
npm run build
npm start          # or deploy via Vercel / AWS Amplify
```


