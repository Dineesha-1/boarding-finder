const express = require('express');
const router = express.Router();
const {
  createBoarding,
  getBoardings,
  getBoardingById,
  getMyBoardings,
  updateBoarding,
  deleteBoarding,
} = require('../controllers/boardingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public: anyone can browse approved boardings
router.get('/', getBoardings);

// Owner: see my own boardings (must be above '/:id', or "mine" is read as an id)
router.get('/mine', protect, authorize('owner'), getMyBoardings);

// Public: one boarding's details
router.get('/:id', getBoardingById);

// Owner only: create, edit
router.post('/', protect, authorize('owner'), createBoarding);
router.put('/:id', protect, authorize('owner'), updateBoarding);

// Owner (own boarding) or admin: delete
router.delete('/:id', protect, authorize('owner', 'admin'), deleteBoarding);

module.exports = router;