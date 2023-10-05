const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
require('dotenv').config()


const videoRoutes=require('./routes/videosRoute')
const profileRoutes=require('./routes/profileRoute')

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use('/api', videoRoutes)
app.use('/api', profileRoutes)
app.listen(process.env.PORT, ()=>{
console.log("Here")
})
