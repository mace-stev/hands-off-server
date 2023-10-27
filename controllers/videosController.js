const fs = require('fs');
const fileupload = require("express-fileupload");
const path = require('node:path')
const FormData = require('form-data');
const axios = require('axios')
exports.recording = (req, res) => {

  let fileData = []
  const stats = []
  const postData = req.body
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
      }});
      resolve(
      fileData[0].element
    
    )})}).then((response)=>{
    console.log(response)
    const completePath = (`${req.body.recordingFolder}\\${response}`)
    console.log(completePath)
    
    const formData = new FormData();
    axios.defaults.headers.common = null;
    const data = fs.createReadStream(completePath)

    formData?.append('snippet', JSON.stringify(req.body.snippetData))
    formData?.append('file',fs.createReadStream(completePath))
    /*    const contentLength=formData.getLengthSync() */
    return axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet&mine=true', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${req.headers.authorization}` } })})
      .then((result) => {
        console.log(result)
        res.status(201).json(`Successfully posted the video: ${result}`)
      })
      .catch((err) => {
        console.log(err + " line 42")
        res.status(400).json(`(videosController.js line 51): Error creating post: ${err}`)
      })
  }

exports.testing = (req, res) => {
      res.json("I\'m listening")
    }