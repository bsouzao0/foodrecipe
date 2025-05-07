import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import foodImg from '../assets/foodRecipe.png'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
    const recipes = useLoaderData();
    const [allRecipes, setAllRecipes] = useState([]);
    const [favItems, setFavItems] = useState(() => JSON.parse(localStorage.getItem("fav")) ?? []);
    const navigate = useNavigate();
    const path = window.location.pathname === "/myRecipe";

    useEffect(() => {
        setAllRecipes(recipes);
    }, [recipes]);

    const onDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;

        try {
            await axios.delete(`https://foodrecipe-8brr.onrender.com/recipe/${id}`, {
                headers: {
                    authorization: 'Bearer ' + localStorage.getItem("token")
                }
            });

            setAllRecipes(prev => prev.filter(recipe => recipe._id !== id));
            const updatedFavs = favItems.filter(recipe => recipe._id !== id);
            localStorage.setItem("fav", JSON.stringify(updatedFavs));
            setFavItems(updatedFavs);
        } catch (error) {
            console.error("Delete failed:", error.message);
        }
    };

    const favRecipe = (item) => {
        const exists = favItems.some(recipe => recipe._id === item._id);
        const updatedFavs = exists
            ? favItems.filter(recipe => recipe._id !== item._id)
            : [...favItems, item];

        localStorage.setItem("fav", JSON.stringify(updatedFavs));
        setFavItems(updatedFavs);
    };

    return (
        <div className='card-container'>
            {allRecipes?.map((item, index) => {
                const imageUrl = item.coverImage
                    ? `https://foodrecipe-8brr.onrender.com/images/${item.coverImage}`
                    : foodImg;

                return (
                    <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
                        <img
                            src={imageUrl}
                            alt={item.title}
                            width="120px"
                            height="100px"
                            onError={(e) => { e.target.onerror = null; e.target.src = foodImg }}
                        />
                        <div className='card-body'>
                            <div className='title'>{item.title}</div>
                            <div className='icons'>
                                <div className='timer'><BsStopwatchFill /> {item.time}</div>
                                {!path ? (
                                    <FaHeart
                                        onClick={() => favRecipe(item)}
                                        style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }}
                                    />
                                ) : (
                                    <div className='action'>
                                        <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                                        <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
