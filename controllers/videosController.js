const fs = require('fs');
const fileupload = require("express-fileupload");
const path=require('node:path')
const FormData = require('form-data');
exports.recording = (req, res) => {
  let fileData = []
  const postData = req.body
  console.log(postData)
  console.log(req.headers.authorization)
  return new Promise((resolve, reject) => {
    fs.readdir(`${req.body.recordingFolder}`, (err, files) => {
      if (err) {
        console.log("videosController.js line 12: "+ err)
        reject("videosController.js line 12: "+ err)
      }
      const time =new Date().getTime();
     resolve(files.forEach((element) => {
     
       if((fs.statSync(`${req.body.recordingFolder}\\${element}`).mtimeMs)>time-6000){
        
        return fileData.push(element, fs.statSync(`${req.body.recordingFolder}\\${element}`))
       }



      }))
    })})      .then((data) => {
      
      const completePath=(`${req.body.recordingFolder}\\${fileData[0]}`)
       console.log(completePath)
      const formData = new FormData();
      const axios=require('axios')
      axios.defaults.headers.common = null;
      data=fs.createReadStream(completePath)
      
          formData?.append('snippet', JSON.stringify(req.body.snippetData))
          formData?.append('file', data)
   /*    const contentLength=formData.getLengthSync() */
       console.log('hi')
      console.log(req.headers.authorization)
        return axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet&mine=true', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `${req.headers.authorization}` }})
        .catch((err)=>{
          console.log( err)
          console.log(err+" videosController.js line 41")
        })
        
      }).then((result)=>{
        console.log(result)
        res.status(201).json(`Successfully posted the video: ${result}`)
      })
      .catch((err) => {
      
      
       console.log(err)
        res.status(400).json(`(videosController.js line 51): Error creating post: ${err}`)
      })
  
}
exports.testing=(req,res)=>{
  res.json("I\'m listening")
}