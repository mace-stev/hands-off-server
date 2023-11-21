const fs = require('fs');
const fileupload = require("express-fileupload");
const path = require('node:path')
const axios = require('axios')
const jwt = require('jsonwebtoken')


exports.recording = (req, res) => {
  if (jwt.verify(req.headers.authorization.split(" ")[2], process.env.SECRET_KEY)) {
    let fileData = [];
    const stats = [];
    const postData = req.body;
    console.log(req.body);
    new Promise((resolve, reject) => {
      fs.readdir(`${req.body.recordingFolder}`, (err, files) => {
        if (err) {
          reject("videosController.js line 21: " + err);
        }

        files.forEach((element, index) => {
          const { size, mtimeMs } = fs.statSync(`${req.body.recordingFolder}\\${element}`);
          stats.push({ size, mtimeMs, element });
        });

        fileData = stats.filter((item) => {
          if (item.mtimeMs === Math.max.apply(null, stats.map(function (o) { return o.mtimeMs; }))) {
            return item;
          }
        });

        resolve(fileData[0].element);
      });
    }).then((response) => {
      console.log(response);
      const completePath = (`${req.body.recordingFolder}\\${response}`);
      const video = fs.readFileSync(completePath);
      axios.defaults.headers.common = null;
      const url = 'https://www.googleapis.com/upload/youtube/v3/videos';

      axios.post(`${url}?uploadType=resumable&part=snippet`, { snippet: req.body.snippetData }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Authorization': `Bearer ${req.headers.authorization.split(" ")[1]}`,
          'X-Upload-Content-Length': `${video.length}`,
          'X-Upload-Content-Type': 'application/octet-stream'
        },
      }).then((response) => {
        const uploadId = response.headers['x-guploader-uploadid'];
        // Send the entire video data as a single request
        axios.put(`${url}?uploadType=resumable&upload_id=${uploadId}`, video, {
          headers: {
            'Authorization': `Bearer ${req.headers.authorization.split(" ")[1]}`,
            'Content-Type': 'application/octet-stream',
            'Content-Length': `${video.length}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            console.log(`Upload progress: ${progress}%`);
          },
        }).then((response) => {
          // Complete the upload
          return axios.put(`${url}?uploadType=resumable&part=status&status=processing&upload_id=${uploadId}`, {
            headers: {
              'Authorization': `Bearer ${req.headers.authorization.split(" ")[1]}`,
              'Content-Type': 'application/json',
              'Content-Length': `${video.length}`
            },
          }).then((response) => {
            console.log('Video uploaded successfully:', response);
            res.status(201).send('Video uploaded successfully')
          }).catch((error) => {
            console.error('Error uploading video:', error);
          });
        }).catch((error) => {
          console.error('Error uploading video data:', error);
        });
      }).catch((error) => {
        console.error('Error uploading snippet data:', error);
      });
    });
  }
}


exports.testing = (req, res) => {
  res.json("I\'m listening")
}