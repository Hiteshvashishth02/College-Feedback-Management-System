const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getDashboardStats,
  toggleUserStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are admin-only and protected
router.use(protect);
router.use(authorize('admin'));

// Dashboard and stats
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/toggle-status', toggleUserStatus);

module.exports = router;
