const Recipes = require('../models/recipe');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); 
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const filename = Date.now() + '-' + file.fieldname + fileExtension;
    cb(null, filename); 
  }
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true); 
  } else {
    return cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipes.find();
    return res.json(recipes);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching recipes", error: err });
  }
};

const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching recipe", error: err });
  }
};

const addRecipe = async (req, res) => {
  try {
    let { title, ingredients, instructions, time } = req.body;

    if (!title || !ingredients || !instructions || !time) {
      return res.status(400).json({ message: "Required fields can't be empty" });
    }

    if (typeof ingredients === 'string') {
      ingredients = ingredients.includes(',')
        ? ingredients.split(',').map(i => i.trim())
        : [ingredients];
    }

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
    return res.status(500).json({ message: "Error creating recipe", error: err.message });
  }
};


const editRecipe = async (req, res) => {
  const { title, ingredients, instructions, time } = req.body;
  try {
    let recipe = await Recipes.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const coverImage = req.file ? req.file.filename : recipe.coverImage; 

    const updatedRecipe = await Recipes.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions, time, coverImage },
      { new: true }
    );

    res.json(updatedRecipe);
  } catch (err) {
    return res.status(500).json({ message: "Error updating recipe", error: err });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    await Recipes.deleteOne({ _id: req.params.id });
    res.json({ status: "ok" });
  } catch (err) {
    return res.status(400).json({ message: "Error deleting recipe", error: err });
  }
};

module.exports = { getRecipes, getRecipe, addRecipe, editRecipe, deleteRecipe, upload };
