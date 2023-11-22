const express=require('express');
const fileupload = require("express-fileupload");
const app = express();
const cors= require('cors')
const knex = require('knex')(require('./knexfile'));
app.use(cors());
const path = require('path');
require('dotenv').config()
const videoRoutes=require('./routes/videosRoute')
const profileRoutes=require('./routes/profileRoute')
const authRoutes=require("./routes/authRoute")
const port= process.env.PORT || 3000
app.use(fileupload());
app.use(express.json());
app.use('/api', videoRoutes)
app.use('/api', profileRoutes)
app.use('/api', authRoutes)

app.use(express.static('hands-off-frontend/build'));
knex.raw('SELECT 1+1 AS result').then(() => {
  console.log('Connection successful!');
}).catch((err) => {
  console.error('Error connecting to database:', err);
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});
console.log("starting")
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
