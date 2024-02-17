
const Tag = require("../models/Tag");

//craete tag handler
exports.createTag = async(req,res) => {
     try{
            const {name,description} = req.body;
            //validate
            if(!name || !description){
                return res.status(400).json({
                    success:false,
                    message : 'All fields are required',
                })
            }

            //create entry in db
            const tagDetails = await Tag.create({
                name:name,
                description:description,
            });
            console.log(tagDetails);

            //return response
            return res.status(200).json({
                success: true,
                message : "tag created successfully",
            })
     }
     catch(error){
        return res.status(500).json({
            success: false,
            message : error.message,
        })
     }
};

//get all tags
exports.showAlltags = async(req,res) => {
    try{
        const allTags = await Tag.find({} , {name:true, description:true}); //this means to find all tags but make sure name and description of them is present 
        res.status(200).json({
            success:true,
            message : "all tags returned successfully",
            allTags,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : error.message,
        })
    }
}