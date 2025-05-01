"use client"

import { useState, useEffect } from "react"
import { Search, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StreamCard from "@/components/stream-card"
import GenreFilter from "@/components/genre-filter"
import { supabase } from "@/lib/supabase"
import { isDatabaseSeeded, seedDatabase } from "@/lib/seed-database"
import type { Stream, Genre } from "@/lib/types"

export default function Home() {
  const [streams, setStreams] = useState<Stream[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [selectedSubfilter, setSelectedSubfilter] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize database and fetch data
  useEffect(() => {
    async function initializeData() {
      try {
        setLoading(true)

        // Check if database is seeded
        const isSeeded = await isDatabaseSeeded()

        // If not seeded, seed the database
        if (!isSeeded) {
          await seedDatabase()
        }

        // Fetch genres with subfilters
        await fetchGenres()

        // Fetch all streams
        await fetchStreams()
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeData()
  }, [])

  // Fetch genres with their subfilters
  async function fetchGenres() {
    try {
      // Fetch all genres
      const { data: genresData, error: genresError } = await supabase.from("genres").select("id, name").order("name")

      if (genresError) {
        throw genresError
      }

      // Fetch all subfilters
      const { data: subfiltersData, error: subfiltersError } = await supabase
        .from("subfilters")
        .select("genre_id, name")

      if (subfiltersError) {
        throw subfiltersError
      }

      // Combine genres with their subfilters
      const genresWithSubfilters = genresData.map((genre) => {
        const genreSubfilters = subfiltersData
          .filter((subfilter) => subfilter.genre_id === genre.id)
          .map((subfilter) => subfilter.name)

        return {
          ...genre,
          subfilters: genreSubfilters.length > 0 ? genreSubfilters : undefined,
        }
      })

      setGenres(genresWithSubfilters)
    } catch (error) {
      console.error("Error fetching genres:", error)
    }
  }

  // Fetch streams with optional filtering
  async function fetchStreams(genreId?: number, game?: string | null) {
    try {
      setLoading(true)

      // Start building the query
      let query = supabase
        .from("streams")
        .select(`
        id, 
        title, 
        streamer_name, 
        genre_id, 
        game, 
        thumbnail, 
        avatar, 
        viewers, 
        language,
        genres(name),
        stream_tags(tags(name))
      `)
        .order("viewers", { ascending: false })

      // Apply genre filter if provided
      if (genreId) {
        query = query.eq("genre_id", genreId)
      }

      // Apply game filter if provided
      if (game) {
        query = query.eq("game", game)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      // Transform the data to match our Stream type
      const transformedStreams = data.map((stream) => {
        return {
          id: stream.id,
          title: stream.title,
          streamer_name: stream.streamer_name,
          genre_id: stream.genre_id,
          genre: stream.genres?.name,
          game: stream.game,
          thumbnail: stream.thumbnail,
          avatar: stream.avatar,
          viewers: stream.viewers,
          language: stream.language,
          tags: stream.stream_tags.map((st: any) => st.tags.name),
        }
      })

      setStreams(transformedStreams)
    } catch (error) {
      console.error("Error fetching streams:", error)
    } finally {
      setLoading(false)
    }
  }

  // Handle genre selection
  const handleGenreSelect = async (genre: Genre | null) => {
    setSelectedGenre(genre)
    setSelectedSubfilter(null)

    if (!genre) {
      await fetchStreams()
    } else {
      await fetchStreams(genre.id)
    }
  }

  // Handle subfilter selection
  const handleSubfilterSelect = async (game: string | null) => {
    setSelectedSubfilter(game)

    if (!game) {
      await fetchStreams(selectedGenre?.id)
    } else {
      await fetchStreams(selectedGenre?.id, game)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] text-white">
      {/* Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-[#18181b] border-b border-[#2d2d32]">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-[#9147ff]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.3 3H21v11.7l-4.7 4.7h-3.9l-2.5 2.4H7v-2.4H3V7.2L4.3 3zM5 17.4h4v2.4h.095l2.5-2.4h3.877L19 13.872V5H5v12.4zM15 8h2v4.7h-2V8zm0 0M9 8h2v4.7H9V8z" />
            </svg>
            <span className="ml-2 font-bold">Browse</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Input className="w-full bg-[#2d2d32] border-none focus-visible:ring-[#9147ff]" placeholder="Search" />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-0 top-0 h-full bg-[#3a3a3d] rounded-l-none hover:bg-[#4a4a4d]"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button className="bg-[#9147ff] hover:bg-[#772ce8] text-white">Sign Up</Button>
          <Button variant="outline" className="border-[#3a3a3d] bg-transparent text-white hover:bg-[#2d2d32]">
            Log In
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Genre Filters */}
        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          selectedSubfilter={selectedSubfilter}
          onGenreSelect={handleGenreSelect}
          onSubfilterSelect={handleSubfilterSelect}
        />

        {/* Stream Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            {selectedGenre ? selectedGenre.name : "All Streams"}
            {selectedSubfilter ? ` › ${selectedSubfilter}` : ""}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#9147ff] border-r-transparent"></div>
              <p className="mt-2 text-gray-400">Loading streams...</p>
            </div>
          ) : streams.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No streams found for this filter.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {streams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
