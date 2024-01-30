const express = require("express");
const User = require("../ models/user_model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");
const jwt = require("jsonwebtoken");

const generateAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

exports.registerUser = async (req, res) => {
  const { phonenumber, name, email, password } = req.body;
  //   if ({ phonenumber, name, password.some((field) => field?.trim() === "")) {
  //     throw new ApiError(400, "All fields are required");
  //   }

  if (!(name && phonenumber && password)) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ phonenumber }],
  });

  if (existedUser) {
    throw new ApiError(400, "User Already Exixts");
  }

  const user = await User.create({
    name,
    email,
    phonenumber,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
};

exports.loginUser = async (req, res) => {
  const { name, password } = req.body;

  if (!(name || password)) {
    throw new ApiError(400, "name is required");
  }

  const user = await User.findOne({
    $or: [{ name }, { password }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exists");
  }

  const isPasswordValid = user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "Incorrect Password , Try again");
  }

  const { accessToken } = await generateAccessTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -accessToken"
  );

  const options = { httpOnly: true, secure: true }; //For security of cookies

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)

    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged in succcessfully"
      )
    );
};

exports.logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { accessToken: 1 } },
    { new: true }
  );

  const options = { httpOnly: true, secure: true }; //For Security of cookies
  return res
    .status(200)
    .clearCookie("accessToken", options) //used to clear token stored in the cookies
    .json(new ApiResponse(200, {}, "User Logged Out"));
};

exports.getAll = async (req, res) => {
  const user = await User.find();

  return res.status(200).json({ data: user });
};

exports.getByName = async (req, res) => {
  // GET /name?name=rohit
  // USe for testing
  const { name } = req.query;

  if (!name) {
    throw new ApiError(400, "Pls provide a name");
  }

  try {
    // Find users whose names start with the search query
    const startsWithName = await User.find({
      name: { $regex: `^${name}`, $options: "i" },
    });

    // Find users whose names contain the search query but don't start with it
    const containsName = await User.find({
      name: { $regex: `^(?!${name})${name}`, $options: "i" },
    });

    // Combine the results
    const searchResults = startsWithName.concat(containsName);

    // Return the search results with name, phone number, and spam likelihood
    const formattedResults = searchResults.map((user) => ({
      name: user.name,
      phoneNumber: user.phonenumber,
      spamLikelihood: user.isPhoneNumberSpam, // Assuming spam likelihood is a field in the user model
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { results: formattedResults },
          "data retrieved successfully"
        )
      );
  } catch (error) {
    return res.status(500).json(new ApiError(400, "Internal server error"));
  }
};

exports.getByNumber = async (req, res) => {
  // GET /number?phonenumber=1236376832
  // Use for testing
  const { phonenumber } = req.query;

  try {
    // Check if there is a registered user with the given phone number
    const registeredUser = await User.findOne({
      phonenumber: phonenumber,
    }).select("-password");

    if (registeredUser) {
      // If a registered user is found, return only that result
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { result: registeredUser },
            "Data retrieved successfully"
          )
        );
    }

    // If no registered user is found, search for all results matching the phone number
    const allResults = await User.find({ phonenumber: phonenumber });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { results: allResults },
          "data retrieved successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, "Internal server error");
  }
};

exports.search = async (req, res) => {
  // GET /search/person-details?userId=123&searchedUserId=456
  // Use for testing
  const { userId } = req.query;
  try {
    const personDetails = await User.findById(userId);
    if (!personDetails) {
      throw new ApiError(400, "no user found");
    }
    // const searchingUser = await User.findById(userId);
    const isRegisteredUser = Boolean(personDetails.email);

    // const isInContactList = (searchingUser && searchingUser.contacts).includes(
    //   searchedUserId
    // );

    const responseData = {
      details: {
        name: personDetails.name,
        phoneNumber: personDetails.phonenumber,
        spamLikelihood: personDetails.isPhoneNumberSpam,
      },
    };

    if (isRegisteredUser) {
      responseData.details.email = personDetails.email;
    }

    return res
      .status(201)
      .json(new ApiResponse(200, responseData, "data retrieved successfully"));
  } catch (error) {
    throw new ApiError(404, "Some Error occured", error);
  }
};
