const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET  //KEYS MUST BE SAME in this config..
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params:{
    folder: 'WanderLust_dev',
    allowerdFormats: ['png', 'jpg', 'jpeg'],
},
}); 



module.exports = {
    cloudinary,
    storage
};