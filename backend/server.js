const express=require("express")
const app=express()
const dotenv=require("dotenv").config()
const connectDb=require("./config/connectionDb")
const cors=require("cors")

const PORT=process.env.PORT || 3000
connectDb()

app.use(express.json())
app.use(cors({
    origin: 'https://foodrecipe-fronted.onrender.com', 
    credentials: true
  }))
app.use(express.static("public")) //for images

app.use("/",require("./routes/user"))
app.use("/recipe",require("./routes/recipe"))

app.listen(PORT,(err)=>{
    console.log(`app is listening on port ${PORT}`)
})