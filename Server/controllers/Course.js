
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

const {uploadImageToCloudinary}  = require("../utils/imageUploader");

//createCourseHandler function
exports.createCourse = async(req,res) => {
    try{
        //fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, category,tag} = req.body;

        const {thumbnail} = req.files.thumbnailImage;

        //validation
        console.log(courseName);
        console.log(courseDescription);
        console.log(whatYouWillLearn);
        console.log(price);
        console.log(category);
        console.log(thumbnail);
        console.log(tag);

        // if(!courseName || !courseDescription ||  !whatYouWillLearn || !price ||  !category || !thumbnail || !tag){
        //     return res.status(400).json({
        //         success: false,
        //         message : 'all fields are required',
        //     })
        // }

        //check for instructor - why this needed if its already checked in middleware
        //this is needed bcoz we need to store instructor id in course schema

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("instructor details: ",instructorDetails);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message : 'instructor details not found',
            });
        }

        //check given tag is valid or not
        const categoryDetails  = await Category.findById(tag);
        if(!categoryDetails){
            return res.status(404).json({
                success: false,
                message : 'category details not found',
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag:tag,
            category:categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });
        

        //add the new course to user schema of instructor
        await User.findByIdAndUpdate(
            {_id : instructorDetails._id},
            {
                $push:{
                    courses: newCourse._id,
                }
            },
            {new : true},
        );

        //update the category schema
        // Add the new course to the Categories
		await Category.findByIdAndUpdate(
			{ _id: category },
			{
				$push: {
					course: newCourse._id,
				},
			},
			{ new: true }
		);

        //return response
        return res.status(200).json({
            success: true,
            message : "course is created successfully",
            data: newCourse
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : 'failed to create course',
            message : error.message,
        })
    }
}

//getAllCourses handler function
exports.showAllCourses = async(req,res) => {
    try{
        const allCourses = await Course.find({},
            {
				courseName: true,
				price: true,
				thumbnail: true,
				instructor: true,
				ratingAndReviews: true,
				studentsEnrolled: true,
			})
            .populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message : 'data for all courses fetched successfully',
            data: allCourses,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : 'cannot fetch course data',
            error: error.message
        })
    }
}

//getCourseDetails
exports.getCourseDetails = async(req,res) => {
    try{
        //get id
        const {courseId} = req.body;
        //find course details
        const courseDetails = await Course.find(
                                    {_id:courseId})
                                    .populate( //here we have used nesting population 
                                        {
                                            path:"instructor",
                                            populate:{
                                                path:"additionalDetails",
                                            },
                                        }
                                    )
                                    .populate("category")
                                    .populate("ratingAndreviews")
                                    .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection",
                                        },
                                    })
                                    .exec();
        
        //validation
        if(!courseDetails){
            return res.status(400).json({
                success: false,
                message: `could not find the course with ${courseId}`,
            });
        }

        //return response 
        return res.status(200).json({
            success: true,
            message : "course details fetched successfully",
            data : courseDetails,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : error.message,
        });
    }
}