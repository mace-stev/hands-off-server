const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
require('dotenv').config()
const { CORS_ORIGIN, BACKEND_URL } = process.env;
const videoRoutes=require('./routes/videosRoute')

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use('/', videoRoutes)
app.listen(8080, ()=>{
    console.log(`App listening at ${BACKEND_URL}${8080}`)
})