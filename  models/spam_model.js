const mongoose = require("mongoose");

const spamReportSchema = new mongoose.Schema({
  phonenumber: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model if the report is made by a registered user
  },
});

const SpamReport = mongoose.model("SpamReport", spamReportSchema);

module.exports = SpamReport;
