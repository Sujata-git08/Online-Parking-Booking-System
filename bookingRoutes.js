const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Get all parking areas
router.get('/areas', bookingController.getAllAreas);

// Get available slots for a selected area
router.get('/slots/:areaId', bookingController.getAvailableSlots);

// Book a slot
router.post('/book', bookingController.bookSlot);

module.exports = router;

const parkingAreas = [
  { id: 1, name: 'Area A' },
  { id: 2, name: 'Area B' },
  { id: 3, name: 'Area C' },
  { id: 4, name: 'Area D' }
];

// GET /areas - list all parking areas
router.get('/areas', (req, res) => {
  res.json(parkingAreas);
});

module.exports = router;
