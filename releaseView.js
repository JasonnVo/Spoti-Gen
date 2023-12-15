export default class releaseView {
  constructor() {
    this.newReleases = [0]; 
  }

  // Render method to modify the inner html 
  render () {
    const view = `
      <h1 style ="color:rgb(179, 144, 179)"> Release View </h1>
      <p>This is the New Releases View. Here you will find a list of the latest album releases</p>
      <center style="font-size: 20px; margin-top: 30px;">
        <button id="generate"> Generate again </button> 
        <button id="clear-state"> Clear </button> 
        <div class="release-container">
          <h3>Recent New Album Releases:</h3>
          <ul id="list"></ul>
        </div>
      <center> 
    `;

    // Create a new div element to hold the view
    const div = document.createElement('div');
    div.innerHTML = view;

    return div; 
  }

  // restore state 
  restore () {
    console.log("test");
    const state = localStorage.getItem('new_releases'); 
    if (state) {
      const new_state = JSON.parse(state); 
      this.newReleases = new_state; 
    } else {
      console.log("state not found");
    }
  }

  // generate_releases method to generate new releases using spotify API 
  async generate_release() {
    const clientId = 'INSERT CLIENT ID HERE'; // Spotify API client ID
    const clientSecret = 'INSERT CLIENT SECRET HERE'; // Spotify API client secret
    const accessTokenUrl = 'https://accounts.spotify.com/api/token';
    const apiUrl = 'https://api.spotify.com/v1/browse/new-releases';

    // Implement generate again button
    const generate_button = document.getElementById('generate');
    generate_button.addEventListener('click', () => {
      renderNewReleases(); 
    }); 

    // Implement clear state button
    const clear_button = document.getElementById('clear-state'); 
    const list = document.getElementById('list'); 
    clear_button.addEventListener('click', () => {
      localStorage.removeItem('new_releases'); 
      list.innerHTML = " "; 
    }); 
    
    // save state to local storage
    const saveState = () => {
      localStorage.setItem('new_releases', JSON.stringify(this.newReleases)); 
    }
  
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

    // Function to get new releases from Spotify
    async function getNewReleases() {
      const accessToken = await getAccessToken();

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': 'Bearer ' + accessToken,
        },
      });
    
      const data = await response.json();
      return data.albums.items;
    }

    // Render releases function 
    const renderNewReleases = async () => {
      const newReleasesList = document.getElementById('list');

      if (newReleasesList) {
        if (this.newReleases[0] === 0) {
          this.newReleases = await getNewReleases(); 
        }
        saveState(); 
        this.newReleases.forEach(release => {
          const listItem = document.createElement('li');
              
          // Display album image with a size
          const image = `<img src="${release.images[0].url}" alt="${release.name}" style="width: 200px; height: 200px;">`;
          
          // Display album information such as name and artist 
          listItem.innerHTML = `${image}<br><strong>${release.name}</strong> - <br>${release.artists.map(artist => artist.name).join(', ')}`;
          newReleasesList.appendChild(listItem);
        });
      } else {
        console.error('new-releases-list not found');
      }
    }
    // Call the function to render new releases
    renderNewReleases();    
  }
}