const catchAsyncError = require('../middlewares/catchAsyncError');
const Attribute = require('../model/attributeModel');

exports.addAttributes = catchAsyncError(async (req, res, next) => {
    try {
        const { name, value } = req.body;

        const attribute = await Attribute.create({
            name,
            value
        })

        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Attribute added successfully!",
            attribute
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

exports.getAllAttributes = catchAsyncError(async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const effectiveLimit = Math.max(parseInt(limit), 10);
        const skip = (page - 1) * effectiveLimit;

        const totalCount = await Attribute.countDocuments();
        const totalPages = Math.ceil(totalCount / effectiveLimit);

        const attribute = await Attribute.find()
            .skip(skip)
            .limit(effectiveLimit)
            .sort({ createdAt: -1 });

        const paginationInfo = {
            currentPage: parseInt(page),
            nextPage:page < totalPages ? parseInt(page) + 1 : null,
            prevPage: page > 1 ? parseInt(page) - 1 : null,
            totalPages,
            totalCount,
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "All Attributes",
            count: attribute.length,
            attribute,
            paginationInfo

        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


exports.getAttribute = catchAsyncError(async (req, res, next) => {
    try {
        const attribute = await Attribute.findById(req.params.id);

        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }

        res.status(200).json({
            statusCode: 200,
            success: true,
            attribute
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


exports.editAttribute = catchAsyncError(async (req, res, next) => {
    try {
        const attribute = await Attribute.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }

        await attribute.save();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Attribute updated successfully!',
            attribute
        })
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

exports.deleteAttribute = catchAsyncError(async (req, res, next) => {
    try {
        const attribute = await Attribute.findByIdAndDelete(req.params.id);
        if (!attribute) {
            return res.status(404).json({ message: 'Attribute not found' });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Attribute deleted successfully'
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})


exports.editAttributeValue = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { index, newValue } = req.body;

        if (typeof index !== 'number' || index < 0) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ success: false, message: 'Attribute not found' });
        }

        if (!Array.isArray(attribute.value) || index >= attribute.value.length) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        attribute.value[index] = newValue;
        await attribute.save();

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Attribute value updated successfully!',
            attribute
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

exports.deleteAttributeValue = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { index } = req.body;

        if (typeof index !== 'number' || index < 0) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ success: false, message: 'Attribute not found' });
        }

        if (!Array.isArray(attribute.value) || index >= attribute.value.length) {
            return res.status(400).json({ success: false, message: 'Invalid index' });
        }

        attribute.value.splice(index, 1);
        await attribute.save();

        res.status(200).json({
            success: true,
            message: 'Attribute value deleted successfully',
            attribute
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



exports.addAttributeValue = catchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { value } = req.body;

        if (!value || typeof value !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid value' });
        }

        const attribute = await Attribute.findById(id);

        if (!attribute) {
            return res.status(404).json({ success: false, message: 'Attribute not found' });
        }

        attribute.value.push(value);
        await attribute.save();

        res.status(200).json({
            success: true,
            message: 'Attribute value added successfully!',
            attribute,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
