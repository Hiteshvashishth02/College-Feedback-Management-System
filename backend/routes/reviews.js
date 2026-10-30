const express = require('express');
const { body } = require('express-validator');
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  getUserReviews
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const createReviewValidation = [
  body('college')
    .notEmpty()
    .withMessage('College ID is required')
    .isMongoId()
    .withMessage('Invalid college ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('pros')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Pros cannot exceed 500 characters'),
  body('cons')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cons cannot exceed 500 characters')
];

const updateReviewValidation = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Review title cannot be empty')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Review comment cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('pros')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Pros cannot exceed 500 characters'),
  body('cons')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Cons cannot exceed 500 characters')
];

// Protected routes
router.get('/user/me', protect, getUserReviews);
router.post('/', protect, createReviewValidation, createReview);
router.get('/:id', protect, getReview);
router.put('/:id', protect, updateReviewValidation, updateReview);
router.delete('/:id', protect, deleteReview);

// Admin routes
router.get('/', protect, authorize('admin'), getReviews);
router.put('/:id/approve', protect, authorize('admin'), approveReview);

module.exports = router;
