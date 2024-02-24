const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({

   title : {
    type : String ,
   },

   timeDuration : {
    type : String,
   },  //doubt why here time is string

   description : {
    type : String,
   },

   videoUrl : {
    type : String,
   }


});

module.exports = mongoose.model("SubSection", subSectionSchema);