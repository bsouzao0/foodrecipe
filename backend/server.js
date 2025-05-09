const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors=require("cors")

const PORT=process.env.PORT || 5000
connectDb()
const allowedOrigins = ["http://localhost:5173", "https://foodrecipe-fronted.onrender.com"];

const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const addRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;

  if (!title || !ingredients || !instructions || !time) {
    return res.status(400).json({ message: "Required fields can't be empty" });
  }

  try {
    const newRecipe = await Recipes.create({
      title,
      ingredients,
      instructions,
      time,
      coverImage: req.file ? req.file.filename : undefined, 
      createdBy: req.user.id,  
    });
    return res.json(newRecipe);
  } catch (err) {
    console.error(err);  // Log the error for better debugging
    return res.status(500).json({ message: "Error creating recipe", error: err });
  }
};

app.use(express.json())

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("CORS Not Allowed"))
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use('/images', cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}), express.static(path.join(__dirname, 'public', 'images')));


app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})