
const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async(req,res) => {
    try{
        //get data
        const {gender ="", dateOfBirth = "", about, contactNumber} = req.body;

        //get user id which is already in decoded form in request body
        const id  = req.user.id;

        //validate data
        if(!about || !contactNumber){
            return res.status(400).json({
                success:false,
                message : "all fields are necessary",
            })
        }

        //find profile using user id
        const userDetails = await User.findById(id);
        const profile = await Profile.findById(userDetails.additionalDetails);
        

        //update profile
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.gender = gender;
        profile.contactNumber = contactNumber;

        //here one method is to do by create method
        //other method is by creating object and using save method
        await profile.save();

        //return response 
        return res.status(200).json({
            success:true,
            message: "user profile updated successfully",
            profile,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}

//delete account
//explore how can we schedule this deletion operation
exports.deleteAccount = async(req,res) => {
    try{
        //get id
        console.log("Printing ID: ", req.user.id);
        const id = req.user.id;

        //validate
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message: 'user not found with this id',
            })
        }

        //delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO hw unenroll user from all enrolled courses

        //delete user
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message : "user deleted successfully",
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        });
    }
}

exports.getAllUserDetails = async (req, res) => {

    try {
        //get id
        const id = req.user.id;

        //validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec(); //we have used here populate additional details so that we just dont gt its id but also full details 
        console.log(userDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:'User Data Fetched Successfully',
            userDetails,
        });
       
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};