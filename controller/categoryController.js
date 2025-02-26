const CatchAsyncError = require('../middlewares/catchAsyncError')
const Category = require('../model/categoryModel')
const ErrorHandler = require('../middlewares/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const deleteImageWithUrl = require('../utils/deleteImage');

//add category
exports.addCategory = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, parent_category } = req.body;
        // if (!name) {
        //     return next(new ErrorHandler('Name is required', 400));
        // }

        if (!req.files || !req.files.image || !req.files.icon) {
            return next(new ErrorHandler('Image & Icon are required', 400));
        }

        const icon = `${process.env.BACKEND_URL}/upload/${req.files.icon[0].filename}`;
        const image = `${process.env.BACKEND_URL}/upload/${req.files.image[0].filename}`;


        const category = await Category.create({
            parent_category,
            name,
            image,
            icon
        });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category added successfully!",
            category
        });

    } catch (error) {
        res.status(500).json(error)
    }
})



//get all category with search & pagination
exports.getAllCategory = CatchAsyncError(async (req, res, next) => {
    try {
        const { page = 1, limit = 10, parent_category } = req.query;
        const effectiveLimit = Math.max(parseInt(limit), 10);
        const skip = (page - 1) * effectiveLimit;

        const queryObject = {};
        if (parent_category) {
            queryObject.parent_category = { $regex: parent_category, $options: 'i' };
        }

        const totalCount = await Category.countDocuments(queryObject);
        const totalPages = Math.ceil(totalCount / effectiveLimit);

        const category = await Category.find(queryObject)
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
            count: category.length,
            category,
            paginationInfo
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching categories failed",
            error: error.message,
        });
    }
});


//update category
exports.updateCategory = CatchAsyncError(async (req, res, next) => {
    try {
        const { name, parent_category } = req.body;
        let updateData = { name, parent_category };

        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                updateData.image = `${process.env.BACKEND_URL}/upload/${req.files.image[0].filename}`;
            }
            if (req.files.icon && req.files.icon[0]) {
                updateData.icon = `${process.env.BACKEND_URL}/upload/${req.files.icon[0].filename}`;
            }
        }


        const category = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

        if (!category) {
            return next(new ErrorHandler('Category not found', 404));
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category updated successfully!",
            category
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});




//delete category
exports.deleteCategory = CatchAsyncError(async (req, res, next) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
        return res.status(404).json({
            success: false,
            message: "category not found!"
        })
    }
    res.status(200).json({
        statusCode: 201,
        success: true,
        message: "Category Deleted!",
    });

    deleteImageWithUrl()

})


//get single category
exports.getCategory = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!id) {
            return next(new ErrorHandler('Category ID is required', 400));
        }

        const category = await Category.findById(id);

        if (!category) {
            return next(new ErrorHandler('Category not found', 404));
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Category retrieved successfully!",
            category
        });

    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }

})




//to get parent_category only .
exports.getDistinctParentCategories = catchAsyncError(async (req, res, next) => {
    try {
        const distinctParentCategories = await Category.distinct("parent_category");

        // const distinctParentCategories = await Category.aggregate([
        //     {
        //         $group: {
        //             _id: "$parent_category",
        //             categoryId: { $first: "$_id" }
        //         }
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             parent_category: "$_id",
        //             categoryId: 1
        //         }
        //     },
        //     {
        //         $sort: { parent_category: 1 }
        //     }
        // ]);

        if (!distinctParentCategories.length) {
            return next(new ErrorHandler('No distinct parent categories found', 404));
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Distinct parent categories retrieved successfully!",
            count: distinctParentCategories.length,
            distinctParentCategories
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});



//category name
exports.editCategoryName = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { index, newValue } = req.body;

        if (typeof index !== 'number' || index < 0) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        const cat = await Category.findById(id);

        if (!cat) {
            return res.status(404).json({ success: false, message: 'Attribute not found' });
        }

        if (!Array.isArray(cat.name) || index >= cat.name.length) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        cat.name[index] = newValue;
        await cat.save();

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Category name updated successfully!',
            cat
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});



//delete category name
exports.deleteCategoryName = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { index } = req.body;

        if (typeof index !== 'number' || index < 0) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        const cat = await Category.findById(id);

        if (!cat) {
            return res.status(404).json({ success: false, message: 'Parent Category not found' });
        }

        if (!Array.isArray(cat.name) || index >= cat.name.length) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        cat.name.splice(index, 1);
        await cat.save();

        res.status(200).json({
            success: true,
            message: 'Category name deleted successfully',
            cat
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


//add category name
exports.addCategoryName = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid value' });
        }

        const cat = await Category.findById(id);

        if (!cat) {
            return res.status(404).json({ success: false, message: 'Attribute not found' });
        }

        cat.name.push(name);
        await cat.save();

        res.status(200).json({
            success: true,
            message: 'category value added successfully!',
            cat,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
