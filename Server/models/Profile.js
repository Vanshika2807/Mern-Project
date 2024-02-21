const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender:{
        type : String,
    },

    dateOfBirth : {
        type : String,
    },
    about : {
        type : String,
        trim : true,
    },
    contactNumber : {
        type : Number,
        trim: true,
    }

    //here initially when user is created his Profile or additional details are kept null 
    //now we just want to update this profile 

});

module.exports = mongoose.model("Profile", profileSchema);