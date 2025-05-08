import React from 'react'
import './App.css'
import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe  from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'


const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/recipe`)
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

  const allRecipes = await getAllRecipes()
  if (!Array.isArray(allRecipes)) {
    console.warn("Expected allRecipes to be an array but got:", allRecipes)
    return []
  }

  return allRecipes.filter(item => item.createdBy === user._id)
}


const getFavRecipes=()=>{
  return JSON.parse(localStorage.getItem("fav"))
}

const getRecipe=async({params})=>{
  let recipe;
  await axios.get(`${import.meta.env.VITE_API_URL}/recipe/${params.id}`)
  .then(res=>recipe=res.data)

  await axios.get(`${import.meta.env.VITE_API_URL}/user/${recipe.createdBy}`)
  .then(res=>{
    recipe={...recipe,email:res.data.email}
  })

  return recipe
}

const router=createBrowserRouter([
  {path:"/",element:<MainNavigation/>,children:[
    {path:"/",element:<Home/>,loader:getAllRecipes},
    {path:"/myRecipe",element:<Home/>,loader:getMyRecipes},
    {path:"/favRecipe",element:<Home/>,loader:getFavRecipes},
    {path:"/addRecipe",element:<AddFoodRecipe/>},
    {path:"/editRecipe/:id",element:<EditRecipe/>},
    {path:"/recipe/:id",element:<RecipeDetails/>,loader:getRecipe}
  ]}
 
])

export default function App() {
  return (
   <>
   <RouterProvider router={router}></RouterProvider>
   </>
  )
}