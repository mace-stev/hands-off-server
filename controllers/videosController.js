const fs = require('fs');
const fileupload = require("express-fileupload");
const path = require('node:path')
const FormData = require('form-data');
const axios = require('axios')
const cliProgress = require('cli-progress');
exports.recording = (req, res) => {
  const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
  let fileData = []
  const stats = []
  let uploadedBytes = 0;
  
  const postData = req.body
  console.log(req.body)
  new Promise((resolve, reject) => {
    fs.readdir(`${req.body.recordingFolder}`, (err, files) => {
      if (err) {
        reject("videosController.js line 21: " + err)
      }

      files.forEach((element, index) => {
        const { size, mtimeMs } = fs.statSync(`${req.body.recordingFolder}\\${element}`);
        stats.push({ size, mtimeMs, element });
      })

      fileData = stats.filter((item) => {
        if (item.mtimeMs === Math.max.apply(null, stats.map(function (o) { return o.mtimeMs; }))) {
          return item;
        }
      });
      resolve(
        fileData[0].element
      )
    })
  }).then((response) => {
    console.log(response)
    const completePath = (`${req.body.recordingFolder}\\${response}`)
    const formData= new FormData()
    console.log(completePath);
    axios.defaults.headers.common = null;
    const data = fs.createReadStream(completePath)
    progressBar.start(fileData[0].size, 0);
    data.on('data', chunk => {
      uploadedBytes += chunk.length;
      progressBar.update(uploadedBytes);
    });
    data.on('end', () => {
      progressBar.stop();
    });
    console.log(req.body.snippetData)
    
    
    formData?.append('snippet', JSON.stringify(req.body.snippetData))
    formData?.append('video', data)

    
    return axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=multipart&part=snippet&mine=true', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${req.headers.authorization}` } })
      .then((result) => {
        console.log(result);
        res.status(201).json(`Successfully posted the video: ${result}`);
      })
      .catch((err) => {
        console.log(err + " line 51");
        res.status(500).json(`(videosController.js line 64): Error uploading video: ${err}`);
      });
  });
};
  
  exports.testing = (req, res) => {
  res.json("I\'m listening")
}