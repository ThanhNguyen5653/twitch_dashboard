import type { Stream, Genre } from "./types";

// Define genres with their subfilters
export const genres: Genre[] = [
  { name: "IRL", subfilters: null },
  { name: "Action", subfilters: ["Minecraft", "God of War", "Devil May Cry"] },
  {
    name: "Horror",
    subfilters: ["Resident Evil", "Silent Hill", "Phasmophobia"],
  },
  { name: "Shooting", subfilters: ["Call of Duty", "Battlefield", "Valorant"] },
  { name: "Chess", subfilters: ["Chess.com", "Lichess", "Stockfish AI"] },
];

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
  "TheeDeathBlossom",
];

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
    "Minecraft Speedrun - Can I Beat the Game?",
    "God of War - Exploring the Realms",
  ],
  Horror: [
    "Resident Evil Village - First Playthrough",
    "Silent Hill 2 Remake - Scary Times",
    "Phasmophobia with Friends - Ghost Hunting",
    "Late Night Resident Evil Marathon",
    "Can I Survive Silent Hill? Probably Not.",
    "Playing Resident Evil 4 Remake - No Spoilers!",
    "I'm traumatized ... | Day 59",
  ],
  Shooting: [
    "Warzone Victory Royales All Day",
    "Valorant Ranked Grind to Radiant",
    "Battlefield 2042 - Squad Play with Viewers",
    "Call of Duty Tournament Practice",
    "Valorant New Agent Gameplay",
    "Warzone 2.0 - DMZ Mode with Friends",
    "Valorant - Competitive Grind to Immortal",
  ],
  Chess: [
    "Chess.com Tournament - Road to GM",
    "Lichess Puzzles with Viewers",
    "Playing Against Stockfish AI Level 8",
    "Chess Openings Masterclass",
    "Blitz Chess Marathon on Lichess",
  ],
};

// Tags by genre
const genreTags = {
  IRL: ["JustChatting", "Lifestyle", "TalkShow", "Vlog"],
  Action: ["RPG", "Adventure", "OpenWorld", "Sandbox"],
  Horror: ["Scary", "Survival", "Thriller", "Gore"],
  Shooting: ["FPS", "Battle Royale", "Competitive", "Tactical"],
  Chess: ["Strategy", "Board Games", "Competitive", "Mental Sports"],
};

// Generate a random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate a random stream
const generateStream = (id: number): Stream => {
  // Select random genre
  const genre = genres[randomNumber(0, genres.length - 1)].name;

  // Select random game if genre has subfilters
  const genreObj = genres.find((g) => g.name === genre);
  let game: string | null = null;

  if (genreObj?.subfilters) {
    game = genreObj.subfilters[randomNumber(0, genreObj.subfilters.length - 1)];
  }

  // Select random streamer name
  const streamerName = streamerNames[randomNumber(0, streamerNames.length - 1)];

  // Select random title based on genre
  const title =
    streamTitles[genre][randomNumber(0, streamTitles[genre].length - 1)];

  // Select random tags based on genre
  const tags = [];
  const availableTags = genreTags[genre];
  const numTags = randomNumber(1, 3);

  for (let i = 0; i < numTags; i++) {
    const randomTag = availableTags[randomNumber(0, availableTags.length - 1)];
    if (!tags.includes(randomTag)) {
      tags.push(randomTag);
    }
  }

  // Add common tags
  if (randomNumber(0, 1) === 1) tags.push("DropsEnabled");

  // Generate random viewers count
  const viewers = randomNumber(100, 50000);

  // Generate random thumbnail
  const thumbnailId = randomNumber(1, 8);
  const thumbnailWidth = 640;
  const thumbnailHeight = 360;
  const thumbnail = `/placeholder.svg?height=${thumbnailHeight}&width=${thumbnailWidth}&text=${genre}${
    game ? " - " + game : ""
  }`;

  return {
    id: `stream-${id}`,
    title,
    streamerName,
    genre,
    game,
    thumbnail,
    viewers,
    language: "English",
    tags,
  };
};

// Generate multiple streams
export const generateStreams = (count: number): Stream[] => {
  const streams: Stream[] = [];

  for (let i = 0; i < count; i++) {
    streams.push(generateStream(i));
  }

  // Sort by viewers (highest first)
  return streams.sort((a, b) => b.viewers - a.viewers);
};
