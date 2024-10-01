const catchAsyncError = require('../middlewares/catchAsyncError');
const Colors = require('../model/colorsModel');
const ErrorHandler = require('../middlewares/errorHandler')


exports.addColor = catchAsyncError(async (req, res, next) => {
    try {
        const { name, color_code } = req.body;

        if (!name) {
            return next(new ErrorHandler('Name is required', 400));
        }

        if (!color_code) {
            return next(new ErrorHandler('Color code is required', 400));
        }

        const color = await Colors.create({
            name,
            color_code
        })

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Color added successfully!",
            color
        });

    } catch (error) {
        next(error);
    }
})


exports.getColors = catchAsyncError(async (req, res, next) => {
    try {
        const { page = 1, limit = 10, name } = req.query;
        const effectiveLimit = Math.max(parseInt(limit), 10);
        const skip = (page - 1) * effectiveLimit;

        const queryObject = {};

        if (name) {
            queryObject.name = { $regex: name, $options: 'i' }; 
        }

        const totalCount = await Colors.countDocuments(queryObject);
        const totalPages = Math.ceil(totalCount / effectiveLimit);

        const color = await Colors.find(queryObject)
            .skip(skip)
            .limit(effectiveLimit)
            .sort({createdAt: -1});

        const paginationInfo = {
            currentPage : parseInt(page),
            nextPage : page < totalPages ? parseInt(page) + 1 : null,
            prevPage: page > 1 ? parseInt(page) -1 : null,
            totalPages,
            totalCount,
        }

        res.status(200).json({
            success: true,
            count: color.length,
            color,
            paginationInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching brands failed",
            error: error.message,
        });
    }
})

exports.deleteColor = catchAsyncError(async (req, res, next) => {
    const color = await Colors.findByIdAndDelete(req.params.id);

    if (!color) {
        return res.status(404).json({
            success: false,
            message: "Color not found!"
        })
    }
    res.status(200).json({
        statusCode: 201,
        success: true,
        message: "Color Deleted Successfully!",
    });
})

exports.editColor = catchAsyncError(async(req, res, next) => {
    try {
        const {name, color_code } = req.body;
        let updateData = {name, color_code};

        const color = await Colors.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!color) {
            return next(new ErrorHandler('Color not found', 404));
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Color updated successfully!",
            color
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
})


exports.getAllColors = catchAsyncError(async (req, res, next) => {
    try {
        const color = await Colors.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: color.length,
            color
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching colors failed",
            error: error.message,
        });
    }
});
