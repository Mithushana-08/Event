const pool = require('../config/db');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const cleanUsername = username.trim().toLowerCase();
  console.log('Login attempt:', { username, password, cleanUsername });

  // Debug: print all admins in the table
  const [allAdmins] = await pool.query('SELECT * FROM admins');
  console.log('All admins in DB:', allAdmins);
  const user = [].concat(allAdmins).find(admin => admin.username.trim().toLowerCase() === cleanUsername);
  if (!user) {
    console.log('No user found for username:', cleanUsername);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  console.log('DB user:', user);
  // Plain text password check (NOT recommended for production)
  if (password !== user.password) {
    console.log('Password mismatch:', { input: password, db: user.password });
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};