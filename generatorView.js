import * as crud from './crud.js';
export default class GeneratorView {

  // Constructor object used to hold all playlists 
  constructor () {
    this.playlistTracks_object = {}; 
  }

  // Render method
  render() {
    const view = `
      <h1 style="color:rgb(179, 144, 179)"> Generator View </h1>
      <p> This is the Generator View. In here you would be able to generate a random playlist just on the
      click of a button! </p>

      <form>
        <center> 
          <h2 style="margin-top: 30px;"> Input Playlist Name: </h2> 
            <label for="name-input">Name: </label>
            <input type="text" id="name-input">
            <br> 
            <div id="crud-buttons" style="margin:20px;"> 
              <button id="create-button" class="crud-button"> Create Playlist </button>
              <button id="read-button" class="crud-button"> Read Playlist </button>
              <button id="update-button" class="crud-button"> Update Playlist </button>
              <button id="delete-button" class="crud-button"> Delete Playlist </button>
            </div> 
        </center> 
      </form>

      <center style="font-size: 20px; margin-top: 30px;">
        <div class="saved-container">
        <h3>Generated Playlists:</h3>
          <ul id="output"></ul>
        </div>
        <div class="gen-container">
          <h3 id="gen-title"> : </h3>
            <ul id="list"></ul>
        </div>
      </center> 
    `;

    // Create a new div element to hold the view
    const div = document.createElement('div');
    div.innerHTML = view;

    // Attach event listeners and handle playlist generation
    this.attachEventListeners(div);
    this.readPlaylists();
    return div;
  }

  // read all playlists function 
  async readPlaylists() {
    const playlists = await crud.readAllPlaylists();
    const output = document.getElementById('output');

    // Clear the output
    output.innerHTML = '';

    // Iterate over the playlists and create list items
    playlists.forEach(playlist => {
        const listItem = document.createElement('li');
        listItem.textContent = playlist.name;
        listItem.style.listStyleType = 'none';
        output.appendChild(listItem);
    });
  }

  // Attach event listeners and handle playlist generation
  attachEventListeners(div) {
    const createButton = div.querySelector('#create-button'); // create
    const readButton = div.querySelector('#read-button'); // read
    const updateButton = div.querySelector('#update-button'); // update 
    const deleteButton = div.querySelector('#delete-button'); // delete
    const input = div.querySelector('#name-input');
    
    
    // Event listener for create playlist button
    createButton.addEventListener('click', async(event) => {
      event.preventDefault();
      const title = document.getElementById('gen-title'); 
      // Update title for container
      title.innerHTML = `${input.value}:`;

      await crud.createPlaylist(input.value); // crud create  
      await this.readPlaylists(); // update all saved playlists

      // Generate random songs and render them
      await this.generateRandomSongs();
    });

    // Event listener for read playlist button 
    readButton.addEventListener('click', async(event) => {
      event.preventDefault(); 
      const title = document.getElementById('gen-title'); 
      // Update title for container
      title.innerHTML = `${input.value}:`;

      console.log(this.playlistTracks_object);

      await crud.readPlaylist(input.value); // crud read 
      const playlistTracks = this.playlistTracks_object[input.value];
      // Grab list element 
      const list = document.getElementById('list');
      // Clear the list before generating new ones
      list.innerHTML = '';
      // render the songs into the container 
      playlistTracks.forEach(track => {
        //const listItem = document.createElement('li');
        const image = `<img src="${track.album.images[0].url}" alt="${track.name}" style="width: 200px; height: 200px;">`;
        const name = `<span>${track.name}</span>`;
        const artist = `<span> <strong> - ${track.artists[0].name} <strong> </span>`;
        const listItem = `<li>${image}<br>${name}<br>${artist}</li>`;
        
        // Append the list item HTML to the list
        list.innerHTML += listItem;
      });
    }); 

    // Event listener for update playlist button 
    updateButton.addEventListener('click', async(event) => {
      event.preventDefault();
      const title = document.getElementById('gen-title'); 
      // delete existing playlist
      await crud.deletePlaylist(input.value); // crud delete
      await this.readPlaylists(); // updated all saved playlists
      delete this.playlistTracks_object[input.value];

      // generate a new one 
      // Update title for container
      title.innerHTML = `${input.value}:`;

      await crud.createPlaylist(input.value); // crud create  
      await this.readPlaylists(); // update all saved playlists

      // Generate random songs and render them
      await this.generateRandomSongs();
    }); 

    // Event listener for delete playlist button
    deleteButton.addEventListener('click', async(event) => {
      event.preventDefault(); 
      const title = document.getElementById('gen-title'); 
      const list = document.getElementById('list'); 
      const input = document.getElementById("name-input"); 

      await crud.deletePlaylist(input.value); // crud delete
      await this.readPlaylists(); // updated all saved playlists

      // clear list, title, and remove from object 
      title.innerHTML = " : "; 
      list.innerHTML = " "; 
      delete this.playlistTracks_object[input.value];
    });
  }

