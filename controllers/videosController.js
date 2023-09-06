const fs = require('fs');
const fileupload = require("express-fileupload");
const path=require('node:path')

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
        
        return fileData.push(element, fs.statSync(`${req.body.recordingFolder}\\${element}`))
       }



      }))
    })})
      .then((data) => {
      
      
      const completePath=(`${req.body.recordingFolder}\\${fileData[0]}`)
      
      res.setHeader('Content-Type', 'video/mp4')
      res.setHeader('Content-Length', `${fileData[1].size}`)
      data=fs.createReadStream(completePath)
        res.status(201)
        data.pipe(res)
        
      })
      .catch((err) => {
       
        res.status(400).json(`Error creating post: ${err}`)
      })
  
}