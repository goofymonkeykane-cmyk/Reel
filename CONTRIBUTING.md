# Contributing to Reel

Thank you for wanting to help. This document tells you exactly what needs building and how to get started.

---

## The Most Important Rule

Reel must remain free and open source forever.
This is protected by the AGPL-3.0 license and is non-negotiable.

---

## What Needs Building Right Now

These are the highest priority features. The database and API are ready for all of them. They just need a frontend interface.

### 1. Film Logging Button (Beginner friendly)
**File to edit:** `src/app/films/[id]/page.tsx`
**API ready:** `POST /api/ratings`

The film detail page has a "+ Log film" button that currently links to signup. Once a user is logged in, this button should open a small modal where they can:
- Set a star rating (0.5 to 5 stars)
- Mark as rewatch
- Add a short review
- Set the watched date

Then call `POST /api/ratings` with the data.

---

### 2. Real-time DM Chat Interface (Intermediate)
**File to edit:** `src/app/messages/page.tsx`
**API ready:** `GET/POST /api/messages`

The messages page currently shows an empty state. It needs:
- A conversation list on the left showing all conversations
- A chat panel on the right showing messages
- A text input to send new messages
- Real-time updates using Supabase Realtime

Supabase Realtime docs: https://supabase.com/docs/guides/realtime

---

### 3. Watch Party Room (Intermediate)
**File to edit:** Create `src/app/watch-party/[id]/page.tsx`
**API ready:** `GET/POST/PATCH /api/watch-party`

The watch party room needs:
- A "Everyone must log into their own Netflix/Prime/YouTube" notice
- A sync panel showing play/pause/seek controls (host only)
- A live chat sidebar
- A participant list
- Uses `PATCH /api/watch-party` to sync playback for all participants

Legal note: Reel only syncs timing. Never stream content.

---

### 4. Community Posts (Intermediate)
**File to edit:** `src/app/community/page.tsx`
**Database ready:** `posts` and `comments` tables exist

Inside each club, users need to be able to:
- Write a text post (with optional image, optional film tag)
- See posts from other club members
- Like and comment on posts

---

### 5. Taste Matching Scores (Advanced)
**File:** Create `src/app/api/match/route.ts`
**Algorithm written:** `src/lib/tmdb.ts` — `computeTasteScore()`

A background job or API route that:
- Gets all users who have logged 10+ films
- Computes cosine similarity between their rating vectors
- Stores results in the `taste_scores` table
- Updates when a user logs a new film

Then display scores on the discover page.

---

### 6. Letterboxd Import (Intermediate)
**File to edit:** `src/app/onboarding/page.tsx`

Letterboxd allows CSV export. The import needs to:
- Accept a CSV file upload
- Parse the CSV (columns: Date, Name, Year, Letterboxd URI, Rating, Rewatch, Tags, Watched Date)
- Insert each entry into `film_logs` via the ratings API
- Look up each film on TMDB by title and year

---

## How to Get Started

```bash
# 1. Fork this repository on GitHub
# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/reel.git
cd reel

# 3. Install dependencies
npm install

# 4. Set up environment (see SETUP.md for full guide)
cp .env.example .env.local
# Fill in your TMDB API key and Supabase credentials

# 5. Run locally
npm run dev
```

See [SETUP.md](SETUP.md) for the complete setup guide including how to get free TMDB and Supabase accounts.

---

## Opening a Pull Request

1. Create a new branch: `git checkout -b feature/film-logging`
2. Make your changes
3. Test that nothing is broken
4. Open a Pull Request with a clear description of what you built
5. Reference the feature from the list above

---

## Code Style

- TypeScript for everything
- Inline styles matching the existing cinema dark aesthetic
- CSS variables from `globals.css` for all colors
- Server components by default, `'use client'` only when using hooks
- No external UI libraries — the design system is already built

---

## Questions?

Open an Issue. That is the best way to discuss anything.
Title your issue clearly — for example: "I want to build the film logging button"
