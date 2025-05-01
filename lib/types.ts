export interface Stream {
  id: number
  title: string
  streamer_name: string
  genre_id: number
  genre?: string // Joined from genres table
  game: string | null
  thumbnail: string
  avatar?: string // New field for profile image
  viewers: number
  language: string
  tags?: string[] // Joined from tags table
  created_at?: string
}

export interface Genre {
  id: number
  name: string
  subfilters?: string[] // Joined from subfilters table
  created_at?: string
}

export interface Subfilter {
  id: number
  genre_id: number
  name: string
  created_at?: string
}

export interface Tag {
  id: number
  name: string
  created_at?: string
}
