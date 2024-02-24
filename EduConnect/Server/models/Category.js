const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    description: {
        type:String,
    },
    course: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course", 
        //here created an array of course as a tag can have different courses
    }],
});

module.exports = mongoose.model("Category", tagsSchema);