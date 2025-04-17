const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',         // use your username
  password: 'admin@123', // replace with your MySQL password
  database: 'parking_system'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL Database ✅');
});

module.exports = db;
