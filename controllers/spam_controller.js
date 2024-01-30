const express = require("express");
const SpamReport = require("../ models/spam_model");
const User = require("../ models/user_model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/Apiresponse");

try {
  exports.reportSpam = async (req, res) => {
    const { phonenumber } = req.body;
    if (!phonenumber) {
      throw new ApiError(400, "Pls Provide a phonenumber");
    }
    const existingSpamReport = await SpamReport.findOne({ phonenumber });

    if (existingSpamReport) {
      await User.findOneAndUpdate(
        { phonenumber },
        { $set: { isPhoneNumberSpam: true } }
      );

      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            { Report: existingSpamReport },
            "Marked Spam Successfully"
          )
        );
    }

    const spamReport = new SpamReport({
      phonenumber,
      user: req.user,
    });

    await spamReport.save();

    await User.findOneAndUpdate(
      { phonenumber },
      { $set: { isPhoneNumberSpam: true } }
    );

    return res
      .status(201)
      .json(
        new ApiResponse(200, { Report: spamReport }, "Marked Spam Successfully")
      );
  };
} catch (error) {
  throw new ApiError(400, "Some error occured", error);
}
