const express = require("express");
const app = express();
const userRouter = require("./routes/user_router");

//For Parsing cookies from client side
const cookieParser = require("cookie-parser");

//For Parsing data from request body for post requests
const bodyParser = require("body-parser");

app.use(cookieParser());

//For Parsing Json Objects
app.use(express.json());

app.use(bodyParser.json());

//Mounting Routes
app.use("/api/v1/users", userRouter);

//NOTE:

//Need to install Node.js on another machine to run the code and other dependencies file like express, mongoose and mongodb
//Use npm run dev for starting the server as mentioned in package.json file
//I have used nodemon for dev environment , it can be changed for the production environment

module.exports = app;
