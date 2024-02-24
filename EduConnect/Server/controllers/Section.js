const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res) => {
    try{

        //data fetch
        const {sectionName, courseId} = req.body;

        //data validate
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message : "all fields are required",
            })
        }

        //create section
        const newSection = await Section.create({sectionName});

        //update the course with section Object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent : newSection._id,
                }
            }, {new : true})
            .populate({
				path: "courseContent",
				populate: {
					path: "subSection",
				},
			})
			.exec();

        //return response
        return res.status(200).json({
            success: true,
            message : 'Section created successfully',
            updatedCourseDetails,
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "unable to create section",
            error: error.message
        })
    }
}

exports.updateSection = async(req,res) => {
    try{
        //data input
        const {sectionName, sectionId} = req.body;

        //validate the data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message : "all fields are required",
            })
        }

        //update data
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true});

        //return response
        return res.status(200).json({
            success:true,
            message : 'section updated successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "unable to update section",
            error: error.message
        })
    }
}

exports.deleteSection = async(req,res) => {
    try{
        //get id assuming that we are sending id in params
        const {sectionId} = req.body;

        //delete section
        await Section.findByIdAndDelete(sectionId);

        //delete section id from courseSchema 
        //hw 

        //return response 
        return res.status(200).json({
            success:true,
            message : 'section deleted successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message : "unable to delete section",
            error: error.message
        })
    }
}

