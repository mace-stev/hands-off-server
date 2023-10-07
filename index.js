const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
const path = require('path');
require('dotenv').config()


const videoRoutes=require('./routes/videosRoute')
const profileRoutes=require('./routes/profileRoute')

app.use(fileupload());
app.use(cors());
app.use(express.json());
app.use('/api', videoRoutes)
app.use('/api', profileRoutes)

app.use(express.static(path.join(__dirname, 'hands-off-frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});
console.log("starting")
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});
