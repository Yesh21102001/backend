// routes/couponRoutes.js
const express = require('express');
const { createCoupon, getAllCoupons, getCouponById, updateCoupon, deleteCoupon } = require('../controllers/Coupons');
const router = express.Router();

// Route to create a coupon
router.post('/createCoupon', createCoupon);
router.get('/getAllCoupons', getAllCoupons);
router.get('/getCouponById/:CouponID', getCouponById);
router.put('/updateCoupon/:CouponID', updateCoupon);
router.delete('/deleteCoupon/:CouponID', deleteCoupon);

module.exports = router;