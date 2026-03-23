import { NextRequest, NextResponse } from 'next/server'
import { getFilm, getSeries, getWatchProviders } from '@/lib/tmdb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const type = request.nextUrl.searchParams.get('type') || 'movie'
  const id = parseInt(params.id)

  if (isNaN(id)) {
    return NextResponse.json({ error: 'Invalid film ID' }, { status: 400 })
  }

  try {
    const film = type === 'tv' ? await getSeries(id) : await getFilm(id)
    const providers = await getWatchProviders(id, type as 'movie' | 'tv', 'IN')

    return NextResponse.json({ film, providers })
  } catch (error) {
    return NextResponse.json(
      { error: 'Film not found' },
      { status: 404 }
    )
  }
}
