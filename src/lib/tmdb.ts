// ============================================
// REEL - TMDB API Library
// All film, series, anime, person data
// Free API - get key at themoviedb.org
// ============================================

const TMDB_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3'
const TMDB_IMG = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p'

// Image URL helpers
export const tmdbImage = {
  poster: (path: string | null, size: 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
    path ? `${TMDB_IMG}/${size}${path}` : null,
  backdrop: (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${TMDB_IMG}/${size}${path}` : null,
  profile: (path: string | null, size: 'w185' | 'w632' | 'original' = 'w185') =>
    path ? `${TMDB_IMG}/${size}${path}` : null,
}

// Core fetch function
async function tmdbFetch(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', TMDB_KEY || '')
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  })

  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)
  return res.json()
}

// ============================================
// SEARCH
// ============================================
export async function searchMulti(query: string, page = 1) {
  return tmdbFetch('/search/multi', { query, page: String(page) })
}

export async function searchFilms(query: string, page = 1) {
  return tmdbFetch('/search/movie', { query, page: String(page) })
}

export async function searchTV(query: string, page = 1) {
  return tmdbFetch('/search/tv', { query, page: String(page) })
}

export async function searchPerson(query: string) {
  return tmdbFetch('/search/person', { query })
}

// ============================================
// FILMS
// ============================================
export async function getFilm(id: number) {
  return tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,watch/providers,similar,recommendations,videos,release_dates',
  })
}

export async function getTrending(timeWindow: 'day' | 'week' = 'week') {
  return tmdbFetch(`/trending/all/${timeWindow}`)
}

export async function getPopularFilms(page = 1) {
  return tmdbFetch('/movie/popular', { page: String(page) })
}

export async function getNowPlaying(page = 1, region = 'IN') {
  return tmdbFetch('/movie/now_playing', { page: String(page), region })
}

export async function getUpcoming(page = 1, region = 'IN') {
  return tmdbFetch('/movie/upcoming', { page: String(page), region })
}

export async function getTopRated(page = 1) {
  return tmdbFetch('/movie/top_rated', { page: String(page) })
}

export async function getFilmsByGenre(genreId: number, page = 1) {
  return tmdbFetch('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: 'popularity.desc',
  })
}

// ============================================
// TV SERIES AND ANIME
// ============================================
export async function getSeries(id: number) {
  return tmdbFetch(`/tv/${id}`, {
    append_to_response: 'credits,watch/providers,similar,recommendations,videos',
  })
}

export async function getSeriesSeason(seriesId: number, seasonNumber: number) {
  return tmdbFetch(`/tv/${seriesId}/season/${seasonNumber}`)
}

export async function getSeriesEpisode(seriesId: number, season: number, episode: number) {
  return tmdbFetch(`/tv/${seriesId}/season/${season}/episode/${episode}`)
}

export async function getPopularSeries(page = 1) {
  return tmdbFetch('/tv/popular', { page: String(page) })
}

export async function getAnime(page = 1) {
  // Anime: Japanese animation
  return tmdbFetch('/discover/tv', {
    with_original_language: 'ja',
    with_genres: '16', // Animation genre
    page: String(page),
    sort_by: 'popularity.desc',
  })
}

export async function getTopRatedSeries() {
  return tmdbFetch('/tv/top_rated')
}

// ============================================
// PEOPLE (Cast and Crew - Lock-in feature)
// ============================================
export async function getPerson(id: number) {
  return tmdbFetch(`/person/${id}`, {
    append_to_response: 'movie_credits,tv_credits,combined_credits',
  })
}

export async function getPersonFilmography(id: number) {
  return tmdbFetch(`/person/${id}/combined_credits`)
}

// ============================================
// WATCH PROVIDERS (Where to Watch)
// ============================================
export async function getWatchProviders(filmId: number, type: 'movie' | 'tv' = 'movie', region = 'IN') {
  const data = await tmdbFetch(`/${type}/${filmId}/watch/providers`)
  return data.results?.[region] || null
}

// ============================================
// GENRES
// ============================================
export async function getGenres(type: 'movie' | 'tv' = 'movie') {
  return tmdbFetch(`/genre/${type}/list`)
}

// ============================================
// DISCOVER with filters
// ============================================
export async function discoverFilms(filters: {
  genre?: string
  year?: string
  language?: string
  country?: string
  sort?: string
  page?: number
}) {
  const params: Record<string, string> = {
    page: String(filters.page || 1),
    sort_by: filters.sort || 'popularity.desc',
  }
  if (filters.genre) params.with_genres = filters.genre
  if (filters.year) params.primary_release_year = filters.year
  if (filters.language) params.with_original_language = filters.language
  if (filters.country) params.with_origin_country = filters.country

  return tmdbFetch('/discover/movie', params)
}

// ============================================
// BOLLYWOOD / INDIAN CINEMA specific
// ============================================
export async function getBollywood(page = 1) {
  return tmdbFetch('/discover/movie', {
    with_origin_country: 'IN',
    with_original_language: 'hi',
    page: String(page),
    sort_by: 'popularity.desc',
  })
}

export async function getSouthIndianCinema(language: 'ta' | 'te' | 'ml' | 'kn', page = 1) {
  return tmdbFetch('/discover/movie', {
    with_origin_country: 'IN',
    with_original_language: language,
    page: String(page),
    sort_by: 'popularity.desc',
  })
}

// ============================================
// RELEASING TODAY (for Schedule feature)
// ============================================
export async function getReleasingToday(region = 'IN') {
  const today = new Date().toISOString().split('T')[0]
  return tmdbFetch('/discover/movie', {
    'primary_release_date.gte': today,
    'primary_release_date.lte': today,
    region,
    sort_by: 'popularity.desc',
  })
}

export async function getReleasingThisWeek(region = 'IN') {
  const today = new Date()
  const weekLater = new Date(today)
  weekLater.setDate(weekLater.getDate() + 7)
  return tmdbFetch('/discover/movie', {
    'primary_release_date.gte': today.toISOString().split('T')[0],
    'primary_release_date.lte': weekLater.toISOString().split('T')[0],
    region,
    sort_by: 'primary_release_date.asc',
  })
}

// ============================================
// TASTE COMPATIBILITY ALGORITHM
// Cosine similarity on rating vectors
// ============================================
export function computeTasteScore(
  userARatings: Record<number, number>,
  userBRatings: Record<number, number>
): number {
  const commonFilms = Object.keys(userARatings).filter(
    (id) => userBRatings[Number(id)] !== undefined
  )

  if (commonFilms.length < 3) return 0 // Need at least 3 films in common

  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0

  commonFilms.forEach((filmId) => {
    const ratingA = userARatings[Number(filmId)]
    const ratingB = userBRatings[Number(filmId)]
    dotProduct += ratingA * ratingB
    magnitudeA += ratingA * ratingA
    magnitudeB += ratingB * ratingB
  })

  const similarity = dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
  return Math.round(similarity * 100)
}
