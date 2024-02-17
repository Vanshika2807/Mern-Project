
const { response } = require("express");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken - this is sending the mail of frontened ui

exports.resetPasswordToken = async(req,res) => {
    try{
        //get email from req body
        const {email} = req.body;

        //check user for this email and validate it
        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message : 'your email is not registered with us',
            })
        }

        //generate token - because on basis of token link of url will be generated
        const token = crypto.randomUUID();

        //it should not be like the same url is used everytime to reset password it should have some expiration time 
        //the link generated should be unique for everyone hence token is used 

        //update user by adding token and expiration time
        const updatedDetails = await User.findByIdAndUpdate({email:email},
            {
                token : token , //by this we are storing token in user body so that we can reset password on the basis token
                resetPasswordExpires: Date.now() + 5*60*1000,
            },
            {new : true});

        //create url
        const url = `http://localhost:3000/update-password/${token}` //this is frontened url as it runs on 3000 port

        //send email containing url
        await mailSender(email,"password Reset link",
                        `password Reset link : ${url}`);

        //return response 
        return response.json({
            success:true,
            message : "mail sent successfully please check email and change password",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "something went wrong while reseting the password",
        })
    }
}


//resetPassword - this is actually reseting the password and updating in db
exports.resetPassword = async(req,res) => {

    try{
            //data fetch
        const {password, confirmPassword, token} = req.body;

        //validation
        if(password !== confirmPassword){
            return res.json({
                success: false,
                message : 'password not matching'
            });
        }

        //get user details with the help of token
        const userDetails = await User.findOne({token: token});

        //if no entry then invalid token
        if(!userDetails){
            return res.json({
                success: false,
                message : 'token is invalid',
            });
        }

        // check time of token 
        if(userDetails.resetPasswordExpires < Date.now()){
                return res.json({
                    success: false,
                    message : 'token is expired plz regenerate the token',
                });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password,10);

        //password update 
        await User.findOneAndUpdate(
            {token : token},
            {password: hashedPassword},
            {new : true},
        )

        //return response
        return res.status(200).json({
            success:true,
            message : 'password reset successful',
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message : "something went wrong while reseting the password",
        })
    }
}