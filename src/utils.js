

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

const convertToRequiedFormat = ()=>{
const data = {
    across: {

    },
    down: {

    }
  }

  inp.forEach(entry => {
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
  
  console.log(data)
}