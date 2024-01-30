const express = require("express");
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const dotenv = require("dotenv");
require("dotenv").config();
const app = require("./app");
const User = require("./ models/user_model");
const DB = process.env.MONGODB_URI;

//Connecting to Database
mongoose.connect(DB).then(
  () => console.log("DB connection successful")
  // Call function to populate database
  // populateDatabase()
);

const port = process.env.PORT || 2000;

//Listening to the given PORT
const server = app.listen(port, () => {
  console.log(`running on port ${port}`);
});

// Function to generate random user data and insert into database
// async function populateDatabase() {
//   try {
//     // Clear existing data
//     await User.deleteMany({});

//     // Generate and insert new data
//     const userData = Array.from({ length: 40 }, () => ({
//       //define the length of the data objects as required
//       name: faker.internet.userName(),
//       email: faker.internet.email(),
//       phonenumber: faker.phone.number(),
//       password: faker.internet.password(),
//     }));

//     console.log(userData);

//     await User.insertMany(userData);

//     console.log("Database populated successfully");
//   } catch (error) {
//     console.error("Error populating database:", error);
//   }
// }
