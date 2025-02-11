const catchAsyncError = require("../middlewares/catchAsyncError");
const Category = require('../model/categoryModel');
const Product = require('../model/productModel');
const ErrorHandler = require('../middlewares/errorHandler');
const AttributeData = require('../model/attributeModel');
const deleteImageWithUrl = require("../utils/deleteImage");


//to get category based on parent name
exports.getCategoryNamesByParent = catchAsyncError(async (req, res, next) => {
    const { parent_category } = req.query;

    if (!parent_category) {
        console.log('Parent category is missing');
        return res.status(400).json({ message: "Parent category is required" });
    }

    const trimmedParentCategory = parent_category.trim();

    const categories = await Category.find({ parent_category: trimmedParentCategory }).select('name');
    console.log('Found categories:', categories);

    if (!categories.length) {
        console.log('No categories found for:', trimmedParentCategory);
        return res.status(404).json({ message: "No categories found for the specified parent category" });
    }

    res.status(200).json({
        statusCode: 200,
        success: true,
        count: categories.length,
        categories
    });
});


exports.addProduct = catchAsyncError(async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            brand,
            meta_title,
            meta_desc,
            attribute,
            color,
            parent_category,
            sub_category
        } = req.body;

        if (!name || !description || !price || !brand || !parent_category || !sub_category) {
            return next(new ErrorHandler('All required fields must be filled', 400));
        }

        if (!req.files || !req.files.image) {
            return next(new ErrorHandler('Image is required', 400));
        }


        let attribute_value = [];
        if (req.body.attribute_value) {
            try {
                attribute_value = JSON.parse(req.body.attribute_value);
                // Validate the structure of each attribute value
                attribute_value = attribute_value.map(av => ({
                    value: av.value,
                    additional_price: parseFloat(av.additional_price) || 0
                }));
            } catch (error) {
                console.error('Error parsing attribute_value:', error);
                return next(new ErrorHandler('Invalid attribute value format', 400));
            }
        }


        const image = `${process.env.BACKEND_URL}/upload/${req.files.image[0].filename}`;
        const gallery1 = req.files && req.files['gallery1'] ? `${process.env.BACKEND_URL}/upload/${req.files['gallery1'][0].filename}` : undefined;
        const gallery2 = req.files && req.files['gallery2'] ? `${process.env.BACKEND_URL}/upload/${req.files['gallery2'][0].filename}` : undefined;
        const gallery3 = req.files && req.files['gallery3'] ? `${process.env.BACKEND_URL}/upload/${req.files['gallery3'][0].filename}` : undefined;
        const gallery4 = req.files && req.files['gallery4'] ? `${process.env.BACKEND_URL}/upload/${req.files['gallery4'][0].filename}` : undefined;
        const gallery5 = req.files && req.files['gallery5'] ? `${process.env.BACKEND_URL}/upload/${req.files['gallery5'][0].filename}` : undefined;

        const product = await Product.create({
            name,
            description,
            price,
            brand,
            parent_category,
            sub_category,
            image,
            gallery1,
            gallery2,
            gallery3,
            gallery4,
            gallery5,
            meta_title,
            meta_desc,
            attribute,
            attribute_value,
            color
        });

        res.status(201).json({
            success: true,
            product,
        });

    } catch (error) {
        next(error);
    }
});


exports.editProduct = catchAsyncError(async (req, res, next) => {
    try {
        const {
            name,
            description,
            price,
            brand,
            meta_title,
            meta_desc,
            attribute,
            // attribute_value,
            color,
            parent_category,
            sub_category
        } = req.body;


        const product = await Product.findByIdAndUpdate(req.params.id);

        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        let attribute_value = product.attribute_value; 
        if (req.body.attribute_value) {
            try {
                attribute_value = JSON.parse(req.body.attribute_value);
                attribute_value = attribute_value.map(av => ({
                    value: av.value,
                    additional_price: parseFloat(av.additional_price) || 0
                }));
            } catch (error) {
                console.error('Error parsing attribute_value:', error);
                return next(new ErrorHandler('Invalid attribute value format', 400));
            }
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.brand = brand || product.brand;
        product.meta_title = meta_title || product.meta_title;
        product.meta_desc = meta_desc || product.meta_desc;
        product.attribute = attribute || product.attribute;
        product.color = color || product.color;
        product.parent_category = parent_category || product.parent_category;
        product.sub_category = sub_category || product.sub_category;
        product.attribute_value = attribute_value || product.attribute_value;

        if (req.files && req.files.image) {
            product.image = `${process.env.BACKEND_URL}/upload/${req.files.image[0].filename}`;
        }


        if (req.files) {
            product.gallery1 = req.files.gallery1 ? `${process.env.BACKEND_URL}/upload/${req.files.gallery1[0].filename}` : product.gallery1;
            product.gallery2 = req.files.gallery2 ? `${process.env.BACKEND_URL}/upload/${req.files.gallery2[0].filename}` : product.gallery2;
            product.gallery3 = req.files.gallery3 ? `${process.env.BACKEND_URL}/upload/${req.files.gallery3[0].filename}` : product.gallery3;
            product.gallery4 = req.files.gallery4 ? `${process.env.BACKEND_URL}/upload/${req.files.gallery4[0].filename}` : product.gallery4;
            product.gallery5 = req.files.gallery5 ? `${process.env.BACKEND_URL}/upload/${req.files.gallery5[0].filename}` : product.gallery5;
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product,
        });

    } catch (error) {
        next(error);
    }
});


exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });

        deleteImageWithUrl()


    } catch (error) {
        next(error);
    }
});


exports.getProducts = catchAsyncError(async (req, res, next) => {
    try {
        const { page = 1, limit = 20, name, brand, parent_category, sub_category, todaysDeal, featured  } = req.query;
        const effectiveLimit = Math.max(parseInt(limit), 20);
        const skip = (page - 1) * effectiveLimit;

        const queryObject = {};

        if (name) {
            queryObject.name = { $regex: name, $options: 'i' };
        }

        if (brand) {
            queryObject.brand = brand; 
        }

        if (parent_category) {
            // queryObject.category = { $regex: parent_category, $options: 'i' }; 
            queryObject.parent_category = parent_category; 
        }

        if (sub_category) {
            queryObject.sub_category = { $regex: sub_category, $options: 'i' }; 
        }

        if (todaysDeal === 'true' || todaysDeal === 'false') {
            queryObject.todaysDeal = todaysDeal === 'true';
        }

        if (featured === 'true' || featured === 'false') {
            queryObject.featured = featured === 'true';
        }

        const totalCount = await Product.countDocuments(queryObject);
        const totalPages = Math.ceil(totalCount / effectiveLimit);

        const products = await Product.find(queryObject)
            .populate('brand') 
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
            count: products.length,
            products,
            paginationInfo
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching products failed",
            error: error.message,
        });
    }
});



exports.toggleTodaysDeal = catchAsyncError(async (req, res, next) => {
    const { todaysDeal } = req.body;

    const toggles = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { todaysDeal: todaysDeal } },
        { new: true, runValidators: true }
    );

    if (!toggles) {
        return next(new ErrorHandler('Failed to update Todays Deal', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Todays Deal is Updated',
        toggles,
    });
});

//get todays deal products
exports.getTodaysDeals = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ todaysDeal: true });

    res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
});


//make featured success and fail
exports.toggleFeatured = catchAsyncError(async (req, res, next) => {
    const { featured } = req.body;

    const toggles = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: { featured: featured } },
        { new: true, runValidators: true }
    );

    if (!toggles) {
        return next(new ErrorHandler('Failed to update Todays Deal', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Todays Deal updated successfully!',
        toggles,
    });
});

//get featured datas
exports.getFeatured = catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ featured: true });

    res.status(200).json({
        success: true,
        count: products.length,
        products,
    });
});


//get attribute name
exports.getDistinctAttributeNames = catchAsyncError(async (req, res, next) => {
    try {
        const distinctAttributeNames = await AttributeData.find().select('name');

        if (!distinctAttributeNames.length) {
            return next(new ErrorHandler('No distinct attrinute names found', 404));
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Distinct attribute names retrieved successfully!",
            count: distinctAttributeNames.length,
            distinctAttributeNames
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


//get attribute values
exports.getAttributeValues = catchAsyncError(async (req, res, next) => {
    try {
        const AttributeValues = await AttributeData.findById(req.params.id).select('value');
        if (!AttributeValues) {
            return res.status(404).json({ error: 'Attribute not found' });
        }
        res.json({
            statusCode: 200,
            success: true,
            // AttributeValues: AttributeValues.value.
            AttributeValues

        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});




// latest added 5 products
exports.getLatestProducts = catchAsyncError(async (req, res, next) => {
    try {
        const numberOfProducts = 6;

        const products = await Product.find({})
            .populate('brand')
            .sort({ createdAt: -1 })  // Sort by creation date in descending order
            .limit(numberOfProducts);  // Limit the result to 5

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching latest products failed",
            error: error.message,
        });
    }
});

//get last 10 products
exports.getLastTenItems = catchAsyncError(async (req, res, next) => {
    try {
        const numberOfProducts = 10;

        const products = await Product.find({})
            .populate('brand')
            .sort({ createdAt: -1 })  // Sort by creation date in descending order
            .limit(numberOfProducts);  // Limit the result to 10

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Fetching last 10 items failed",
            error: error.message,
        });
    }
});


//get broduct by id
exports.getProductById = catchAsyncError(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        .populate({
            path: 'color',
            select: 'name color_code'
        })
        .populate({
            path: 'brand', 
            select: 'name' 
        })
        .populate({
            path: 'attribute',  
            select: 'name'     
        });

        
        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            product,
        });

    } catch (error) {
        next(error);
    } 
});



//get  parent Category 
exports.getDistinctCategoryParent = catchAsyncError(async (req, res, next) => {
    try {
        const distinctParent = await Category.find().select('parent_category');

        if (!distinctParent.length) {
            return next(new ErrorHandler('No distinct parent_category found', 404));
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Distinct parent_category retrieved successfully!",
            count: distinctParent.length,
            distinctParent
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


//get attribute values
exports.getCategoryNames = catchAsyncError(async (req, res, next) => {
    try {
        const catnames = await Category.findById(req.params.id).select('name');
        if (!catnames) {
            return res.status(404).json({ error: 'Category names not found' });
        }
        res.json({
            statusCode: 200,
            success: true,
            // AttributeValues: AttributeValues.value.
            catnames

        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});
