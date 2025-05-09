const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/connectionDb");
const cors = require("cors");
const fs = require('fs');  // Require the fs module
const path = require('path');  // Require the path module

// Ensure 'public/images' folder exists
const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;
connectDb();

const allowedOrigins = ["http://localhost:5173", "https://foodrecipe-fronted.onrender.com"];
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Not Allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.static("public")); /

app.use("/", require("./routes/user"));
app.use("/recipe", require("./routes/recipe"));

app.listen(PORT, (err) => {
  console.log(`App is listening on port ${PORT}`);
});

app.use(express.static("public")) 

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})