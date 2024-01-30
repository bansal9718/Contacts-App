const User = require("../ models/user_model");
const SpamReport = require("../ models/spam_model");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");

exports.verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -accessToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid acccess token");
  }
};
