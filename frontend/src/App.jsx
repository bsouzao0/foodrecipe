import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'

const getAllRecipes = async () => {
  try {
    const res = await axios.get(`https://foodrecipe-8brr.onrender.com/recipe`)
    return Array.isArray(res.data) ? res.data : []
  } catch (err) {
    console.error('Error fetching recipes:', err)
    return []
  }
}

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user || !user._id) {
    console.warn("No valid user in localStorage")
    return []
  }

  try {
    const allRecipes = await getAllRecipes()
    return allRecipes.filter(recipe => recipe.createdBy === user._id)
  } catch (err) {
    console.error("Error fetching user's recipes:", err)
    return []
  }
}

const getFavRecipes = () => {
  const favItems = JSON.parse(localStorage.getItem("fav"))
  return Array.isArray(favItems) ? favItems : []
}

const getRecipe = async ({ params }) => {
  try {
    let recipe = await axios.get(`https://foodrecipe-8brr.onrender.co/recipe/${params.id}`)
    const userResponse = await axios.get(`https://foodrecipe-8brr.onrender.co/user/${recipe.data.createdBy}`)
    recipe = { ...recipe.data, email: userResponse.data.email }
    return recipe
  } catch (err) {
    console.error('Error fetching recipe details:', err)
    return null
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
