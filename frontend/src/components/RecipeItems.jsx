import React, { useEffect, useState } from 'react';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const recipes = useLoaderData();
    const [allRecipes, setAllRecipes] = useState([]);
    const navigate = useNavigate();
    const path = window.location.pathname === "/myRecipe";
    const [setIsFavRecipe] = useState(false);

    let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

    useEffect(() => {
        if (Array.isArray(recipes)) {
            setAllRecipes(recipes);
        } else {
            setAllRecipes([]);
            console.error("Expected recipes to be an array but got:", recipes);
        }
    }, [recipes]);

    const onDelete = async (id) => {
        try {
            await axios.delete(`https://foodrecipe-8brr.onrender.com/recipe/${id}`);
            setAllRecipes(prev => prev.filter(recipe => recipe._id !== id));
            const filterItem = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(filterItem));
        } catch (err) {
            console.error("Error deleting recipe:", err);
        }
    };

    const favRecipe = (item) => {
        const exists = favItems.some(recipe => recipe._id === item._id);
        const updatedFavs = exists
            ? favItems.filter(recipe => recipe._id !== item._id)
            : [...favItems, item];

        localStorage.setItem("fav", JSON.stringify(updatedFavs));
        setIsFavRecipe(prev => !prev); // triggers re-render
    };

    return (
        <div className='card-container'>
            {allRecipes.map((item, index) => (
                <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                    <img src={`https://foodrecipe-8brr.onrender.com/images/${item.coverImage}`} width="120px" height="100px" alt="recipe" />
                    <div className='card-body'>
                        <div className='title'>{item.title}</div>
                        <div className='icons'>
                            <div className='timer'><BsStopwatchFill /> {item.time}</div>
                            {!path ? (
                                <FaHeart onClick={() => favRecipe(item)} style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }}/>
                            ) : (
                                <div className='action'>
                                    <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                    <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
