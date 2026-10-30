const Review = require('../models/Review');
const College = require('../models/College');
const { validationResult } = require('express-validator');

// @desc    Get all reviews (admin only)
// @route   GET /api/reviews
// @access  Private/Admin
exports.getReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const college = req.query.college || '';
    const user = req.query.user || '';
    const isApproved = req.query.approved;

    // Build query
    let query = {};

    if (college) {
      query.college = college;
    }

    if (user) {
      query.user = user;
    }

    if (isApproved !== undefined) {
      query.isApproved = isApproved === 'true';
    }

    const reviews = await Review.find(query)
      .populate('user', 'name email')
      .populate('college', 'name')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Review.countDocuments(query);

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

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Private
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name avatar email')
      .populate('college', 'name location');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is admin or the review owner
    if (req.user.role !== 'admin' && review.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this review'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { college, rating, title, comment, pros, cons } = req.body;

    // Check if college exists
    const collegeExists = await College.findById(college);
    if (!collegeExists) {
      return res.status(404).json({
        success: false,
        message: 'College not found'
      });
    }

    // Check if user has already reviewed this college
    const existingReview = await Review.findOne({ 
      user: req.user.id, 
      college: college 
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this college'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      college,
      rating,
      title,
      comment,
      pros,
      cons
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'name avatar')
      .populate('college', 'name');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is admin or the review owner
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('user', 'name avatar')
      .populate('college', 'name');

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user is admin or the review owner
    if (req.user.role !== 'admin' && review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Disapprove review (admin only)
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
exports.approveReview = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('college', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/user/me
// @access  Private
exports.getUserReviews = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user.id })
      .populate('college', 'name location averageRating')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    const total = await Review.countDocuments({ user: req.user.id });

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
