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
const upload = require('../middleware/upload');
const Boarding = require('../models/Boarding');

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

// Owner: upload up to 5 photos for one of their own boardings
router.post(
  '/:id/images',
  protect,
  authorize('owner'),
  upload.array('images', 5),
  async (req, res) => {
    try {
      const boarding = await Boarding.findById(req.params.id);
      if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
      if (boarding.owner.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not your boarding' });
      }
      // Save the web paths of the uploaded files
      const paths = req.files.map((f) => `/uploads/${f.filename}`);
      boarding.images.push(...paths);
      await boarding.save();
      res.json(boarding);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);
module.exports = router;