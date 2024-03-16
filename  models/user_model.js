const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3, // Minimum length of 3 characters
      maxlength: 30, // Maximum length of 20 characters
    },
    email: {
      type: String,
      unique: true,
    },
    phonenumber: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            return /^[0-9]{10}$/.test(v); // Check if it's 10 digits numeric
          },

          message: (props) => `${props.value} is not a valid phone number!`,
        },
      ],
    },

    password: {
      type: String,
      required: true,
      unique: true,
      validate: [
        {
          validator: function (v) {
            // Check minimum length
            return v.length >= 4;
          },
          message: (props) => `Password must be at least 8 characters long!`,
        },
        {
          validator: function (v) {
            // Check for uppercase letters
            return /[A-Z]/.test(v);
          },
          message: (props) =>
            `Password must contain at least one uppercase letter!`,
        },
        {
          validator: function (v) {
            // Check for lowercase letters
            return /[a-z]/.test(v);
          },
          message: (props) =>
            `Password must contain at least one lowercase letter!`,
        },
      ],
    },
    isPhoneNumberSpam: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
