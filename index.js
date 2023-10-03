const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
require('dotenv').config()
const { CORS_ORIGIN, BACKEND_URL } = process.env;

const videoRoutes=require('./routes/videosRoute')
const profileRoutes=require('./routes/profileRoute')

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use('/', videoRoutes)
app.use('/', profileRoutes)
app.listen(8080, ()=>{
    
})