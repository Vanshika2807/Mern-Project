
//remember we have done all these middlewares in authorization and authentication in protected routes
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req,res,next) => {
    try{
        //to check authentication you can check json token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","");

        //if token is missing
        if(!token){
            return res.status(401).json({
                success:false,
                message : 'token is missing',
            })
        }

        //verify the token
        try{
            const decode =  jwt.verify(token, process.env,JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(error){
            return res.status(401).json({
                success:false,
                message : 'token is invalid',
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message : 'something went wrong while validating the token',
        });
    }
}

//isStudent
exports.isStudent = async(req,res,next) => {
    try{
        //first type you can fetch role from req.user.role
        //second type is by extracting account type from db
        
        if(req.user.accountType !== "Student"){
            return res.satus(401).json({
                success: false,
                message: 'this is a protected route for students only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : 'User role cannot be verified , plz try again'
        })
    }
}

//isInstructor
exports.isInstructor = async(req,res,next) => {
    try{
        //first type you can fetch role from req.user.role
        //second type is by extracting account type from db
        
        if(req.user.accountType !== "Instructor"){
            return res.satus(401).json({
                success: false,
                message: 'this is a protected route for instructor only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : 'User role cannot be verified , plz try again'
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next) => {
    try{
        //first type you can fetch role from req.user.role
        //second type is by extracting account type from db
        
        if(req.user.accountType !== "Admin"){
            return res.satus(401).json({
                success: false,
                message: 'this is a protected route for admin only',
            });
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : 'User role cannot be verified , plz try again'
        })
    }
}