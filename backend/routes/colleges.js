const express = require('express');
const { body } = require('express-validator');
const {
  getColleges,
  getCollege,
  createCollege,
  updateCollege,
  deleteCollege,
  getCollegeReviews
} = require('../controllers/collegeController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const createCollegeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('College name is required')
    .isLength({ max: 100 })
    .withMessage('College name cannot exceed 100 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('type')
    .optional()
    .isIn(['university', 'college', 'institute'])
    .withMessage('Type must be university, college, or institute'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

const updateCollegeValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('College name cannot be empty')
    .isLength({ max: 100 })
    .withMessage('College name cannot exceed 100 characters'),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('type')
    .optional()
    .isIn(['university', 'college', 'institute'])
    .withMessage('Type must be university, college, or institute'),
  body('website')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('phone')
    .optional()
    .matches(/^[\d\s\-\+\(\)]+$/)
    .withMessage('Please enter a valid phone number'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
];

// Public routes
router.get('/', getColleges);
router.get('/:id', getCollege);
router.get('/:id/reviews', getCollegeReviews);

// Admin routes
router.post('/', protect, authorize('admin'), createCollegeValidation, createCollege);
router.put('/:id', protect, authorize('admin'), updateCollegeValidation, updateCollege);
router.delete('/:id', protect, authorize('admin'), deleteCollege);

module.exports = router;
