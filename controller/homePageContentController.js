const catchAsyncError = require('../middlewares/catchAsyncError');
const HomePage = require('../model/homePageContentModel');

exports.addHomePage = catchAsyncError(async(req, res, next) => {
    try {
        const {heading, text} = req.body;

        if (!heading) {
            return next(new ErrorHandler('Heading is required', 400));
        }

        if (!text) {
            return next(new ErrorHandler('Text is required', 400));
        }

        const pageContent = await HomePage.create({
            heading,
            text
        });

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "pagecontent added successfully!",
            pageContent
        });

    } catch (error) {
        next(error);
    }
})

exports.getHomePage = catchAsyncError(async(req, res, next) => {
    try {
        const pageContent = await HomePage.find();
        res.status(201).json({statusCode: 200, success: true, message: "Pagecontents fetched successfully", pageContent })
    } catch (error) {
        res.status(error)
    }
})



exports.editHomePage = catchAsyncError(async (req, res, next) => {
    try {
        const { heading, text } = req.body;
        const update = { heading, text };

        const pageContent = await HomePage.findById(req.params.id);

        if (!pageContent) {
            return next(new ErrorHandler('Page content not found', 404));
        }

        const updatedPageContent = await HomePage.findByIdAndUpdate(
            req.params.id, 
            update,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Page content edited successfully",
            pageContent: updatedPageContent
        });
    } catch (error) {
        next(error);
    }
});
