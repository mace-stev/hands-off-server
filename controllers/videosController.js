const fs = require('fs');
const fileupload = require("express-fileupload");


exports.recording = (req, res) => {
  let fileData = []
  const postData = req.body
  return new Promise((resolve, reject) => {
    fs.readdir(`${req.body.recordingFolder}`, (err, files) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      const time =new Date().getTime();
     resolve(files.forEach((element) => {
     
       if((fs.statSync(`${req.body.recordingFolder}\\${element}`).mtimeMs)>time-6000){
        return fileData.push(element)
       }



      }))
    })})
      .then((data) => {
      console.log(fileData)
        res.status(201).json(fileData)
      })
      .catch((err) => {
        res.status(400).json(`Error creating post: ${err}`)
      })
  
}