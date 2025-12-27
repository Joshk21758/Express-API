//imports
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const dotenv = require("dotenv");
dotenv.config();

//app setup
const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.DB_URI;

//middleware
app.use(cors());
app.use(express.json()); //Parsing JSON bodies

//database connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

//basic route
app.get("/", (req, res) => {
  res.send("Welcome to the Backend Server");
});

//User routes
app.use("/api/user", userRoutes);

//Blog Routes
app.use("/api/post", blogRoutes);

//Listening server port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
