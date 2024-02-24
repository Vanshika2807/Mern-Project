
const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");

const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the razorpay order
exports.capturePayment = async(req,res) => {

    //get course id and user id
    const {course_id} = req.body;
    const userId = req.user.id;

    //validation
    //valid courseid
    if(!course_id){
        return res.json({
            success: false,
            message : "please provide valid course id",
        })
    }

    //valid coursedetail
    let course;
    try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success: false,
                message: 'could not find the course',
            });
        }
        
        //check if user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        //here we have converted the user id which was with us in string format into object id
        if(course.studentsEnrolled.includes(uid)){
            return res.status(400).json({
                success: false,
                message : 'student is already enrolled',
            });
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message : error.message,
        });
    }

    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount : amount*100,
        currency,
        receipt : Math.random(Date.now()).toString(),
        notes:{
            courseId: course_id,
            userId,
        }
        //have passed these two in notes so that after verifying signature we can enroll the student in particular course
    };

    try{
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        //return response
        return res.status(200).json({
            success:true,
            courseName: course.courseName,
            courseDescription : course.courseDescription,
            thumbnail : course.thumbnail,
            orderId : paymentResponse.id,
            ammount: paymentResponse.amount,
            currency: paymentResponse.currency,
        })

    }
    catch(error){

        console.log(error);
        res.json({
            success: false,
            message:"could not initiate order",
        })
    }
};

//verify signature of razorpay and server of webhook
exports.verifySignature = async(req,res) => {
    const webhookSecret = "12345678";

    const signature = req.headers["x-razorpay-signature"];

    const shasum =  crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if(signature === digest){
        console.log("Payment is Authorised");

        const {courseId, userId} = req.body.payload.payment.entity.notes;
        //we have passesd these two in options in notes

        try{

            //fulfil the action

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push:{studentsEnrolled: userId}},
                {new:true},
            );

            if(!enrolledCourse) {
            return res.status(500).json({
            success:false,
            message:'Course not Found',
            });
            }

            console.log(enrolledCourse);

            //find the student and add the course to the list of enrolled courses  
            const enrolledStudent = await User.findOneAndUpdate(
                                {_id:userId},
                                {$push:{courses:courseId}},
                                {new:true},
            );

            console.log(enrolledStudent);

            //send confirmation mail to user id 
            const emailResponse = await mailSender(
                                enrolledStudent.email,
                                "Congratulations from CodeHelp",
                                "Congratulations, you are onboarded into new CodeHelp Course",
            );

            console.log(emailResponse);

            //return response
            return res.status(200).json({
            success:true,
            message:"Signature Verified and COurse Added",
            });
        }

        catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });
        }
    }

    else {
        return res.status(400).json({
            success:false,
            message:'Invalid request',
        });
    }
}