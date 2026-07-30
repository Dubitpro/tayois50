const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'oanujycn',
  api_key: '527128353556717',
  api_secret: 'OlN-DbBkb2w3jt7-nAHaURRR5YI'
});
const timestamp = Math.round((new Date).getTime()/1000);
const paramsToSign = {
  timestamp: timestamp,
  folder: "wish-wall/videos"
};
const signature = cloudinary.utils.api_sign_request(paramsToSign, cloudinary.config().api_secret);
console.log(JSON.stringify({ timestamp, signature, apiKey: cloudinary.config().api_key }));
