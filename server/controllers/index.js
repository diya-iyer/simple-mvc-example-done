// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// Get the Cat and Dog models
const { Cat, Dog } = models;

// Function to handle rendering the index page.
const hostIndex = async (req, res) => {
  let name = 'unknown';

  try {
    const doc = await Cat.findOne({}, {}, { sort: { createdDate: 'descending' } }).lean().exec();

    // If we got a cat back, store its name
    if (doc) {
      name = doc.name;
    }
  } catch (err) {
    console.log(err);
  }

  res.render('index', {
    currentName: name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// Function to handle rendering the page1 template
const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

// Function to render the untemplated page2.
const hostPage2 = (req, res) => {
  res.render('page2');
};

// Function to render the untemplated page3.
const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = async (req, res) => {
  try {
    const dogs = await Dog.find({}).lean().exec(); // Retrieve all dogs
    res.render('page4', { dogs });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to load dogs' });
  }
};

// Get name will return the name of the last added cat.
const getName = async (req, res) => {
  try {
    const doc = await Cat.findOne({}).sort({ createdDate: 'descending' }).lean().exec();

    // If we got a cat back, return its name
    if (doc) {
      return res.json({ name: doc.name });
    }
    return res.status(404).json({ error: 'No cat found' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong contacting the database' });
  }
};

// Function to create a new cat in the database
const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  try {
    await newCat.save();
    return res.status(201).json({
      name: newCat.name,
      beds: newCat.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }
};

// Function to search a cat by name.
const searchName = async (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    doc = await Cat.findOne({ name: req.query.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'No cats found' });
  }

  return res.json({ name: doc.name, beds: doc.bedsOwned });
};

// Function for creating a new dog
const createDog = async (req, res) => {
  const { name, breed, age } = req.body;

  // Check if all required fields are present
  if (!name || !breed || age === undefined) {
    return res.status(400).json({ error: 'Name, breed, and age are all required.' });
  }

  const dogData = {
    name: name.trim(),
    breed: breed.trim(),
    age: parseInt(age, 10),
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
    return res.status(201).json({
      message: 'Dog created successfully',
      dog: newDog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create dog' });
  }
};

// Function to lookup a dog by name and increase its age
const increaseDogAge = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Dog name is required.' });
  }

  try {
    const dog = await Dog.findOne({ name: name.trim() }).exec();
    if (!dog) {
      return res.status(404).json({ error: 'Dog not found.' });
    }

    // Increase age by 1
    dog.age += 1;
    await dog.save();

    return res.json({
      message: 'Dog age increased successfully',
      dog,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong while updating the dog\'s age.' });
  }
};

// A function to send back the 404 page.
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// Export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  createDog,
  increaseDogAge,
  searchName,
  notFound,
};
