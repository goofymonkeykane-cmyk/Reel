# 🎬 Reel

### A free, open source, forever social network for cinema lovers.

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](LICENSE)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-black)](https://nextjs.org)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-green)](https://supabase.com)
[![Film Data: TMDB](https://img.shields.io/badge/Film%20Data-TMDB-orange)](https://themoviedb.org)

---

## What is Reel?

Reel is a cinema-first social platform — the missing layer between film tracking and human connection. Think of what you get if Letterboxd, Moctale, Serializd, and a cinema-focused version of Twitter were rebuilt from scratch with human connection as the primary feature.

**Every existing platform leaves something critical missing:**
- Letterboxd has no DMs, no matching, no anime, no watch parties, no release calendar
- Moctale has community but is full of advertisements and lacks depth
- Serializd tracks series beautifully but has no social layer
- Film Twitter has the conversation but none of the film data

Nobody has built the platform where you find your people through the films you love, talk to them, and watch together. Reel is that platform.

---

## Philosophy

> "Cinema belongs to everyone. The platform for cinema lovers should too."

- **Completely free. Forever. For everyone.** No feature tiers. No paywalls.
- **No advertisements. Ever.**
- **Open source** under AGPL-3.0 — like Signal
- **Voluntary donations only** — like Wikipedia
- **Self-hostable** — like Mastodon
- **Transparent funding** — every rupee of income publicly disclosed
- **Your data is yours** — full export anytime, DMs encrypted
- **If Reel ever shuts down**, the code lives on and anyone can continue it

This is not a startup. This is public infrastructure for cinema culture.
**Built like VLC. Funded like Wikipedia. Licensed like Linux.**

---

## Features

### Already built ✅
- Complete homepage with real TMDB film data
- Film, series, and anime browsing — Trending, Bollywood, South Indian, Anime, Upcoming
- Full film detail pages — poster, backdrop, cast with photos, crew, where to watch
- Real-time search across 800,000+ titles from every country
- Person pages — full filmography for any actor, director, composer
- Lock-in feature — follow any cast/crew member for new project notifications
- Where to watch — real-time streaming availability by country (India first)
- Cinema ticket booking link — connects to BookMyShow
- Release calendar — upcoming films filtered by India
- Community Clubs — Indian Cinema, Marvel, DC, Anime, World Cinema, K-Drama, more
- User authentication — email + Google sign in
- User profiles with diary, ratings, reviews
- Onboarding — 3-step taste profile builder
- Watchlist, Lists, Statistics, Settings pages
- Discover cinephiles page
- Voluntary donation page with full transparency
- Complete database schema — 18 tables with security policies
- API routes — film data, ratings, messaging, watch parties

### Needs building by the community 🔨
- [ ] Film logging button on film pages (API exists, needs frontend wiring)
- [ ] Real-time DM chat interface (API exists, needs chat UI)
- [ ] Watch party room with sync controls (API exists, legally architected)
- [ ] Taste matching scores displayed to users (algorithm written, needs job)
- [ ] Community posts inside clubs (database ready, needs post UI)
- [ ] Letterboxd CSV import (onboarding mentions it, needs implementation)
- [ ] Mobile responsive improvements
- [ ] Push notifications
- [ ] Year in review shareable poster

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
| Total at launch | — | $0/month |

---

## Project Structure

```
reel/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Homepage
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Design system
│   │   ├── not-found.tsx               # 404 page
│   │   ├── error.tsx                   # Error handler
│   │   ├── sitemap.ts                  # Auto sitemap
│   │   ├── films/
│   │   │   ├── page.tsx                # Browse films
│   │   │   └── [id]/page.tsx           # Film detail
│   │   ├── person/[id]/page.tsx        # Cast & crew pages
│   │   ├── search/page.tsx             # Search
│   │   ├── schedule/page.tsx           # Release calendar
│   │   ├── community/page.tsx          # Clubs
│   │   ├── discover/page.tsx           # Find cinephiles
│   │   ├── home/page.tsx               # Logged-in feed
│   │   ├── profile/[username]/page.tsx # User profiles
│   │   ├── messages/page.tsx           # DM inbox
│   │   ├── notifications/page.tsx      # Notifications
│   │   ├── watchlist/page.tsx          # Saved films
│   │   ├── lists/page.tsx              # Curated lists
│   │   ├── stats/page.tsx              # Statistics
│   │   ├── settings/page.tsx           # Edit profile
│   │   ├── donate/page.tsx             # Support Reel
│   │   ├── onboarding/page.tsx         # Taste profile setup
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts       # OAuth handler
│   │   └── api/
│   │       ├── films/search/route.ts   # Search API
│   │       ├── films/[id]/route.ts     # Film detail API
│   │       ├── ratings/route.ts        # Log & rate films
│   │       ├── messages/route.ts       # DM system
│   │       └── watch-party/route.ts    # Watch party sync
│   ├── components/
│   │   └── ui/AuthForm.tsx             # Auth component
│   ├── lib/
│   │   ├── tmdb.ts                     # All TMDB functions
│   │   └── supabase.ts                 # Database client
│   ├── types/
│   │   └── database.ts                 # TypeScript DB types
│   └── middleware.ts                   # Route protection
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql      # Complete DB setup
├── public/
│   └── robots.txt
├── .env.example                        # Environment variables template
├── .gitignore
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── SETUP.md                            # Complete setup guide
└── LICENSE                             # AGPL-3.0
```

---

## Getting Started

**Read [SETUP.md](SETUP.md) for the complete step-by-step guide.**

Quick version:

```bash
# 1. Clone the repo
git clone https://github.com/yourusername/reel.git
cd reel

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in your TMDB API key and Supabase credentials

# 4. Set up the database
# Go to supabase.com, create a project
# Run supabase/migrations/001_initial_schema.sql in the SQL editor

# 5. Run locally
npm run dev
# Open http://localhost:3000
```

**You need:**
- A free TMDB API key from [themoviedb.org](https://themoviedb.org)
- A free Supabase project from [supabase.com](https://supabase.com)
- Node.js installed

**Total cost to run: ₹0**

---

## How to Contribute

Read [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**If you are a developer:**
1. Read the README and SETUP.md completely
2. Run it locally — takes about 20 minutes
3. Look at the "Needs building" list above
4. Open an Issue titled "I want to build [feature]"
5. Let's talk

**The most needed contributions right now:**
1. Film logging button — wire up the existing `/api/ratings` endpoint to the film detail page
2. DM chat UI — build the real-time conversation interface using Supabase Realtime
3. Watch party room — build the sync interface using the existing `/api/watch-party` endpoint
4. Community posts — build the post creation and feed inside clubs

**If you are not a developer:**
- Star this repository so more people find it
- Share it with developers you know
- Tell cinephiles about it
- Post it in film communities

---

## Who Made This

This vision was created by a 16 year old student from Varanasi, India who loves cinema, believes in free and open software, and was inspired by Linus Torvalds, Jimmy Wales, the creators of VLC, and Ratan Tata's philosophy of building things that serve people rather than extract from them.

I cannot build this right now. I have JEE to crack and a life to figure out. But I believe this platform needs to exist, and I believe in open source enough to give the idea to the world and trust the community to do something beautiful with it.

If you build this, I only ask one thing.
**Keep it free. Keep it open. Keep it for the people who love cinema.**

---

## Monetization — There Is None

Reel is sustained by:
- Voluntary donations (Wikipedia model)
- Open source contributions (Linux model)
- Infrastructure sponsorships from cultural institutions
- Small affiliate commissions from cinema ticket bookings (always shows lowest price first)

Every rupee of income is publicly disclosed on the donations page.

---

## License

GNU Affero General Public License v3.0 — see [LICENSE](LICENSE)

This means: anyone can use, modify, and distribute Reel — but any version must also be open source under the same license. Nobody can ever make Reel proprietary. Nobody can take this code, add ads, charge for it, and close the source. The license prevents it permanently.

---

## Links

- [SETUP.md](SETUP.md) — Complete developer setup guide
- [CONTRIBUTING.md](CONTRIBUTING.md) — How to contribute
- [Donate](https://getreel.app/donate) — Voluntary support

---

*"I'm doing a free operating system, just a hobby, won't be big and professional."*
*— Linus Torvalds, 1991*

*Reel might be big. It might stay small. But it will always be free.*

---

Film data provided by [TMDB](https://www.themoviedb.org). This product uses the TMDB API but is not endorsed or certified by TMDB.
