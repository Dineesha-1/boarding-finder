const Boarding = require('../models/Boarding');

// CREATE: an owner adds a new boarding (status starts as pending)
exports.createBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.create({
      ...req.body,
      owner: req.user.id,
      status: 'pending',
    });
    res.status(201).json(boarding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// READ: list approved boardings with search, filters, sorting and pagination
exports.getBoardings = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, gender, rooms, facilities, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    // Students only see approved boardings
    const filter = { status: 'approved' };

    if (search) {
      const regex = new RegExp(search, 'i'); // case-insensitive
      filter.$or = [{ title: regex }, { address: regex }, { description: regex }];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (gender) filter.gender = gender;
    if (rooms) filter.rooms = { $gte: Number(rooms) };
    if (facilities) filter.facilities = { $all: facilities.split(',') };

    const sortOptions = {
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      newest: { createdAt: -1 },
    };

    const total = await Boarding.countDocuments(filter);
    const boardings = await Boarding.find(filter)
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ boardings, page, pages: Math.ceil(total / limit), total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ: one boarding by id
exports.getBoardingById = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id).populate('owner', 'name phone email');
    if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
    res.json(boarding);
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
};

// READ: the logged-in owner's own boardings (all statuses)
exports.getMyBoardings = async (req, res) => {
  try {
    const boardings = await Boarding.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(boardings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE: only the owner of the boarding can edit it
exports.updateBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
    if (boarding.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not your boarding' });
    }

    // Owners cannot change the status themselves
    const { status, rejectionReason, owner, ...updates } = req.body;
    Object.assign(boarding, updates);
    // An edited listing goes back to pending for a new review
    boarding.status = 'pending';
    await boarding.save();
    res.json(boarding);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE: the owner of the boarding, or an admin
exports.deleteBoarding = async (req, res) => {
  try {
    const boarding = await Boarding.findById(req.params.id);
    if (!boarding) return res.status(404).json({ message: 'Boarding not found' });
    if (boarding.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await boarding.deleteOne();
    res.json({ message: 'Boarding deleted' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
};