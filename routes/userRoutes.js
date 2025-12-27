//imports
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Authorization header format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  try {
    //verify token using secret
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    //attach user data to request
    req.user = verified;
    //move to next function
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};

//register route
router.post("/register", async (req, res) => {
  //extract form fields
  const { username, email, password } = req.body;

  try {
    //check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    //save user to DB
    await user.save();
    res.status(200).json({ message: "Registered successfully.." });
  } catch (err) {
    return res.status(400).json({ message: "Failed to register user" });
  }
});

//login route
router.post("/login", async (req, res) => {
  //Extract form fields
  const { email, password } = req.body;

  try {
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "You don't have an Account" });
    }

    //compare passwords with hashed passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //Create json web token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: "Failed to Login user" });
  }
});

//Logout route
router.post("/logout", verifyToken, async (req, res) => {
  try {
    //Clear the cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(400).json({ message: "Error logging out.." });
  }
});

module.exports = router;
