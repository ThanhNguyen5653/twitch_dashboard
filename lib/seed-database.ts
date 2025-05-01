import { supabase } from "./supabase";
import { genres as genresData } from "./data";

// Function to check if database is already seeded
export async function isDatabaseSeeded() {
  const { count } = await supabase
    .from("genres")
    .select("*", { count: "exact", head: true });

  return count !== null && count > 0;
}

// Function to seed the database with initial data
export async function seedDatabase() {
  console.log("Seeding database...");

  // Insert genres
  for (const genre of genresData) {
    const { data: genreData, error: genreError } = await supabase
      .from("genres")
      .insert({ name: genre.name })
      .select();

    if (genreError) {
      console.error("Error inserting genre:", genreError);
      continue;
    }

    const genreId = genreData[0].id;

    // Insert subfilters if they exist
    if (genre.subfilters) {
      for (const subfilter of genre.subfilters) {
        const { error: subfilterError } = await supabase
          .from("subfilters")
          .insert({ genre_id: genreId, name: subfilter });

        if (subfilterError) {
          console.error("Error inserting subfilter:", subfilterError);
        }
      }
    }
  }

  // Insert common tags
  const commonTags = [
    "JustChatting",
    "Lifestyle",
    "TalkShow",
    "Vlog",
    "RPG",
    "Adventure",
    "OpenWorld",
    "Sandbox",
    "Scary",
    "Survival",
    "Thriller",
    "Gore",
    "FPS",
    "Battle Royale",
    "Competitive",
    "Tactical",
    "Strategy",
    "Board Games",
    "Mental Sports",
    "DropsEnabled",
  ];

  for (const tag of commonTags) {
    const { error } = await supabase.from("tags").insert({ name: tag });

    if (error && error.code !== "23505") {
      // Ignore unique violation errors
      console.error("Error inserting tag:", error);
    }
  }

  // Generate and insert streams
  await generateAndInsertStreams(30);

  console.log("Database seeding completed");
}

