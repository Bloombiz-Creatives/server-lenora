const catchAsyncError = require("../middlewares/catchAsyncError");
const HomeHero = require("../model/homeHeroModel")

exports.addHomeHero = catchAsyncError(async (req, res, next) => {
    try {
        if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3) {
            return next(new ErrorHandler('images are required', 400));
        }

        const image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        const image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
        const image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;

        const hero = await HomeHero.create({
            image1,
            image2,
            image3
        })

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Hero added successfully!",
            hero
        });

    } catch (error) {
        res.status(500).json(error)
    }
})

exports.getHomeHero = catchAsyncError(async (req, res, next) => {
    try {
        const hero = await HomeHero.findOne(); 

        if (!hero) {
            return next(new ErrorHandler('Home hero not found', 404));
        }

        res.status(200).json({
            success: true,
            hero
        });
    } catch (error) {
        next(error);
    }
})


exports.updateHomeHero = catchAsyncError(async (req, res, next) => {
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
  
      const hero = await HomeHero.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } 
      );
  
      if (!hero) {
        return next(new ErrorHandler('Home hero not found', 404));
      }
  
      res.status(200).json({
        success: true,
        hero
      });
    } catch (error) {
      next(error);
    }
  });