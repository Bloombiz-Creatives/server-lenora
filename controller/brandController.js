const Brand = require('../model/brandModel')
const CatchAsyncError  = require("../middlewares/catchAsyncError");
const ErrorHandler = require("../middlewares/errorHandler");
const catchAsyncError = require('../middlewares/catchAsyncError');
const deleteImageWithUrl = require('../utils/deleteImage');

exports.AddBrand = CatchAsyncError(async (req, res, next) => {
    try {
        const { name } = req.body;

        if (!name) {
            return next(new ErrorHandler('Name is required', 400));
        }

        if (!req.file) { 
            return next(new ErrorHandler('Image is required', 400));
        }

        const image = `${process.env.BACKEND_URL}/upload/${req.file.filename}`;

        const brand = await Brand.create({
            name,
            image
        });

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Brand added successfully!",
            brand
        });
    } catch (error) {
        next(error);
    }
});




exports.getAllBrands = catchAsyncError(async (req, res, next) => {
    try {
        const { page = 1, limit = 10, name } = req.query;
        const effectiveLimit = Math.max(parseInt(limit), 10);
        const skip = (page - 1) * effectiveLimit;

        const queryObject = {};
        if (name) {
            queryObject.name = { $regex: name, $options: 'i' }; 
        }

        const totalCount = await Brand.countDocuments(queryObject);
        const totalPages = Math.ceil(totalCount / effectiveLimit);

        const brand = await Brand.find(queryObject)
            .skip(skip)
            .limit(effectiveLimit)
            .sort({ createdAt: -1 });

        const paginationInfo = {
            currentPage: parseInt(page),
            nextPage: page < totalPages ? parseInt(page) + 1 : null,
            prevPage: page > 1 ? parseInt(page) - 1 : null,
            totalPages,
            totalCount,
        };

        res.status(200).json({
            success: true,
            count: brand.length,
            brand,
            paginationInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching brands failed",
            error: error.message,
        });
    }
});





exports.deleteBrand = catchAsyncError(async (req, res, next) => {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
        return res.status(404).json({
            success: false,
            message: "Brand not found!"
        })
    }
    res.status(200).json({
        statusCode: 201,
        success: true,
        message: "Brand Deleted!",
    });

    deleteImageWithUrl()

})