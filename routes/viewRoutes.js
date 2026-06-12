const express = require('express');
const router = express.Router();
const path = require('path');

// Route untuk Dashboard Utama
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/landing.html'));
});

router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Route untuk Halaman Lapor (Diubah menjadi /SmartRoad)
router.get('/SmartRoad', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/smartroad.html'));
});

router.get('/kelola', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/kelola.html'));
});

// Halaman Login Admin
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

// Tambahkan ini di bawah rute /kelola yang sudah ada
router.get('/laporan', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/laporan.html'));
});

router.get('/webgis', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/webgis.html'));
});

module.exports = router;