import express from 'express';
import logger from 'morgan';
import { MongoClient, ServerApiVersion } from 'mongodb';

// MongoDB database Code
const url = "INSERT URL HERE";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");

    // Start Express server
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

// CRUD operations
async function createPlaylist(response, name) {
  if (!name) {
    response.status(400).json({ error: 'Playlist name is required' });
    return;
  }
  try {
    await client.db("SpotifyGenPlaylists").collection("playlists").insertOne({ name});
    response.status(201).json({ message: 'Playlist created' });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Error while creating playlist' });
  }
}

async function readPlaylist(response, name) {
  try {
    const playlist = await client.db("SpotifyGenPlaylists").collection("playlists").findOne({ name });
    if (playlist) {
      response.json(playlist);
    } else {
      response.status(404).json({ error: `Playlist '${name}' Not Found` });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}

async function updatePlaylist(response, name, updateData) {
  try {
    const result = await client.db("SpotifyGenPlaylists").collection("playlists").updateOne({ name }, { $set: updateData });
    if (result.modifiedCount === 0) {
      response.status(404).json({ error: `Playlist '${name}' Not Found` });
    } else {
      response.json({ message: 'Playlist updated' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}

async function deletePlaylist(response, name) {
  try {
    const result = await client.db("SpotifyGenPlaylists").collection("playlists").deleteOne({ name });
    if (result.deletedCount === 0) {
      response.status(404).json({ error: `Playlist '${name}' Not Found` });
    } else {
      response.json({ message: 'Playlist deleted' });
    }
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}

async function dumpPlaylists(response) {
  try {
    const playlists = await client.db("SpotifyGenPlaylists").collection("playlists").find({}).toArray();
    response.json(playlists);
  } catch (err) {
    console.error(err);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}

// Express app setup
const app = express();
const port = 3000;
app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/client', express.static('client'));

// Express routes
app.post('/create', async (request, response) => {
  const { name, tracks } = request.body;
  createPlaylist(response, name, tracks);
});

app.get('/read', async (request, response) => {
  const { name } = request.query;
  readPlaylist(response, name);
});

app.put('/update', async (request, response) => {
  const { name } = request.query;
  const updateData = request.body;  // Expecting JSON body with fields to update
  updatePlaylist(response, name, updateData);
});

app.delete('/delete', async (request, response) => {
  const { name } = request.query;
  deletePlaylist(response, name);
});

app.get('/dump', async (request, response) => {
  dumpPlaylists(response);
});

app.get('*', (request, response) => {
  response.status(404).send(`Not found: ${request.path}`);
});

// Start MongoDB and Express server
run().catch(console.error);
