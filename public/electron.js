const { app, BrowserWindow } = require('electron');
const express = require('express');
const fileupload = require('express-fileupload');
const cors = require('cors');
const knex = require('knex')(require('../knexfile'));
const path = require('path');
require('dotenv').config();

const videoRoutes = require('../routes/videosRoute');
const profileRoutes = require('../routes/profileRoute');
const authRoutes = require('../routes/authRoute');
const obsRoutes = require('../routes/obsRoute');

const port = process.env.PORT || 3000;

const appExpress = express();

appExpress.use(cors());
appExpress.use(fileupload());
appExpress.use(express.json());

appExpress.use('/api', videoRoutes);
appExpress.use('/api', profileRoutes);
appExpress.use('/api', authRoutes);
appExpress.use('/api', obsRoutes);



appExpress.use(express.static('hands-off-frontend/build'));
knex.raw('SELECT 1+1 AS result').then(() => {
  console.log('Connection successful!');
}).catch((err) => {
  console.error('Error connecting to database:', err);
});

appExpress.use('/', (req, res, next) => {
  if (req.path === '/') {
    res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
    return;
  }
  next();
});

appExpress.use('/post', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});

appExpress.use('/sites', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'hands-off-frontend', 'build', 'index.html'));
});
console.log("starting")
appExpress.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // Load the Express app in the Electron window
  mainWindow.loadURL(`http://localhost:${port}`);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'win') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
