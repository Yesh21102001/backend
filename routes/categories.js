const express = require('express');
const { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categories');
const router = express.Router();

// Routes
router.post('/createCategory', createCategory);
router.get('/getCategories', getCategories);
router.get('/getCategoryById/:id', getCategoryById);
router.put('/updateCategory/:id', updateCategory);
router.delete('/deleteCategory/:id', deleteCategory);

module.exports = router;