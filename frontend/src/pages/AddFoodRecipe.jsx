import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({
    title: '',
    time: '',
    ingredients: [],
    instructions: '',
    file: null
  })

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const onHandleChange = (e) => {
    const { name, value, files } = e.target
    let updatedValue =
      name === "ingredients"
        ? value.split(",")
        : name === "file"
        ? files[0]
        : value

    if (name === "file" && files[0]) {
      const file = files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB size limit
        setError("File size exceeds 5MB. Please upload a smaller file.")
        return
      } else {
        setError(null)
      }
    }

    setRecipeData(prev => ({ ...prev, [name]: updatedValue }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()

    for (let key in recipeData) {
      if (key === "ingredients" && Array.isArray(recipeData[key])) {
        recipeData[key].forEach(item => formData.append("ingredients", item))
      } else {
        formData.append(key, recipeData[key])
      }
    }

    try {
      await axios.post("https://foodrecipe-8brr.onrender.com/recipe", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'authorization': 'bearer ' + localStorage.getItem("token")
        }
      })
      setSuccess(true)
      setTimeout(() => {
        navigate("/")
      }, 2000)
    } catch (err) {
      setError("Error uploading recipe: " + err.message)
    }
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input
            type="text"
            className='input'
            name="title"
            value={recipeData.title}
            onChange={onHandleChange}
            required
          />
        </div>
        <div className='form-control'>
          <label>Time</label>
          <input
            type="text"
            className='input'
            name="time"
            value={recipeData.time}
            onChange={onHandleChange}
            required
          />
        </div>
        <div className='form-control'>
          <label>Ingredients</label>
          <textarea
            className='input-textarea'
            name="ingredients"
            rows="5"
            onChange={onHandleChange}
            required
          ></textarea>
        </div>
        <div className='form-control'>
          <label>Instructions</label>
          <textarea
            className='input-textarea'
            name="instructions"
            rows="5"
            value={recipeData.instructions}
            onChange={onHandleChange}
            required
          ></textarea>
        </div>
        <div className='form-control'>
          <label>Recipe Image</label>
          <input
            type="file"
            className='input'
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
  )
}
