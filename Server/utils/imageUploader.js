
const cloudinary = require("cloudinary");


//in this function that all parameters will be passed that were used in imageSizeReducer
exports.uploadImageToCloudinary = async(file,folder,height, quality) => {
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    // options.resource_type = auto;

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}