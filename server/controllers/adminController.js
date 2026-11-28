const Boarding = require('../models/Boarding');

// List boardings waiting for review
exports.getPendingBoardings = async (req, res) => {
  try {
    const boardings = await Boarding.find({ status: 'pending' })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(boardings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve a boarding
exports.approveBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', rejectionReason: '' },
      { new: true }
    );
    if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
    res.json(boarding);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
};

// Reject a boarding with a reason
exports.rejectBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: req.body.reason || 'Not specified' },
      { new: true }
    );
    if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
    res.json(boarding);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
};