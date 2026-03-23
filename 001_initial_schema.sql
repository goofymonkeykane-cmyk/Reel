-- ============================================
-- REEL - Complete Database Schema
-- Run this in your Supabase SQL editor
-- ============================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users
-- ============================================
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  backdrop_url text,
  letterboxd_username text,
  location text,
  website text,
  is_verified boolean default false,
  films_count integer default 0,
  followers_count integer default 0,
  following_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- FILMS TABLE (cached from TMDB)
-- ============================================
create table public.films (
  id integer primary key,
  tmdb_id integer unique not null,
  title text not null,
  original_title text,
  overview text,
  poster_path text,
  backdrop_path text,
  release_date date,
  runtime integer,
  vote_average numeric(3,1),
  vote_count integer,
  popularity numeric(10,3),
  original_language text,
  genres jsonb,
  production_countries jsonb,
  media_type text default 'movie' check (media_type in ('movie', 'tv', 'anime', 'documentary')),
  created_at timestamptz default now()
);

-- ============================================
-- USER FILM LOGS (diary entries)
-- ============================================
create table public.film_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  film_id integer references public.films(tmdb_id) not null,
  rating numeric(2,1) check (rating >= 0.5 and rating <= 5.0),
  is_rewatch boolean default false,
  watched_date date default current_date,
  review text,
  review_contains_spoilers boolean default false,
  liked boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, film_id, watched_date)
);

-- ============================================
-- WATCHLIST
-- ============================================
create table public.watchlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  film_id integer not null,
  film_title text not null,
  film_poster text,
  added_at timestamptz default now(),
  unique(user_id, film_id)
);

-- ============================================
-- LISTS (curated collections)
-- ============================================
create table public.lists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  is_public boolean default true,
  likes_count integer default 0,
  films_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.list_films (
  id uuid default uuid_generate_v4() primary key,
  list_id uuid references public.lists(id) on delete cascade not null,
  film_id integer not null,
  film_title text not null,
  film_poster text,
  position integer,
  note text,
  added_at timestamptz default now()
);

-- ============================================
-- FOLLOWS
-- ============================================
create table public.follows (
  follower_id uuid references public.profiles(id) on delete cascade not null,
  following_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- ============================================
-- TASTE COMPATIBILITY SCORES
-- Precomputed for fast matching
-- ============================================
create table public.taste_scores (
  user_a uuid references public.profiles(id) on delete cascade not null,
  user_b uuid references public.profiles(id) on delete cascade not null,
  score numeric(4,1) check (score >= 0 and score <= 100),
  computed_at timestamptz default now(),
  primary key (user_a, user_b)
);

-- ============================================
-- FRIEND CONNECTIONS
-- ============================================
create table public.connections (
  id uuid default uuid_generate_v4() primary key,
  requester_id uuid references public.profiles(id) on delete cascade not null,
  receiver_id uuid references public.profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(requester_id, receiver_id)
);

-- ============================================
-- DIRECT MESSAGES
-- ============================================
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now()
);

create table public.conversation_participants (
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  last_read_at timestamptz,
  primary key (conversation_id, user_id)
);

create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text,
  message_type text default 'text' check (message_type in ('text', 'image', 'film_share', 'watchlist_share', 'watch_party_invite')),
  metadata jsonb,
  is_deleted boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- WATCH PARTIES
-- ============================================
create table public.watch_parties (
  id uuid default uuid_generate_v4() primary key,
  host_id uuid references public.profiles(id) on delete cascade not null,
  film_id integer,
  film_title text not null,
  film_poster text,
  ott_platform text not null,
  scheduled_at timestamptz,
  started_at timestamptz,
  ended_at timestamptz,
  status text default 'scheduled' check (status in ('scheduled', 'live', 'ended')),
  sync_state jsonb default '{"position": 0, "is_playing": false}',
  invite_code text unique default substring(md5(random()::text), 1, 8),
  max_participants integer default 20,
  created_at timestamptz default now()
);

create table public.watch_party_participants (
  party_id uuid references public.watch_parties(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  joined_at timestamptz default now(),
  primary key (party_id, user_id)
);

-- ============================================
-- COMMUNITY CLUBS
-- ============================================
create table public.clubs (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  icon text,
  banner_url text,
  members_count integer default 0,
  posts_count integer default 0,
  is_official boolean default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

create table public.club_members (
  club_id uuid references public.clubs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'member' check (role in ('member', 'moderator', 'admin')),
  joined_at timestamptz default now(),
  primary key (club_id, user_id)
);

-- ============================================
-- COMMUNITY POSTS
-- ============================================
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  club_id uuid references public.clubs(id) on delete set null,
  content text not null,
  image_url text,
  film_reference jsonb,
  likes_count integer default 0,
  comments_count integer default 0,
  is_spoiler boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.post_likes (
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  likes_count integer default 0,
  created_at timestamptz default now()
);

-- ============================================
-- LOCK-IN (following cast/crew)
-- ============================================
create table public.person_locks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  tmdb_person_id integer not null,
  person_name text not null,
  person_photo text,
  person_role text,
  notify_new_project boolean default true,
  notify_trailer boolean default true,
  notify_theatre boolean default true,
  notify_streaming boolean default true,
  notify_awards boolean default false,
  locked_at timestamptz default now(),
  unique(user_id, tmdb_person_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  body text,
  image_url text,
  link text,
  is_read boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- INTERESTED IN UPCOMING FILMS
-- ============================================
create table public.film_interests (
  user_id uuid references public.profiles(id) on delete cascade not null,
  film_id integer not null,
  film_title text not null,
  film_poster text,
  release_date date,
  created_at timestamptz default now(),
  primary key (user_id, film_id)
);

-- ============================================
-- REVIEW LIKES
-- ============================================
create table public.review_likes (
  log_id uuid references public.film_logs(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now(),
  primary key (log_id, user_id)
);

-- ============================================
-- DONATIONS (voluntary, no features locked)
-- ============================================
create table public.donations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null,
  amount_inr integer not null,
  currency text default 'INR',
  donor_name text,
  message text,
  is_anonymous boolean default false,
  created_at timestamptz default now()
);

-- ============================================
-- INDEXES for performance
-- ============================================
create index idx_film_logs_user on public.film_logs(user_id);
create index idx_film_logs_film on public.film_logs(film_id);
create index idx_film_logs_date on public.film_logs(watched_date desc);
create index idx_posts_club on public.posts(club_id);
create index idx_posts_author on public.posts(author_id);
create index idx_messages_conversation on public.messages(conversation_id);
create index idx_notifications_user on public.notifications(user_id, is_read);
create index idx_profiles_username on public.profiles using gin(username gin_trgm_ops);
create index idx_taste_scores_user_a on public.taste_scores(user_a, score desc);

-- ============================================
-- ROW LEVEL SECURITY
-- Users can only see/edit their own private data
-- ============================================
alter table public.profiles enable row level security;
alter table public.film_logs enable row level security;
alter table public.watchlist enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.connections enable row level security;
alter table public.person_locks enable row level security;

-- Profiles: public read, own write
create policy "Profiles are publicly readable"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Film logs: public read, own write
create policy "Film logs are publicly readable"
  on public.film_logs for select using (true);

create policy "Users can manage own film logs"
  on public.film_logs for all using (auth.uid() = user_id);

-- Watchlist: private
create policy "Users can manage own watchlist"
  on public.watchlist for all using (auth.uid() = user_id);

-- Messages: only participants
create policy "Users can see their own messages"
  on public.messages for select using (
    auth.uid() in (
      select user_id from public.conversation_participants
      where conversation_id = messages.conversation_id
    )
  );

create policy "Users can send messages in their conversations"
  on public.messages for insert with check (
    auth.uid() = sender_id and
    auth.uid() in (
      select user_id from public.conversation_participants
      where conversation_id = messages.conversation_id
    )
  );

-- Notifications: private
create policy "Users can see own notifications"
  on public.notifications for all using (auth.uid() = user_id);

-- Person locks: private
create policy "Users can manage own locks"
  on public.person_locks for all using (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update film count when log added
create or replace function public.update_film_count()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles
    set films_count = films_count + 1
    where id = new.user_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles
    set films_count = greatest(0, films_count - 1)
    where id = old.user_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger on_film_log_change
  after insert or delete on public.film_logs
  for each row execute procedure public.update_film_count();

-- Update follower counts
create or replace function public.update_follow_counts()
returns trigger language plpgsql as $$
begin
  if TG_OP = 'INSERT' then
    update public.profiles set following_count = following_count + 1 where id = new.follower_id;
    update public.profiles set followers_count = followers_count + 1 where id = new.following_id;
  elsif TG_OP = 'DELETE' then
    update public.profiles set following_count = greatest(0, following_count - 1) where id = old.follower_id;
    update public.profiles set followers_count = greatest(0, followers_count - 1) where id = old.following_id;
  end if;
  return coalesce(new, old);
end;
$$;

create trigger on_follow_change
  after insert or delete on public.follows
  for each row execute procedure public.update_follow_counts();

-- ============================================
-- SEED DATA - Default Clubs
-- ============================================
insert into public.clubs (name, slug, description, icon, is_official) values
  ('Indian Cinema', 'indian-cinema', 'Bollywood, South Indian, parallel cinema and everything in between', '🎬', true),
  ('Marvel', 'marvel', 'The Marvel Cinematic Universe and Marvel comics adaptations', '🦸', true),
  ('DC', 'dc', 'DC Universe films, series and animated features', '🦇', true),
  ('World Cinema', 'world-cinema', 'Stories from every corner of the globe, told in every language', '🌍', true),
  ('Anime', 'anime', 'Japanese animation from classics to seasonal releases', '🌸', true),
  ('K-Drama', 'k-drama', 'Korean drama series — if you are not crying by episode 3 are you even watching', '🌸', true),
  ('Film-Making', 'film-making', 'For people who love turning ideas into scenes and scenes into stories', '🎥', true),
  ('Horror', 'horror', 'Everything that goes bump in the night', '👻', true),
  ('Documentaries', 'documentaries', 'Real stories, real people, real world', '📽️', true),
  ('Classic Cinema', 'classic-cinema', 'Films from the golden age of cinema to the 1990s', '🎞️', true);
