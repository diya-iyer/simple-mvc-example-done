// Require mongoose, a popular MongoDB library for Node.js
const mongoose = require('mongoose');

// Define the Dog model
let DogModel = {};
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Every Dog must have a name
    trim: true, // Trim whitespace from both ends
    unique: true, // Ensure no two dogs have the same name
  },
  breed: {
    type: String,
    required: true, // Every Dog must have a breed
    trim: true, // Trim whitespace from both ends
  },
  age: {
    type: Number,
    required: true, // Every Dog must have an age
    min: 0, // Age cannot be negative
  },
  createdDate: {
    type: Date,
    default: Date.now, // Set the default to the current date
  },
});

// Create the Dog model based on the schema
DogModel = mongoose.model('Dog', DogSchema);

// Export the Dog model so it can be used in other files
module.exports = DogModel;
