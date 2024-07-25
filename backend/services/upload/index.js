const cloudinary = require("@configs/cloudinary");
const os = require("os");

exports.envPath = (path = "files") => {
  const app_name = "Ecommerce_B3";
  if (["dev", "development", "production"].includes(process.env.NODE_ENV)) {
    return `/${app_name}/${path}/dev`;
  } else {
    return "";
  }
  // else if (process.env.NODE_ENV === "production") {
  //   return `/${app_name}/${path}`;
  // } else {
  //   return "";
  // }
};

exports.initUploadStatus = async (req, res) =>
  res.status(200).send({ status: "done" });

exports.uploadImage = async (imagePath, bucketFile, CropOptions = null) => {
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    folder: bucketFile,
    ...CropOptions,
  };

  try {
    const result = await cloudinary.uploader.upload(imagePath, options);
    return result;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
exports.deleteImage = async (path) => {
  try {
    await cloudinary.uploader.destroy(path);
  } catch (e) {
    console.error(e);
    throw e;
  }
};
