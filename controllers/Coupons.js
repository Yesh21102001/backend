// // Controllers
// const db = require('../db'); // Assuming a db.js file for MySQL connection

// exports.createCoupon = async (req, res) => {
//   const { CouponName, UserId, CouponCode, OfferAmount, Discount, OfferAvailable, ExpiryDate } = req.body;
//   const query = `INSERT INTO Coupons (CouponName, UserId, CouponCode, OfferAmount, Discount, OfferAvailable, ExpiryDate) 
//                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
//   const values = [CouponName, UserId, CouponCode, OfferAmount, Discount, OfferAvailable, ExpiryDate];

//   try {
//     const [result] = await db.execute(query, values);
//     res.status(201).json({ message: 'Coupon created', id: result.insertId });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getAllCoupons = async (req, res) => {
//   const query = 'SELECT * FROM Coupons';

//   try {
//     const [rows] = await db.execute(query);
//     res.status(200).json(rows);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getCouponById = async (req, res) => {
//   const query = 'SELECT * FROM Coupons WHERE CouponID = ?';
//   const values = [req.params.id];

//   try {
//     const [rows] = await db.execute(query, values);
//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }
//     res.status(200).json(rows[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.updateCoupon = async (req, res) => {
//   const { CouponName, UserId, CouponCode, OfferAmount, Discount, OfferAvailable, ExpiryDate } = req.body;
//   const query = `UPDATE Coupons 
//                  SET CouponName = ?, UserId = ?, CouponCode = ?, OfferAmount = ?, Discount = ?, OfferAvailable = ?, ExpiryDate = ? 
//                  WHERE CouponID = ?`;
//   const values = [CouponName, UserId, CouponCode, OfferAmount, Discount, OfferAvailable, ExpiryDate, req.params.id];

//   try {
//     const [result] = await db.execute(query, values);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }
//     res.status(200).json({ message: 'Coupon updated successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.deleteCoupon = async (req, res) => {
//   const query = 'DELETE FROM Coupons WHERE CouponID = ?';
//   const values = [req.params.id];

//   try {
//     const [result] = await db.execute(query, values);
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Coupon not found' });
//     }
//     res.status(200).json({ message: 'Coupon deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };