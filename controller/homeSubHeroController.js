const catchAsyncError = require("../middlewares/catchAsyncError");
const SubHomeHero = require("../model/homeSubHeroModel")

exports.addSubHero = catchAsyncError(async(req, res, next) => {
    try {
        if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3) {
            return next(new ErrorHandler('images are required', 400));
        }

        const image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        const image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
        const image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;


        const subhero = await SubHomeHero.create({
            image1,
            image2,
            image3
        })

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "SubHero added successfully!",
            subhero
        });


    } catch (error) {
        res.status(500).json(error)   
    }
})


exports.getSubHero = catchAsyncError(async (req, res, next) => {
    try {
        const subhero = await SubHomeHero.findOne(); 

        if (!subhero) {
            return next(new ErrorHandler('Sub hero not found', 404));
        }

        res.status(200).json({
            success: true,
            subhero
        });
    } catch (error) {
        next(error);
    }
})





exports.updateSubHero = catchAsyncError(async (req, res, next) => {
    try {
      const updateData = {}; 
  
      if (req.files) {
        if (req.files.image1 && req.files.image1[0]) {
          updateData.image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        }
        if (req.files.image2 && req.files.image2[0]) {
          updateData.image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
        }
        if (req.files.image3 && req.files.image3[0]) {
          updateData.image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;
        }
      }
  
      const subhero = await SubHomeHero.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } 
      );
  
      if (!subhero) {
        return next(new ErrorHandler('Sub hero not found', 404));
      }
  
      res.status(200).json({
        success: true,
        subhero
      });
    } catch (error) {
      next(error);
    }
  });