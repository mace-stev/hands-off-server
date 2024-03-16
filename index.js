const express = require('express');
const app = express();
const cors = require('cors')
const knex = require('knex')(require('./knexfile'));
app.use(cors());
const path = require('path');
require('dotenv').config()
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const videoRoutes = require('./routes/videosRoute')
const profileRoutes = require('./routes/profileRoute');
const authRoutes = require("./routes/authRoute")
const obsRoutes = require("./routes/obsRoute")
const port = process.env.PORT || 3000
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const staticMiddleware = express.static(path.resolve(__dirname, 'hands-off-frontend', 'build'));
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 50, 
  message: 'Too many requests from this IP, please try again after 5 minutes',
});

app.use(express.json());
app.use(limiter)
app.use('/api', upload.single('video'), videoRoutes);
app.use('/api', profileRoutes)
app.use('/api', authRoutes)
app.use('/api', obsRoutes)


app.use(express.static('hands-off-frontend/build'));
knex.raw('SELECT 1+1 AS result').then(() => {
  console.log('Connection successful!');
}).catch((err) => {
  console.error('Error connecting to database:', err);
});

app.use('/', (req, res, next) => {
  if (req.path === '/') {
    res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
    return;
  }
  next();
});

app.use('/post', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});

app.use('/sites', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});
app.use('/reset-password/:resetToken', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
})
app.use('/terms-and-conditions', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
})
app.use('/privacy-policy', (req, res) =>{
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
})
console.log("starting")
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