  // Generate random songs method
  async generateRandomSongs() {
    // Replace these with your actual values
    const clientId = 'INSERT CLIENT ID HERE'; // Spotify API client ID
    const clientSecret = 'INSERT CLIENT SECRET HERE'; // Spotify API client secret
    const accessTokenUrl = 'https://accounts.spotify.com/api/token';
    const input = document.getElementById("name-input"); 

    // Function to obtain access token from Spotify
    async function getAccessToken() {
      const response = await fetch(accessTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret),
        },
        body: 'grant_type=client_credentials',
      });

      const data = await response.json();
      return data.access_token;
    }

    // Function to get playlist tracks from Spotify
    async function getPlaylistTracks(playlistTracksUrl) {
      const accessToken = await getAccessToken();

      const response = await fetch(playlistTracksUrl, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });

      const data = await response.json();
      return data.items.map(item => item.track);
    }

    function generate_playlistURL() {
      // array to hold PUBLIC spotify playlist id's (Rap, Pop, EDM, R&B, Rock)
      let array = [
        // Rap
        '37i9dQZF1DXcBWIGoYBM5M', '37i9dQZF1DX0XUsuxWHRQd', 
        // Pop
        '37i9dQZF1DX0kbJZpiYdZl', '37i9dQZF1DWUa8ZRTfalHk',
        // EDM
        '37i9dQZF1DX4dyzvuaRJ0n', '37i9dQZF1DX4dyzvuaRJ0n', 
        // R&B
        '37i9dQZF1DX4SBhb3fqCJd',
        // Rock
        '37i9dQZF1DWZryfp6NSvtz', 
      ];
      let randomNumber = Math.floor(Math.random() * 8); // pick random numbder 
      const playlistId = array[randomNumber];
      const playlistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
      return playlistTracksUrl;
    }

    // Shuffle function that I grabbed from previous scrabble projects
    function shuffle(array) {
      // Fisher-Yates shuffle, used for random decoder cipher below
      let m = array.length;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        let i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        let t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }

    // Function to render the song names and images in the gen-container
    const renderSongNames = async () => {
      // generate two URLs
      const playlistTracksUrl_one = generate_playlistURL(); 
      const playlistTracksUrl_two = generate_playlistURL(); 

      // create two separate playlists 
      const playlistTracks_one = await getPlaylistTracks(playlistTracksUrl_one);
      const playlistTracks_two = await getPlaylistTracks(playlistTracksUrl_two); 

      // ** create a final playlist tracks that includes a mix of the first and second playlist **
      // Concatenate tracks from both playlists
      const allTracks = playlistTracks_one.concat(playlistTracks_two);

      // Shuffle the array using to create a random mixture
      const playlistTracks_final = shuffle(allTracks);
      this.playlistTracks_object[input.value] = playlistTracks_final; // save track into object 

      // Grab list element 
      const list = document.getElementById('list');
      // Clear the list before generating new ones
      list.innerHTML = '';

      // render the songs into the container 
      playlistTracks_final.forEach(track => {
        //const listItem = document.createElement('li');
        const image = `<img src="${track.album.images[0].url}" alt="${track.name}" style="width: 200px; height: 200px;">`;
        const name = `<span>${track.name}</span>`;
        const artist = `<span> <strong> - ${track.artists[0].name} <strong> </span>`;
        const listItem = `<li>${image}<br>${name}<br>${artist}</li>`;
        
        // Append the list item HTML to the list
        list.innerHTML += listItem;
      });
    }
    renderSongNames();
  }
}
