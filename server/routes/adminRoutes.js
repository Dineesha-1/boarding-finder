const express = require('express');
const router = express.Router();
const {
  getPendingBoardings,
  approveBoarding,
  rejectBoarding,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Every admin route needs login + the admin role
router.use(protect, authorize('admin'));

router.get('/boardings/pending', getPendingBoardings);
router.patch('/boardings/:id/approve', approveBoarding);
router.patch('/boardings/:id/reject', rejectBoarding);

module.exports = router;