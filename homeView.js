export default class homeView {
  // Render function
  render () {
    const view = `
      <h1 style ="color:rgb(179, 144, 179)"> Home View </h1>
      <p> This is the Home View. </p>
    `;

    // Create a new div element to hold the view
    const div = document.createElement('div');
    div.innerHTML = view;

    return div; 
  }
}