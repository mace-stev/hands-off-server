const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
const path = require('path');
require('dotenv').config()


const videoRoutes=require('./routes/videosRoute')
const profileRoutes=require('./routes/profileRoute')
const port= process.env.PORT || 8000

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use('/api', videoRoutes)
app.use('/api', profileRoutes)

app.use(express.static('hands-off-frontend/build'));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});
console.log("starting")
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
