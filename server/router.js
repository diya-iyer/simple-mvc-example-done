// Import the controllers
// This only specifies the folder name, which means it will automatically pull the index.js file
const controllers = require('./controllers');

// Function to attach routes
const router = (app) => {
  // Pass the express app in

  // app.VERB maps requests to middleware action
  // For example
  // app.get handles GET requests
  // app.post handles POST requests

  // Route to display all dogs on /page4
  app.get('/page4', controllers.page4);

  // Routes for cat functionalities
  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/getName', controllers.getName);
  app.get('/findByName', controllers.searchName);

  // Whenever someone goes to the site without a path (AKA the home page), call controllers.index
  // For example www.webpage.com
  app.get('/', controllers.index);

  // Catch for any other GET request. The * means anything
  app.get('/*', controllers.notFound);

  // When someone POSTS to /setName, call controllers.setName
  // For example, a form submission to www.webpage.com/setName
  app.post('/setName', controllers.setName);

  // When someone POSTS to /updateLast, call controllers.updateLast
  // app.post('/updateLast', controllers.updateLast);

  // When someone POSTS to /dogs/create, call controllers.createDog
  app.post('/dogs/create', controllers.createDog);

  // When someone POSTS to /dogs/increaseAge, call controllers.increaseDogAge
  app.post('/dogs/increaseAge', controllers.increaseDogAge);
};

// Export the router function
module.exports = router;
