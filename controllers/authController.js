const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const adminModel = require('../models/adminModel');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_smartroad';

const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Cek apakah username ada di database
    const admin = await adminModel.getAdminByUsername(username);
    if (!admin) {
      return res.status(400).json({ success: false, message: 'Username atau password salah.' });
    }

    // 2. Verifikasi kecocokan password yang diinput dengan hash di database
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Username atau password salah.' });
    }

    const payload = {
  id: admin.id,
  username: admin.username,
  role: 'admin'
};

    // 3. Jika cocok, generate JWT Token
    const token =jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN || '1d'
});
    
    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token: token
    });

  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

module.exports = { loginAdmin };