const fs = require('fs');
const path = require('node:path')
const axios = require('axios')
const jwt = require('jsonwebtoken')




exports.recording = (req, res) => {
  if (jwt.verify(req.headers.authorization.split(" ")[2], process.env.SECRET_KEY)) {
    let fileData = [];
    const stats = [];
    const postData = req.body;
    console.log(req.body);
    const videoBuffer = req.file.buffer;
    console.log(JSON.parse(req.body.snippetData))
    
    axios.defaults.headers.common = null;
    const url = 'https://www.googleapis.com/upload/youtube/v3/videos';

    axios.post(`${url}?uploadType=resumable&part=snippet`, { snippet: JSON.parse(req.body.snippetData )}, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${req.headers.authorization.split(" ")[1]}`,
        'X-Upload-Content-Length': `${videoBuffer.length}`,
        'X-Upload-Content-Type': 'application/octet-stream'
      },
    }).then((response) => {
      const uploadId = response.headers['x-guploader-uploadid'];
      // Send the entire video data as a single request
      axios.put(`${url}?uploadType=resumable&upload_id=${uploadId}`, videoBuffer, {
        headers: {
          'Authorization': `Bearer ${req.headers.authorization.split(" ")[1]}`,
          'Content-Type': 'application/octet-stream',
          'Content-Length': `${videoBuffer.length}`
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
            'Content-Length': `${videoBuffer.length}`
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
  }
}


exports.testing = (req, res) => {
  res.json("I\'m listening")
}