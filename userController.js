const db = require('../db');
const jwt = require('jsonwebtoken');

// Get all users
const getAllUsers = (req, res) => {
  db.query('SELECT * FROM Users', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Register new user
const registerUser = (req, res) => {
  const { name, mobile, email, vehicle_no, password, role } = req.body;

  const query = 'INSERT INTO Users (name, mobile, email, vehicle_no, password, role) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [name, mobile, email, vehicle_no, password, role], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ error: 'User registration failed.' });
    }
    res.status(201).json({ message: 'User registered successfully!' });
  });
};

// Login user
const loginUser = (req, res) => {
  const { mobile, password } = req.body;

  const query = 'SELECT * FROM Users WHERE mobile = ? AND password = ?';
  db.query(query, [mobile, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = results[0];

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.id, mobile: user.mobile }, // payload
      'your-secret-key',                   // secret key (store in env in production)
      { expiresIn: '1h' }                  // token expiration
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, mobile: user.mobile }
    });
  });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser
};
