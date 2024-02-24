
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
require("dotenv").config();

//sendOTP
exports.sendOTP = async(req,res) => {
    try{
        //fetch email from req body
        const {email} = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        //if user alreday exist tehn return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message : 'User already registered',
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6,{ //here 6 is length of otp
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log(otp);

        //check if otp generated is unique or not by finding in otp collection
        let result = await OTP.findOne({otp : otp});
        console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);

        while(result){  //jab tak unique otp nhi mil jaata tab tk new otp generate krta rahunga
            otp = otpGenerator.generate(6,{ //here 6 is length of otp
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            // result = await OTP.findOne({otp : otp});
        }

        const otpPayload = {email,otp};

        //create an entry of otp in db
        const otpBody = await OTP.create(otpPayload);
        console.log("OTP Body ",otpBody);

        //return successful response
        res.status(200).json({
            success: true,
            message : 'OTP sent successfully',
            otp,
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//signUp
exports.signup = async(req,res) => {

    try{
        //data fetch from request body
        const{
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp} = req.body;

        //validate the input data
        if(!firstName || !lastName || !email || !password || !confirmPassword
            || !otp) {
                return res.status(403).json({
                    success:false,
                    message:"All fields are required",
                })
        }

        //match the 2 passwords , confirmPassword
        if(password !== confirmPassword) {
            return res.status(400).json({
                success:false,
                message:'Password and ConfirmPassword Value does not match, please try again',
            });
        }

        //check user already exits or not
        const existingUser = await User.findOne({email});
            if(existingUser) {
                return res.status(400).json({
                    success:false,
                    message:'User is already registered',
                });
            }

        //find most recent otp stored for user as their can be multiple otps generated for single user
        //createdat -1 to find last one stored or in desc order of time
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate otp
        if(recentOtp.length === 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message: 'otp not found',
            })
        }  else if(otp !== recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message : "invalid otp",
            });
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //Create the Additional Profile For User
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType: accountType,
            approved: approved,
            additionalDetails: profileDetails._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return successful response
        return res.status(200).json({
            success:true,
            message:'User is generated successfully',
        })
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered plz try again later'
        })
    }
  
}

//Login
exports.login = async (req,res) => {
    try{
        //get data from req body
        const {email, password} = req.body;

        //validation data
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message: 'all fields are required'
            });
        }

        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success: false,
                message : "user is not signed up plz signup first"
            });
        }

        //generate jwt , after password match
        if(await bcrypt.compare(password,user.password)){

            const payload = {
                email:user.email,
                id:user._id,
                accountType :user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly : true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message : "user logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'password is incorrect',
            });
        }
        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : 'login failure, plz try again later',
        })
    }
};

//changePassword
exports.changePassword = async (req,res) => {
    
    try{
    //get data from req body
    const userDetails = await User.findById(req.user.id);

    //get oldPassword, newPassword, confirmPassword
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    //validation old password
    const isPasswordMatch = await bcrypt.compare(
        oldPassword,
        userDetails.password
    );
    if (!isPasswordMatch) {
        // If old password does not match, return a 401 (Unauthorized) error
        return res
            .status(401)
            .json({ success: false, message: "The password is incorrect" });
    }

    //match new password and confirm new password
    if (newPassword !== confirmNewPassword) {
        // If new password and confirm new password do not match, return a 400 (Bad Request) error
        return res.status(400).json({
            success: false,
            message: "The password and confirm password does not match",
        });
    }

    //update the password in database
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
    );

    //send mail of password updated
    try {
        const emailResponse = await mailSender(
            updatedUserDetails.email,
            passwordUpdated(
                updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
        );
        console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while sending email",
            error: error.message,
        });
    }

    //return response
    
        return res.status(200).json(
            { success: true, message: "Password updated successfully" 
        });
    }
    
	catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}


}
