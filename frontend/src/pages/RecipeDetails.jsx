import React from 'react'
import profileImg from '../assets/profile.png'
import food from '../assets/foodRecipe.png'
import { useLoaderData } from 'react-router-dom'

export default function RecipeDetails() {
    const recipe = useLoaderData();
    console.log(recipe);

    return (
        <>
            <div className='outer-container'>
                <div className='profile'>
                    <img src={profileImg} alt="profile" width="50px" height="50px" />
                    <h5>{recipe.email}</h5>
                </div>

                <h3 className='title'>{recipe.title}</h3>

                <img
                    src={`https://foodrecipe-8brr.onrender.com/images/${recipe.coverImage}`}
                    alt={recipe.title}
                    width="220px"
                    height="200px"
                    onError={(e) => { e.target.onerror = null; e.target.src = food }}
                />

                <div className='recipe-details'>
                    <div className='ingredients'>
                        <h4>Ingredients</h4>
                        <ul>
                            {recipe.ingredients?.map((item, idx) => (
                                <li key={idx}>{item}</li>
                            ))}
                        </ul>
                    </div>
                    <div className='instructions'>
                        <h4>Instructions</h4>
                        <span>{recipe.instructions}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
