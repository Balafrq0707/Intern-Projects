require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const folderPath = path.join(__dirname, 'utils');

fs.readdir(folderPath, (err, files)=>{
  if(err){
    console.log("Error connecting to the folder path:", err)
    return; 
  }

  files.forEach(file=>{
     const filePath = path.join(folderPath, file)
     cloudinary.uploader.upload(filePath, {folder: 'prod_images'})

     .then(result=>console.log(`Uploaded ${file}:`, result.secure_url))
     .catch(err => {
      console.error(` Failed to upload ${file}:`, err);
    
    })
  })
})
module.exports = cloudinary;
