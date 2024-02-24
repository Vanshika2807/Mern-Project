
const Category = require("../models/Category");

//craete tag handler
exports.createCategory = async(req,res) => {
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
            const categoryDetails = await Category.create({
                name:name,
                description:description,
            });
            console.log(categoryDetails);

            //return response
            return res.status(200).json({
                success: true,
                message : "category created successfully",
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
exports.showAllCategory = async(req,res) => {
    try{
        const allCategory = await Category.find({} , {name:true, description:true}); //this means to find all tags but make sure name and description field of them is present 
        res.status(200).json({
            success:true,
            message : "all category returned successfully",
            allCategory,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message : error.message,
        })
    }
}


//categoryPageDetails 
exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }

            //get coursesfor different categories and show them as well
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId}, //ne means not equal to
                                         })
                                         .populate("courses")
                                         .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}
