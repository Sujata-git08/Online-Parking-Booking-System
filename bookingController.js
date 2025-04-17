const db = require('../db');

// Get all parking areas
exports.getAllAreas = (req, res) => {
    db.query('SELECT * FROM ParkingAreas', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
};

// Get available slots by areaId
exports.getAvailableSlots = (req, res) => {
    const { areaId } = req.params;
    db.query(
        'SELECT * FROM ParkingSlots WHERE area_id = ? AND status = "available"',
        [areaId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

// Book a slot
exports.bookSlot = (req, res) => {
    const { user_id, slot_id, vehicle_type, entry_time, exit_time, pricing_plan, total_amount } = req.body;

    // Update slot status
    db.query('UPDATE ParkingSlots SET status = "booked" WHERE id = ?', [slot_id], (err, result1) => {
        if (err) return res.status(500).json({ error: err });

        // Create booking
        db.query(
            `INSERT INTO Bookings 
            (user_id, slot_id, vehicle_type, entry_time, exit_time, pricing_plan, total_amount)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user_id, slot_id, vehicle_type, entry_time, exit_time, pricing_plan, total_amount],
            (err, result2) => {
                if (err) return res.status(500).json({ error: err });
                res.json({ message: 'Slot booked successfully!' });
            }
        );
    });
};
