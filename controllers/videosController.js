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
       
      const formData = new FormData();
      const axios=require('axios')
      axios.defaults.headers.common = null;
      data=fs.createReadStream(completePath)
      
          formData?.append('snippet', JSON.stringify(req.body.snippetData))
          formData?.append('file', data)
      const contentLength=formData.getLengthSync()
        return axios.post('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet&mine=true', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${req.body.params['access_token']}`,'Content-Length': contentLength }})
        .catch((err)=>{
          console.log(err)
        })
        
      }).then((result)=>{
        console.log(fileData)
        res.status(201).json(`Successfully posted the video: ${result}`)
      })
      .catch((err) => {
      
       console.log(req.body.params['access_token'])
        res.status(400).json(`Error creating post: ${err}`)
      })
  
}