// Function to generate and insert random streams
async function generateAndInsertStreams(count: number) {
  // Fetch all genres
  const { data: genres } = await supabase.from("genres").select("id, name");

  if (!genres || genres.length === 0) {
    console.error("No genres found");
    return;
  }

  // Fetch all subfilters
  const { data: subfilters } = await supabase
    .from("subfilters")
    .select("id, genre_id, name");

  // Fetch all tags
  const { data: tags } = await supabase.from("tags").select("id, name");

  if (!tags || tags.length === 0) {
    console.error("No tags found");
    return;
  }

  // Stream titles by genre
  const streamTitles = {
    IRL: [
      "Just Chatting with Viewers!",
      "Cooking Stream - Making Pasta",
      "Travel Vlog - Exploring Tokyo",
      "Q&A Session - Ask Me Anything",
      "Workout Stream - Getting Fit Together",
    ],
    Action: [
      "Epic Boss Fight in God of War!",
      "Minecraft Survival Mode Day 100",
      "Devil May Cry Combo Master",
      "Building a Mega Castle in Minecraft",
      "First Time Playing God of War - No Spoilers!",
    ],
    Horror: [
      "Resident Evil Village - First Playthrough",
      "Silent Hill 2 Remake - Scary Times",
      "Phasmophobia with Friends - Ghost Hunting",
      "Late Night Resident Evil Marathon",
      "Can I Survive Silent Hill? Probably Not.",
    ],
    Shooting: [
      "Warzone Victory Royales All Day",
      "Valorant Ranked Grind to Radiant",
      "Battlefield 2042 - Squad Play with Viewers",
      "Call of Duty Tournament Practice",
      "Valorant New Agent Gameplay",
    ],
    Chess: [
      "Chess.com Tournament - Road to GM",
      "Lichess Puzzles with Viewers",
      "Playing Against Stockfish AI Level 8",
      "Chess Openings Masterclass",
      "Blitz Chess Marathon on Lichess",
    ],
  };

  // Streamer names
  const streamerNames = [
    "NinjaStreamer",
    "ShroudGaming",
    "PokiPlays",
    "DrLupo",
    "TimTheTatman",
    "Valkyrae",
    "Sykkuno",
    "LudwigAhgren",
    "DisguisedToast",
    "Myth",
    "XQcOW",
    "Tfue",
    "Nickmercs",
    "Lirik",
    "Summit1G",
    "DrDisrespect",
    "Amouranth",
    "Pokimane",
    "HasanAbi",
    "AdinRoss",
    "Sodapoppin",
    "Mizkif",
    "AuronPlay",
    "Ibai",
    "TheGrefg",
  ];

  // Generate random streams
  for (let i = 0; i < count; i++) {
    // Select random genre
    const genre = genres[Math.floor(Math.random() * genres.length)];

    // Select random game if genre has subfilters
    let game: string | null = null;
    const genreSubfilters =
      subfilters?.filter((s) => s.genre_id === genre.id) || [];

    if (genreSubfilters.length > 0) {
      game =
        genreSubfilters[Math.floor(Math.random() * genreSubfilters.length)]
          .name;
    }

    // Select random streamer name
    const streamerName =
      streamerNames[Math.floor(Math.random() * streamerNames.length)];

    // Select random title based on genre
    const genreTitles =
      streamTitles[genre.name as keyof typeof streamTitles] || streamTitles.IRL;
    const title = genreTitles[Math.floor(Math.random() * genreTitles.length)];

    // Generate random viewers count
    const viewers = Math.floor(Math.random() * 50000) + 100;

    // Use real thumbnail images based on genre
    // In a real app, you might have multiple thumbnails per genre and select randomly
    const thumbnailIndex = Math.floor(Math.random() * 8) + 1;
    const thumbnail = `/thumbnails/${genre.name.toLowerCase()}-${thumbnailIndex}-min.png`;

    // Use real avatar images
    // In a real app, you might have an avatar for each streamer
    const avatarIndex = Math.floor(Math.random() * 21) + 1;
    const avatar = `/avatars/streamer-${avatarIndex}-min.png`;

    // Insert stream
    const { data: streamData, error: streamError } = await supabase
      .from("streams")
      .insert({
        title,
        streamer_name: streamerName,
        genre_id: genre.id,
        game,
        thumbnail,
        avatar,
        viewers,
        language: "English",
      })
      .select();

    if (streamError) {
      console.error("Error inserting stream:", streamError);
      continue;
    }

    // Insert random tags for the stream
    const streamId = streamData[0].id;
    const genreTags = tags.filter((tag) => {
      const tagName = tag.name.toLowerCase();
      const genreName = genre.name.toLowerCase();

      return (
        tagName.includes(genreName) ||
        (genreName === "irl" &&
          ["justchatting", "lifestyle", "talkshow", "vlog"].includes(
            tagName
          )) ||
        (genreName === "action" &&
          ["rpg", "adventure", "openworld", "sandbox"].includes(tagName)) ||
        (genreName === "horror" &&
          ["scary", "survival", "thriller", "gore"].includes(tagName)) ||
        (genreName === "shooting" &&
          ["fps", "battle royale", "competitive", "tactical"].includes(
            tagName
          )) ||
        (genreName === "chess" &&
          ["strategy", "board games", "mental sports"].includes(tagName))
      );
    });

    // Select 1-3 random tags
    const numTags = Math.floor(Math.random() * 3) + 1;
    const selectedTags = new Set<number>();

    // Add genre-specific tags
    for (let j = 0; j < Math.min(numTags, genreTags.length); j++) {
      const randomIndex = Math.floor(Math.random() * genreTags.length);
      selectedTags.add(genreTags[randomIndex].id);
    }

    // Maybe add DropsEnabled tag
    if (Math.random() > 0.5) {
      const dropsEnabledTag = tags.find((tag) => tag.name === "DropsEnabled");
      if (dropsEnabledTag) {
        selectedTags.add(dropsEnabledTag.id);
      }
    }

    // Insert stream tags
    for (const tagId of selectedTags) {
      const { error: tagError } = await supabase
        .from("stream_tags")
        .insert({ stream_id: streamId, tag_id: tagId });

      if (tagError) {
        console.error("Error inserting stream tag:", tagError);
      }
    }
  }
}
