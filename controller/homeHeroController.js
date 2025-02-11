const catchAsyncError = require("../middlewares/catchAsyncError");
const HomeHero = require("../model/homeHeroModel")

exports.addHomeHero = catchAsyncError(async (req, res, next) => {
    try {
      if (!req.files || !req.files.image1 || !req.files.image2 || !req.files.image3 ||
        !req.files.image4 || !req.files.image5 || !req.files.image6) {
        return next(new ErrorHandler('All six images are required', 400));
    }

        const image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        const image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
        const image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;
        const image4 = `${process.env.BACKEND_URL}/upload/${req.files.image4[0].filename}`;
        const image5 = `${process.env.BACKEND_URL}/upload/${req.files.image5[0].filename}`;
        const image6 = `${process.env.BACKEND_URL}/upload/${req.files.image6[0].filename}`;

        const hero = await HomeHero.create({
            image1,
            image2,
            image3,
            image4,
            image5,
            image6
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


// exports.updateHomeHero = catchAsyncError(async (req, res, next) => {
//     try {
//       const updateData = {}; 
  
//       if (req.files) {
//         if (req.files.image1 && req.files.image1[0]) {
//           updateData.image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
//         }
//         if (req.files.image2 && req.files.image2[0]) {
//           updateData.image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
//         }
//         if (req.files.image3 && req.files.image3[0]) {
//           updateData.image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;
//         }
//         if (req.files.image4 && req.files.image4[0]) {
//           updateData.image4 = `${process.env.BACKEND_URL}/upload/${req.files.image4[0].filename}`;
//         }
//         if (req.files.image5 && req.files.image5[0]) {
//           updateData.image5 = `${process.env.BACKEND_URL}/upload/${req.files.image5[0].filename}`;
//         }
//         if (req.files.image6 && req.files.image6[0]) {
//           updateData.image6 = `${process.env.BACKEND_URL}/upload/${req.files.image6[0].filename}`;
//         }
//       }
  
//       const hero = await HomeHero.findByIdAndUpdate(
//         req.params.id,
//         updateData,
//         { new: true } 
//       );
  
//       if (!hero) {
//         return next(new ErrorHandler('Home hero not found', 404));
//       }
  
//       res.status(200).json({
//         success: true,
//         hero
//       });
//     } catch (error) {
//       next(error);
//     }
//   });

exports.updateHomeHero = catchAsyncError(async (req, res, next) => {
  try {
    const existingHero = await HomeHero.findById(req.params.id);
    
    if (!existingHero) {
      return next(new ErrorHandler('Home hero not found', 404));
    }

    const updateData = {
      // Keep existing images as default
      image1: existingHero.image1,
      image2: existingHero.image2,
      image3: existingHero.image3,
      image4: existingHero.image4 || '', 
      image5: existingHero.image5 || '',
      image6: existingHero.image6 || ''
    }; 

    if (req.files) {
      // Update only the images that are uploaded
      if (req.files.image1 && req.files.image1[0]) {
        updateData.image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
      }
      if (req.files.image2 && req.files.image2[0]) {
        updateData.image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
      }
      if (req.files.image3 && req.files.image3[0]) {
        updateData.image3 = `${process.env.BACKEND_URL}/upload/${req.files.image3[0].filename}`;
      }
      if (req.files.image4 && req.files.image4[0]) {
        updateData.image4 = `${process.env.BACKEND_URL}/upload/${req.files.image4[0].filename}`;
      }
      if (req.files.image5 && req.files.image5[0]) {
        updateData.image5 = `${process.env.BACKEND_URL}/upload/${req.files.image5[0].filename}`;
      }
      if (req.files.image6 && req.files.image6[0]) {
        updateData.image6 = `${process.env.BACKEND_URL}/upload/${req.files.image6[0].filename}`;
      }
    }

    const hero = await HomeHero.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: false } 
    );

    res.status(200).json({
      success: true,
      hero
    });
  } catch (error) {
    next(error);
  }
});