const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:true,
        trim:true,
    },
    lastName : {
        type:String,
        required:true,
        trim:true,
    },
    email: {
        type:String,
        required:true,
        trim:true,
    },
    password: {
        type:String,
        required:true,
    },
    accountType : {
        type:String,
        //enum is written to denote that it can have one of these 3 values
        enum: ["Admin", "Student", "Instructor"],
        required : true
    },
    additionalDetails : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    
    courses : {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    image : {
        type : String, //here type is String as it is url
        required: true,
    },
    token:{
        type:String,
    },
    resetPasswordExpires: {
        type : Date,
    },
    //we have added token and resetPasswordExpires bcoz we want to generate a link to reset password which would be generated according to this unique token 
    //and saved in db also
    
    courseProgress: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: "CourseProgress",
        }
    ]
		// Add timestamps for when the document is created and last modified
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);