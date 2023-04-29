const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(4000, () => {
      console.log("Server Running at http://localhost:4000/");
    });
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//Get All Players Query
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
    * 
    FROM 
    cricket_team;`;
  const PlayersArray = await db.all(getPlayersQuery);
  response.send(PlayersArray);
});

//Post a Player Query

app.post("/players/", async (request, response) => {
  const PlayerDetails = request.body;
  const { player_name, jersey_number, role } = PlayerDetails;
  const addBookQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${player_name}',
         ${jersey_number},
         ${role}
        
      );`;

  const dbResponse = await db.run(addBookQuery);
  const player_id = dbResponse.lastID;
  response.send({ player_id: player_id });
});
