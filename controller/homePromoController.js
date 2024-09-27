const catchAsyncError = require('../middlewares/catchAsyncError');
const Promo = require('../model/homePromoModel');

exports.addPromo = catchAsyncError(async(req, res, next) => {
    try {
        
        if (!req.files || !req.files.image1 || !req.files.image2 ) {
            return next(new ErrorHandler('images are required', 400));
        }

        const image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        const image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;

        const promo = await Promo.create({
            image1,
            image2
        })

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Promo added successfully!",
            promo
        });

    } catch (error) {
        res.status(500).json(error)
    }
})


exports.getPromo = catchAsyncError(async (req, res, next) => {
    try {
        const promo = await Promo.findOne(); 

        if (!promo) {
            return next(new ErrorHandler('promo not found', 404));
        }

        res.status(200).json({
            success: true,
            promo
        });
    } catch (error) {
        next(error);
    }
})



exports.updatePromo = catchAsyncError(async (req, res, next) => {
    try {
      const updateData = {}; 
  
      if (req.files) {
        if (req.files.image1 && req.files.image1[0]) {
          updateData.image1 = `${process.env.BACKEND_URL}/upload/${req.files.image1[0].filename}`;
        }
        if (req.files.image2 && req.files.image2[0]) {
          updateData.image2 = `${process.env.BACKEND_URL}/upload/${req.files.image2[0].filename}`;
        }
      }
  
      const promo = await Promo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true } 
      );
  
      if (!promo) {
        return next(new ErrorHandler('promo not found', 404));
      }
  
      res.status(200).json({
        success: true,
        promo
      });
    } catch (error) {
      next(error);
    }
  });