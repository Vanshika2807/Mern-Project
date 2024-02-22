
const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create subsection
// exports.createSubSection = async(req,res) => {
//     try{
//         //fetch data from req body
//         const {sectionId, title, timeDuration, description} = req.body;

//         //extract file/video
//         const video = req.files.videoFile;

//         //validation
//         if(!sectionId || !timeDuration || !title || !description || !video){
//             return res.status(400).json({
//                 success: false,
//                 message: 'all fields are required',
//             });
//         }

//         //upload video to cloudinary and fetch secure url
//         const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

//         //create a sub-section
//         const subSectionDetails = await SubSection.create({
//             title:title,
//             timeDuration:timeDuration,
//             description:description,
//             videoUrl:uploadDetails.secure_url,
//         })

//         //update section with this sub section ObjectId
//         const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},
//                                                     {$push:{
//                                                         subSection:subSectionDetails._id,
//                                                     }},
//                                                     {new:true}).populate("subSection");
//         //HW: log updated section here, after adding populate query

//         //return response
//         return res.status(200).json({
//             succcess:true,
//             message:'Sub Section Created Successfully',
//             updatedSection,
//         });
//     }
//     catch(error) {
//         return res.status(500).json({
//             success:false,
//             message:"Internal Server Error",
//             error:error.message,
//         })
//     }
// }

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
    try {
      // Extract necessary information from the request body
      const { sectionId, title, description } = req.body
      const video = req.files.videoFile

      console.log(video);
      // Check if all necessary fields are provided
      if (!sectionId || !title || !description || !video) {
        return res
          .status(404)
          .json({ success: false, message: "All Fields are Required" })
      }
      console.log(video);
      console.log("hello");
      
      // Upload the video file to Cloudinary
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      
      console.log(uploadDetails)

      // Create a new sub-section with the necessary information
      const SubSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
      })
  
      // Update the corresponding section with the newly created sub-section
      const updatedSection = await Section.findByIdAndUpdate(
        { _id: sectionId },
        { $push: { subSection: SubSectionDetails._id } },
        { new: true }
      ).populate("subSection")
  
      // Return the updated section in the response
      return res.status(200).json({ success: true, data: updatedSection })
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating new sub-section:", error)
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      })
    }
}

exports.updateSubSection = async(req,res) => {
    try{
        //data input
        const {subSectionName, subSectionId} = req.body;

        //validate the data
        if(!subSectionName || !subSectionId){
            return res.status(400).json({
                success: false,
                message : "all fields are required",
            })
        }

        //update data
        const updatedSubSection = await SubSection.findByIdAndUpdate(subSectionId, {subSectionName}, {new:true});

        //return response
        return res.status(200).json({
            success:true,
            message : 'subSection updated successfully',
            updatedSubSection,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "unable to update subSection",
            error: error.message
        })
    }
}

exports.deleteSubSection = async(req,res) => {
    try{
        //get id assuming that we are sending id in params
        const {subSectionId} = req.body;

        //delete section
        await SubSection.findByIdAndDelete(subSectionId);

        //delete section id from Section Schema 
        //hw 

        //return response 
        return res.status(200).json({
            success:true,
            message : 'subSection deleted successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "unable to delete subSection",
            error: error.message
        })
    }
}