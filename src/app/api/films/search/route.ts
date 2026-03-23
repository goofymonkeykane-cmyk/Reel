import { NextRequest, NextResponse } from 'next/server'
import { searchMulti } from '@/lib/tmdb'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')
  const page = request.nextUrl.searchParams.get('page') || '1'

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const data = await searchMulti(query, parseInt(page))
    // Filter to only films, tv, and people
    const results = data.results?.filter(
      (r: any) => ['movie', 'tv', 'person'].includes(r.media_type)
    ) || []

    return NextResponse.json({
      results,
      total_results: data.total_results,
      total_pages: data.total_pages,
      page: data.page,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to search. Check your TMDB API key.' },
      { status: 500 }
    )
  }
}
