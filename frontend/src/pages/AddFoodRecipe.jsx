import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    ingredients: [],
    instructions: '',
    file: null,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const onHandleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedValue =
      name === "ingredients"
        ? value.split(",").map((ingredient) => ingredient.trim()) 
        : name === "file"
        ? files[0]
        : value;

   
    if (name === "file" && files[0]) {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) { 
        setError("File size exceeds 5MB. Please upload a smaller file.");
        return;
      } else {
        setError(null); 
      }
    }

    setRecipeData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const onHandleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('title', recipeData.title);

  recipeData.ingredients.forEach((ingredient) => {
  formData.append('ingredients[]', ingredient); // Use array notation
});

  formData.append('instructions', recipeData.instructions);
  formData.append('time', recipeData.time);

  if (recipeData.file){
    formData.append('file', recipeData.file);
  }

  try {
    await axios.post("https://foodrecipe-8brr.onrender.com/recipe", formData, {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem("token"),
  },
});

    setSuccess(true);
    setTimeout(() => {
      navigate("/");
    }, 2000);
  } catch (err) {
    setError("Error uploading recipe: " + err.message);
  }
};

  return (
    <div className="container">
      <form className="form" onSubmit={onHandleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input
            type="text"
            className="input"
            name="title"
            value={recipeData.title}
            onChange={onHandleChange}
            required
          />
        </div>
        <div className="form-control">
          <label>Time</label>
          <input
            type="text"
            className="input"
            name="time"
            value={recipeData.time}
            onChange={onHandleChange}
            required
          />
        </div>
        <div className="form-control">
          <label>Ingredients: (Separated by comma)</label>
          <textarea
            className="input-textarea"
            name="ingredients"
            rows="5"
            value={recipeData.ingredients.join(", ")} 
            onChange={onHandleChange}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label>Instructions</label>
          <textarea
            className="input-textarea"
            name="instructions"
            rows="5"
            value={recipeData.instructions}
            onChange={onHandleChange}
            required
          ></textarea>
        </div>
        <div className="form-control">
          <label>Recipe Image</label>
          <input
            type="file"
            className="input"
            name="file"
            onChange={onHandleChange}
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Recipe successfully added!</div>}
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
}
