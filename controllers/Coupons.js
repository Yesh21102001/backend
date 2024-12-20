const db = require('../db');  

// create a coupon
const createCoupon = (req, res) => {
    const { CouponName, OfferAmount, Discount, OfferAvailable, ExpiryDate } = req.body;

    const query = `
    INSERT INTO coupons (CouponName, OfferAmount, Discount, OfferAvailable, ExpiryDate)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.execute(query, [CouponName, OfferAmount, Discount, OfferAvailable, ExpiryDate], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error inserting coupon', error: err });
        }
        res.status(201).json({
            message: 'Coupon created successfully',
            couponId: result.insertId
        });
    });
};

// to get all coupons
const getAllCoupons = async (req, res) => {
    const query = 'SELECT * FROM coupons';

    try {
        const [result] = await db.execute(query);
        res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching coupons', error: err });
    }
};

// to get a single coupon by ID
const getCouponById = async (req, res) => {
    const couponId = req.params.CouponID; // Match the parameter name

    if (!couponId) {
        return res.status(400).json({ message: 'Coupon ID is required' });
    }

    const query = 'SELECT * FROM coupons WHERE CouponID = ?';

    try {
        const [result] = await db.execute(query, [couponId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        return res.status(500).json({ message: 'Error fetching coupon', error: err });
    }
};

// update a coupon
const updateCoupon = (req, res) => {
    const couponId = req.params.CouponID;
    const { CouponName, OfferAmount, Discount, OfferAvailable, ExpiryDate } = req.body;

    // Validate required fields
    if (!CouponName || !OfferAmount || !Discount || !OfferAvailable || !ExpiryDate) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const query = `
      UPDATE coupons 
      SET CouponName = ?, OfferAmount = ?, Discount = ?, OfferAvailable = ?, ExpiryDate = ?
      WHERE CouponID = ?
    `;
    // Execute query
    db.execute(query, [CouponName, OfferAmount, Discount, OfferAvailable, ExpiryDate, couponId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error updating coupon', error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Coupon not found' });
        }
        res.status(200).json({ message: 'Coupon updated successfully' });
    });
};

//Delete Coupon
const deleteCoupon = (req, res) => {
    const couponId = req.params.CouponID;
  
    if (couponId === undefined) {
      return res.status(400).json({ message: 'Coupon ID is required' });
    }
  
    const query = 'DELETE FROM coupons WHERE CouponID = ?';
  
    db.execute(query, [couponId], (err, result) => {
      if (err) {
        console.error('Error deleting coupon:', err);
        return res.status(500).json({ message: 'Error deleting coupon', error: err });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      res.status(200).json({ message: 'Coupon deleted successfully' });
    });
  };
  

module.exports = {
    createCoupon,
    getAllCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon
};