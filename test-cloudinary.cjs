const cloudinary = require('cloudinary').v2;
try {
  cloudinary.config({
    secure: true
  });
  console.log("Config loaded");
  console.log(cloudinary.config().cloud_name);
} catch (e) {
  console.error("Error", e);
}
