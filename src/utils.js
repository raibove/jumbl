// export const BACKEND_URL = 'http://127.0.0.1:8787'; 
export const BACKEND_URL = 'https://jumbl-api.yikew40375.workers.dev';

export const backupCrosswordIds = ["c58f0b8c-b14d-4e74-9831-bd73134cf89a", ]

export const crosswordTopics = [
  "Harry Potter series",
  "Solar system planets",
  "Blockchain technology",
  "World news",
  "Classical music composers",
  "Acoustic engineering",
  "Italian cuisine",
  "Color theory",
  "Famous inventors",
  "Science fiction novels",
  "Mars exploration",
  "Quantum computing",
  "Current events",
  "Rock bands of the '70s",
  "Sound design in films",
  "French pastries",
  "Shades of blue",
  "Ancient civilizations",
  "Artificial intelligence",
  "Space missions",
  "Environmental issues",
  "Jazz musicians",
  "Audio recording techniques",
  "Mexican street food",
  "Color symbolism",
  "Famous artists",
  "Renewable energy",
  "Political leaders",
  "Pop music hits",
  "Audio effects",
  "Indian spices",
  "Famous landmarks",
  "Digital currencies",
  "Major sports events",
  "Broadway musicals",
  "Oceanography",
  "Chinese cuisine",
  "Renaissance art",
  "Virtual reality",
  "Astronomy discoveries",
  "Media moguls",
  "Hip hop culture",
  "Soundtracks of movies",
  "French cheeses",
  "Famous bridges",
  "Cybersecurity",
  "Wildlife conservation",
  "Country music legends",
  "Soundproofing materials",
  "Mediterranean diet",
  "Famous novels",
  "Renewable resources",
  "Influential women in history",
  "Classical operas",
  "Sound wave properties",
  "Japanese sushi",
  "World capitals",
  "Internet of Things (IoT)",
  "Endangered species",
  "Reggae music",
  "Echo and reverb effects",
  "Greek mythology",
  "Famous painters",
  "Electric cars",
  "Climate change",
  "Folk music traditions",
  "Sound frequencies",
  "Street food around the world",
  "Famous authors",
  "Space telescopes",
  "Social media trends",
  "Blues musicians",
  "Recording studios",
  "Thai cuisine",
  "Historic events",
  "Genetic engineering",
  "Human rights activists",
  "Electronic dance music (EDM)",
  "Noise-canceling technology",
  "Brazilian dishes",
  "Famous poems",
  "Space shuttles",
  "Media ethics",
  "Punk rock bands",
  "Sound intensity levels",
  "Vegetarian recipes",
  "Nobel Prize winners",
  "Exoplanet discoveries",
  "Technology startups",
  "Jazz age",
  "Speaker design",
  "Korean BBQ",
  "Historical fiction",
  "Mars rovers",
  "Tech entrepreneurs",
  "Indie music scene",
  "Sound mixing techniques",
  "Lebanese cuisine",
  "Classic literature",
  "Hubble Space Telescope"
];


const inp = [
    {
        "answer": "downpour",
        "clue": "Heavy and prolonged rainfall",
        "startx": 2,
        "starty": 4,
        "orientation": "across",
        "position": 1
    },
    {
        "answer": "shower",
        "clue": "Brief period of rain",
        "startx": 4,
        "starty": 1,
        "orientation": "down",
        "position": 2
    },
    {
        "answer": "monsoon",
        "clue": "Seasonal wind bringing heavy rains",
        "startx": 1,
        "starty": 1,
        "orientation": "across",
        "position": 3
    },
    {
        "answer": "rainlet",
        "clue": "A very light rain",
        "startx": 2,
        "starty": 9,
        "orientation": "across",
        "position": 4
    },
    {
        "answer": "sprinkle",
        "clue": "To rain lightly or scatter drops of rain",
        "startx": 6,
        "starty": 3,
        "orientation": "down",
        "position": 5
    },
    {
        "answer": "rainfall",
        "clue": "The process of precipitation from clouds",
        "orientation": "none"
    },
    {
        "answer": "drought",
        "clue": "A prolonged period without significant rain",
        "startx": 2,
        "starty": 8,
        "orientation": "down",
        "position": 6
    },
    {
        "answer": "pour",
        "clue": "To rain heavily or flow or come in a stream",
        "startx": 8,
        "starty": 2,
        "orientation": "down",
        "position": 7
    }
  ]

export const convertToRequiedFormat = (inputData)=>{
const data = {
    across: {

    },
    down: {

    }
  }

  inputData.forEach(entry => {
    if (entry.orientation !== "none") {
      const row = entry.starty - 1; // Adjusting for zero-based index
      const col = entry.startx - 1; // Adjusting for zero-based index

      const formattedEntry = {
        clue: entry.clue,
        answer: entry.answer,
        row: row,
        col: col
      };

      if (entry.orientation === "across") {
        data.across[entry.position] = formattedEntry;
      } else if (entry.orientation === "down") {
        data.down[entry.position] = formattedEntry;
      }
    }
  });
  return data;
}

export const cleanAndParseInputString = (cluesString) => {
  try {
    let fixedInput = cluesString
      .replace(/,\s*([\]}])/g, '$1')
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":')
      .replace(/'/g, '"');
    let result = JSON.parse(fixedInput);
    return result;
  } catch (err) {
    console.log(err);
    return [];
  }
};