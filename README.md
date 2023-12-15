# Spoti-Gen
Single paged web application that uses the spotify API to grab new album releases and generates the user a random list of songs.

## **Project Architecture:**

- In terms of the architecture for my project, everything was coded in JavaScript, CSS, and HTML.
- Upon opening the project, there are three separate folders: a ‘Client’ folder, a ‘node_modules’ folder, and a ‘server’ folder.
- Here is the file architecture:
    - Client → (styles.css, index.html, crud.js, generatorView.js, homeView.js, main.js, releaseView.js, video.mp4)
    - node_modules → (node items)
    - Server → (memcrud.js)
- **Client:**
    - styles.css
        - This file contains all the CSS styling for the project. I separated everything with comments based on the code's function. For example, the video CSS, hero and navbar CSS, title CSS, etc.
    - Index.html
        - This file includes everything primarily displayed at the top of the webpage and the home view. It contains code for the video, navbar, title, homeView, and footer.
        - The home view is wrapped in a ‘content’ class, which changes when different tabs are clicked. This approach makes the webpage a single-page web application, instead of redirecting to another tab.
    - crud.js
        - This file contains async functions that use the fetch API to implement the CRUD functions in the generatorView tab properly. There are PUT and GET methods in this file.
    - GeneratorView.js
        - This file contains the most code in the entire project. It includes all the necessary code to grab user input and then create, read, update, and delete a generated playlist. It uses code from the Spotify API documentation to fetch public data and generate a new playlist for the user.
        - This file is also where I implemented a MongoDB database.
    - homeView.js
        - This file contains the homeView code, with basic HTML that renders the current view.
    - main.js
        - This is the main JavaScript file. It links together all the navbar links and calls various functions. Once a navbar link is clicked, it clears the current view and then renders a new one, maintaining the single-page web application approach.
    - releaseView.js
        - This file includes the code for the new release tab. It fetches recent album release data from Spotify and then renders it on the screen. This is also where I implemented local storage.
    - Video.mp4
        - This file is just the video played on the home screen.
- **Node_modules folder:**
    - This folder contains node.js data.
- **Server:**
    - memcrud.js
        - This file contains all the server-side code for the application. It uses express routes and MongoDB to perform CRUD operations and save data to the database successfully.

## **Key Features:**

- New Album Releases
    - In this tab, once the user clicks on it, a list of new album releases is generated, fetched directly from the Spotify API. This uses public data, so it does not require authentication to Spotify. After fetching the new albums using the accessToken generated, I render everything on the screen using a list and CSS.
    - Additionally, this area has a persistence feature using local storage. When the user clicks generate, it not only generates a list of albums but also saves everything to the browser's local storage. When the user refreshes or navigates away and back to the tab, it restores everything from local storage, thus providing persistence. There is also a clear button that deletes the albums from local storage.
- Generate Playlists Tab
    - This tab is the main feature of the application. The user can input any name for their playlist, and the application will generate and render a random list of songs.
        - This works by inputting a variety of public Spotify playlist IDs into the code (these playlists update weekly, so the songs are always new). Examples of playlists include Rap Caviar, Daily Hits, Top Rock Playlists, etc. The application then randomly selects two of the playlists, shuffles them using the Fisher-Yates shuffle algorithm, and presents them to the user.
    - This tab includes CRUD operations with buttons for:
        - Create
            - Generates a new playlist, saving it locally and in the database.
        - Update
            - Updates the current playlist with new songs.
        - Read
            - Retrieves the playlist with the same name as the input.
        - Delete
            - Removes the playlist from the view and the database.
    - This area is also where I incorporated my MongoDB database. I created an instance of the client and saved the playlist to the database whenever it was created.
- In addition to the release tab and generate playlists tab, I also included CSS features such as the title turning transparent on hover and a video playing in the background.

## **Usage Instructions:**

- Setting up the server
    - To set up the server, you first need to install the node_modules folder using ‘npm init’.
    - Afterwards, install express using ‘npm install express’.
    - Lastly, install MongoDB by using ‘npm install mongodb’.
- SPOTIFY API
    - To use the Spotify API, I included my personal client ID and secret ID in the code. However, to input your own, you would have to log into the Spotify developer portal, create an application, go to settings, and copy the client ID and secret ID.
    - These are used in the generatorView.js file (line 161) and the releaseView.js file (line 42).
- MongoDB
    - For the MongoDB database, my current code has my own cluster URL + password.
    - To create your own URL, navigate to the MongoDB website, create a cluster, create a password, and replace line 6 in memcrud.js with your URL.
- RUNNING THE APPLICATION
    - To run the application, open the terminal and type “node memcrud.js”, and it should output:
        
        ```jsx
        Connected successfully to MongoDB!
        Server started on port 3000
        ```
        
    - On the browser, navigate to http://localhost:3000/client/index.html
