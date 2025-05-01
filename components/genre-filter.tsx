"use client"

import { Button } from "@/components/ui/button"
import type { Genre } from "@/lib/types"

interface GenreFilterProps {
  genres: Genre[]
  selectedGenre: Genre | null
  selectedSubfilter: string | null
  onGenreSelect: (genre: Genre | null) => void
  onSubfilterSelect: (game: string | null) => void
}

export default function GenreFilter({
  genres,
  selectedGenre,
  selectedSubfilter,
  onGenreSelect,
  onSubfilterSelect,
}: GenreFilterProps) {
  return (
    <div className="space-y-3">
      {/* Main Genre Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedGenre ? "default" : "outline"}
          className={
            !selectedGenre
              ? "bg-[#9147ff] hover:bg-[#772ce8]"
              : "border-[#3a3a3d] bg-transparent text-white hover:bg-[#2d2d32]"
          }
          onClick={() => onGenreSelect(null)}
        >
          All
        </Button>

        {genres.map((genre) => (
          <Button
            key={genre.id}
            variant={selectedGenre?.id === genre.id ? "default" : "outline"}
            className={
              selectedGenre?.id === genre.id
                ? "bg-[#9147ff] hover:bg-[#772ce8]"
                : "border-[#3a3a3d] bg-transparent text-white hover:bg-[#2d2d32]"
            }
            onClick={() => onGenreSelect(genre)}
          >
            {genre.name}
          </Button>
        ))}
      </div>

      {/* Subfilters (if applicable) */}
      {selectedGenre && selectedGenre.subfilters && selectedGenre.subfilters.length > 0 && (
        <div className="flex flex-wrap gap-2 pl-2 border-l-2 border-[#9147ff]">
          <Button
            variant={!selectedSubfilter ? "default" : "outline"}
            size="sm"
            className={
              !selectedSubfilter
                ? "bg-[#9147ff] hover:bg-[#772ce8]"
                : "border-[#3a3a3d] bg-transparent text-white hover:bg-[#2d2d32]"
            }
            onClick={() => onSubfilterSelect(null)}
          >
            All {selectedGenre.name}
          </Button>

          {selectedGenre.subfilters.map((game) => (
            <Button
              key={game}
              variant={selectedSubfilter === game ? "default" : "outline"}
              size="sm"
              className={
                selectedSubfilter === game
                  ? "bg-[#9147ff] hover:bg-[#772ce8]"
                  : "border-[#3a3a3d] bg-transparent text-white hover:bg-[#2d2d32]"
              }
              onClick={() => onSubfilterSelect(game)}
            >
              {game}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
