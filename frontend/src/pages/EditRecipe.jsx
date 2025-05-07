import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        time: '',
        file: null
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`https://foodrecipe-8brr.onrender.com/recipe/${id}`);
                const res = response.data;
                setRecipeData({
                    title: res.title,
                    ingredients: res.ingredients.join(","),
                    instructions: res.instructions,
                    time: res.time,
                    file: null 
                });
            } catch (error) {
                console.error("Error fetching recipe data:", error);
            }
        };
        getData();
    }, [id]);

    const onHandleChange = (e) => {
        const { name, value, files } = e.target;
        const val = name === "file" ? files[0] : name === "ingredients" ? value : value;
        setRecipeData(prev => ({ ...prev, [name]: val }));
    };

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", recipeData.title);
        formData.append("time", recipeData.time);
        formData.append("instructions", recipeData.instructions);

        if (Array.isArray(recipeData.ingredients)) {
            recipeData.ingredients.forEach((item) => formData.append("ingredients", item));
        } else {
            recipeData.ingredients.split(",").forEach((item) => formData.append("ingredients", item.trim()));
        }

        if (recipeData.file) {
            formData.append("file", recipeData.file);
        }

        try {
            await axios.put(`https://foodrecipe-8brr.onrender.com/recipe/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'Bearer ' + localStorage.getItem("token")
                }
            });
            navigate("/myRecipe");
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    return (
        <>
            <div className="container">
                <form className="form" onSubmit={onHandleSubmit}>
                    <div className="form-control">
                        <label>Title</label>
                        <input
                            type="text"
                            className="input"
                            name="title"
                            onChange={onHandleChange}
                            value={recipeData.title}
                        />
                    </div>

                    <div className="form-control">
                        <label>Time</label>
                        <input
                            type="text"
                            className="input"
                            name="time"
                            onChange={onHandleChange}
                            value={recipeData.time}
                        />
                    </div>

                    <div className="form-control">
                        <label>Ingredients</label>
                        <textarea
                            className="input-textarea"
                            name="ingredients"
                            rows="5"
                            onChange={onHandleChange}
                            value={recipeData.ingredients}
                        />
                    </div>

                    <div className="form-control">
                        <label>Instructions</label>
                        <textarea
                            className="input-textarea"
                            name="instructions"
                            rows="5"
                            onChange={onHandleChange}
                            value={recipeData.instructions}
                        />
                    </div>

                    <div className="form-control">
                        <label>Recipe Image</label>
                        <input
                            type="file"
                            className="input"
                            name="file"
                            onChange={onHandleChange}
                        />
                    </div>

                    <button type="submit">Edit Recipe</button>
                </form>
            </div>
        </>
    );
}
