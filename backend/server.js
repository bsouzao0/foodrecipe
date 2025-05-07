const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const path = require("path");  // Import path module for file serving

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDb();

// Middleware setup
app.use(express.json());
app.use(cors());
app.use(express.static("public")); 

// API Routes
app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

// Start the server
app.listen(PORT, (err) => {
  if (err) {
    console.error("Error starting the server:", err);
  } else {
    console.log(`App is listening on port ${PORT}`);
  }
});
