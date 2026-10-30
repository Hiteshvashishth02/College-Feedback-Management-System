const College = require('../models/College');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// @desc    Get all colleges with pagination and search
// @route   GET /api/colleges
// @access  Public
exports.getColleges = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const search = req.query.search || '';
    const type = req.query.type || '';

    // Build query
    let query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    // Execute query with pagination
    const colleges = await College.find(query)
      .sort({ averageRating: -1, name: 1 })
      .skip(startIndex)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination
    const total = await College.countDocuments(query);

    res.status(200).json({
      success: true,
      count: colleges.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: colleges
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single college by ID
// @route   GET /api/colleges/:id
// @access  Public
exports.getCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new college
// @route   POST /api/colleges
// @access  Private/Admin
exports.createCollege = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const college = await College.create(req.body);

    res.status(201).json({
      success: true,
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update college
// @route   PUT /api/colleges/:id
// @access  Private/Admin
exports.updateCollege = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const college = await College.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    res.status(200).json({
      success: true,
      data: college
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete college
// @route   DELETE /api/colleges/:id
// @access  Private/Admin
exports.deleteCollege = async (req, res, next) => {
  try {
    const college = await College.findById(req.params.id);

    if (!college) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Soft delete by setting isActive to false
    college.isActive = false;
    await college.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get college reviews
// @route   GET /api/colleges/:id/reviews
// @access  Public
exports.getCollegeReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ 
      college: req.params.id, 
      isApproved: true 
    })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Review.countDocuments({ 
      college: req.params.id, 
      isApproved: true 
    });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit)
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};
