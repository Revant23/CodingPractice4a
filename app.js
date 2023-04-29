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

//Get All Players Query  API1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT 
    * 
    FROM 
    cricket_team;`;
  const PlayersArray = await db.all(getPlayersQuery);
  response.send(PlayersArray);
});

//Post a Player Query API2

app.post("/players/", async (request, response) => {
  const PlayerDetails = request.body;
  const { player_name, jersey_number, role } = PlayerDetails;
  const addBookQuery = `
    INSERT INTO
      cricket_team (player_name,jersey_number,role)
    VALUES
      (
        '${player_name}',
         '${jersey_number}',
         '${role}'
        
      );`;

  const dbResponse = await db.run(addBookQuery);
  const player_id = dbResponse.lastID;
  response.send("Player Added to Team");
});

//Returns a player based on a player ID API3
app.get("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const getPlayerQuery = `
    select 
    *
    from 
    cricket_team
    where
    player_id = ${player_id};`;
  const Player = await db.get(getPlayerQuery);
  response.send(Player);
});

//API4
app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const Player_details = request.body;
  const { player_name, jersey_number, role } = Player_details;
  const UpdatePlayerQuery = `
    update
    cricket_team
    set 
    player_name = '${player_name}',
    jersey_number = '${jersey_number}',
    role = '${role}'
    where
    player_id = ${player_id};
    `;
  await db.run(UpdatePlayerQuery);
  response.send("Player Details Updated");
});

//API5
app.delete("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${player_id};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
