const express = require('express');
const router = express.Router();

const reportController = require('../controllers/reportController');
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const verifyToken = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

// Publik
router.get('/reports', reportController.getReportsAPI);
router.post('/reports', uploadMiddleware.single('foto'), reportController.createReportAPI);

// Admin
router.put('/reports/:id/status', verifyToken, reportController.updateStatusAPI);
router.delete('/reports/:id', verifyToken, reportController.deleteReportAPI);


// Login admin
router.post('/login', authController.loginAdmin);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const reportController = require('../controllers/reportController');
// const uploadMiddleware = require('../middlewares/uploadMiddleware');
// const verifyToken = require('../middlewares/authMiddleware');
// const authController = require('../controllers/authController');
// // Endpoint API
// router.get('/reports', reportController.getReportsAPI);
// router.post('/reports', uploadMiddleware.single('foto'), reportController.createReportAPI);
// router.put('/reports/:id/status', reportController.updateStatusAPI);
// router.post('/login', authController.loginAdmin);


// module.exports = router;