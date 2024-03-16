const User = require("../ models/user_model");
const SpamReport = require("../ models/spam_model");
const ApiError = require("../utils/ApiError.js");
const jwt = require("jsonwebtoken");
const ApiResponse = require("../utils/Apiresponse");

// exports.verifyJWT = async (req, res, next) => {
//   try {
//     const token =
//       req.cookies?.accessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//       throw new ApiError(401, "unauthorized request");
//     }

//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     // console.log(decodedToken);

//     const user = await User.findById(decodedToken?._id).select(
//       "-password -accessToken"
//     );

//     req.user = user;
//     next();
//   } catch (error) {
//     throw new ApiError(401, "Invalid acccess token");
//   }
// };

exports.verifyJWT = async(req,res,next) => {

}
