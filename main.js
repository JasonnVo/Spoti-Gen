import homeView from './homeView.js';
import releaseView from './releaseView.js';
import generatorView from './generatorView.js';
import * as crud from './crud.js';

// constructing view classes 
const homeViewClass = new homeView(); 
const releaseViewClass = new releaseView();  
const generatorViewClass = new generatorView(); 

// links 
const home_link = document.getElementById('home-link'); 
const release_link = document.getElementById('release-link'); 
const generator_link = document.getElementById('generator-link'); 

// grab current view div element 
const curr_view = document.getElementById('curr-view');

// home link event listener 
home_link.addEventListener('click', event => {
  event.preventDefault(); 
  const homeViewElement = homeViewClass.render(); // Call the method
  curr_view.innerHTML = ''; // Clear existing content
  curr_view.appendChild(homeViewElement); // Append the element
  console.log("THIS IS THE HOME VIEW"); 
}); 

// release link event listener 
release_link.addEventListener('click', event => {
  event.preventDefault(); 
  const releaseViewElement = releaseViewClass.render(); // Call the method
  curr_view.innerHTML = ''; // Clear existing content
  curr_view.appendChild(releaseViewElement); // Append the element
  releaseViewClass.restore(); // use local storage for persistence 
  releaseViewClass.generate_release(); // generate list of new spotify releases
  console.log("THIS IS THE RELEASE VIEW"); 
}); 

// generator link event listener 
generator_link.addEventListener('click', event => {
  event.preventDefault(); 
  const generatorViewElement = generatorViewClass.render(); // Call the method
  curr_view.innerHTML = ''; // Clear existing content
  curr_view.appendChild(generatorViewElement); // Append the element
  console.log("THIS IS THE GENERATOR VIEW"); 
}); 