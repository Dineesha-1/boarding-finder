const mongoose = require('mongoose');

const boardingSchema = new mongoose.Schema(
  {
    // The owner who created this listing (links to the User model)
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    address: { type: String, required: true },
    gender: { type: String, enum: ['boys', 'girls', 'any'], default: 'any' },
    rooms: { type: Number, default: 1 },
    // List of facilities, e.g. ['WiFi', 'Meals', 'Fan']
    facilities: [String],
    // Is there still a room available?
    isAvailable: { type: Boolean, default: true },
    // Distance to the university in km
    distanceToUni: Number,
    // Photo links (added later in the image upload step)
    images: [String],
    // New listings wait for the admin to approve them
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    // Filled by the admin when a listing is rejected
    rejectionReason: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Boarding', boardingSchema);