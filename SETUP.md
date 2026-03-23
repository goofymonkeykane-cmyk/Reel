# Setting Up Reel — Complete Developer Guide

This guide takes you from zero to a running Reel instance in under 30 minutes.
Every service used has a free tier. Total cost to run during development: ₹0.

---

## What You Need

- A computer with internet access
- A free GitHub account
- About 30 minutes

You do NOT need to buy anything. Every service below is free.

---

## Step 1 — Get the Code

```bash
git clone https://github.com/yourusername/reel.git
cd reel
npm install
```

If you do not have Node.js installed, download it from nodejs.org (free).

---

## Step 2 — Get Your TMDB API Key (5 minutes, free)

1. Go to themoviedb.org
2. Click Sign Up and create a free account
3. Go to Settings → API
4. Click "Create" and fill in the form
   - Type: Developer
   - Use: Personal / Open Source Project
   - Description: "Open source cinema social network"
5. You will get an API Key (v3 auth)
6. Copy this key — you will need it in Step 4

TMDB gives you unlimited free API requests for non-commercial use.
800,000+ films, series, anime, people, watch providers — all free.

---

## Step 3 — Set Up Supabase (10 minutes, free)

Supabase is your database, authentication, and real-time messaging.
Free tier handles up to 50,000 monthly active users.

1. Go to supabase.com
2. Click "Start your project" and sign up with GitHub
3. Click "New Project"
4. Name it "reel"
5. Set a strong database password (save it somewhere safe)
6. Choose the region closest to your users (for India: Southeast Asia)
7. Click "Create new project" and wait about 2 minutes

Once created:
8. Go to Project Settings → API
9. Copy your Project URL and anon/public key

Now set up the database:
10. Go to the SQL Editor in your Supabase dashboard
11. Click "New Query"
12. Open the file supabase/migrations/001_initial_schema.sql from this repo
13. Copy the entire contents and paste into the SQL editor
14. Click "Run"
15. You should see "Success" — your entire database is now set up

Enable authentication providers:
16. Go to Authentication → Providers
17. Enable Email (already on by default)
18. Enable Google: you need a Google OAuth client
    - Go to console.cloud.google.com
    - Create a project, enable Google+ API
    - Create OAuth credentials
    - Add your Supabase callback URL as authorized redirect
    - Paste client ID and secret into Supabase

---

## Step 4 — Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Open .env.local in any text editor and fill in:

```
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_key_from_step_2
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_from_step_3
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_from_step_3
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXTAUTH_SECRET=any_random_string_at_least_32_characters
NEXTAUTH_URL=http://localhost:3000
```

IMPORTANT: Never commit .env.local to GitHub.
The .gitignore already prevents this automatically.

---

## Step 5 — Run Reel Locally

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

You should see the Reel homepage with real film data loading from TMDB.

---

## Step 6 — Deploy to the Internet (free)

Vercel makes this completely free and takes 3 minutes.

1. Go to vercel.com and sign up with your GitHub account
2. Click "New Project"
3. Import your reel GitHub repository
4. In the Environment Variables section, add all the same variables from your .env.local
5. Click Deploy

Vercel gives you a free URL like reel-yourusername.vercel.app
Your app is now live on the internet.

For a custom domain (like getreel.app), you can buy one for about ₹800/year
and connect it to Vercel in their dashboard.

---

## Project Structure

```
reel/
├── src/
│   ├── app/                    # Next.js pages and API routes
│   │   ├── page.tsx            # Homepage
│   │   ├── films/              # Film browse and detail pages
│   │   ├── search/             # Search page
│   │   ├── person/             # Cast and crew pages
│   │   ├── auth/               # Login and signup
│   │   ├── donate/             # Donation page
│   │   └── api/                # API routes
│   │       ├── films/          # Film data, search, ratings
│   │       ├── messages/       # DM system
│   │       ├── ratings/        # Film logging and rating
│   │       └── watch-party/    # Watch party sync
│   ├── components/             # Reusable UI components
│   ├── lib/
│   │   ├── tmdb.ts             # All TMDB API functions
│   │   └── supabase.ts         # Database client
│   └── types/                  # TypeScript type definitions
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete database setup
├── .env.example                # Environment variables template
├── .gitignore                  # Prevents secrets from being uploaded
├── package.json                # Dependencies
├── tailwind.config.js          # Design system
└── next.config.js              # Next.js configuration
```

---

## What Is Already Built

✅ Complete homepage with real TMDB data
✅ Film browse page with category filters (Trending, Bollywood, Anime, Upcoming)
✅ Film detail page with poster, backdrop, cast, crew, where to watch, ticket booking link
✅ Real-time search across all 800,000+ TMDB titles
✅ Person pages with filmography and lock-in feature preview
✅ User authentication (email + Google)
✅ Film logging and rating API
✅ Direct messaging API with real-time delivery
✅ Watch party API (legal sync-only architecture)
✅ Complete database schema with all tables and security policies
✅ Donation page with full transparency
✅ Design system with cinema-dark aesthetic

---

## What Still Needs Building

These features are designed and the database is ready — they need frontend pages:

- [ ] User profile pages (database: profiles, film_logs)
- [ ] Home feed after login (database: follows, film_logs)
- [ ] DM interface with real-time chat UI
- [ ] Watch party room with sync controls
- [ ] Community clubs feed and posts
- [ ] Collections browser and creator
- [ ] Release calendar / schedule page
- [ ] User statistics / year in review
- [ ] Onboarding flow and taste matching
- [ ] Letterboxd import
- [ ] Notification system UI
- [ ] Mobile responsive improvements

---

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | Next.js 14 + Tailwind CSS | Free |
| Database | Supabase PostgreSQL | Free (500MB) |
| Authentication | Supabase Auth | Free (50k users) |
| Real-time | Supabase Realtime | Free |
| Film Data | TMDB API | Free (unlimited) |
| Deployment | Vercel | Free |
| Media | Cloudinary | Free (25GB) |

Total monthly cost at launch: $0
Total monthly cost at 10,000 active users: ~$0-20
Total monthly cost at 100,000 active users: ~$50-100

---

## Contributing

Read CONTRIBUTING.md for how to help.

The most important rule: Reel must remain free and open source forever.
This is protected by the AGPL-3.0 license in this repository.

---

## Questions?

Open an Issue on GitHub. That is the best way to discuss anything about this project.
