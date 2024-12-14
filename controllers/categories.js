const shortid = require('shortid');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const db = require('../db'); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const destinationPath = path.join(__dirname, '../CategoryImages');
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    cb(null, shortid.generate() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

// Create Category
exports.createCategory = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }

    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      const query = 'INSERT INTO categories (name, image) VALUES (?, ?)';
      const values = [name, image];
      const [result] = await db.query(query, values);

      res.status(201).json({
        message: 'Category created successfully',
        data: { id: result.insertId, name, image: image ? `/CategoryImages/${image}` : null },
      });
    } catch (dbError) {
      res.status(500).json({ message: 'Error creating category', error: dbError.message });
    }
  });
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const query = 'SELECT * FROM categories';
    const [result] = await db.query(query);
    res.status(200).json({ message: 'Categories fetched successfully', data: result });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching categories', error: err.message });
  }
};

// Get Category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM categories WHERE id = ?';
    const [result] = await db.query(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.status(200).json({ message: 'Category fetched successfully', data: result[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching category', error: err.message });
  }
};

// Update Category
exports.updateCategory = (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', error: err.message });
    }

    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      const query = 'SELECT * FROM categories WHERE id = ?';
      const [existingCategory] = await db.query(query, [id]);

      if (existingCategory.length === 0) {
        return res.status(404).json({ message: 'Category not found' });
      }

      if (existingCategory[0].image && image) {
        fs.unlink(path.join(__dirname, '../CategoryImages', existingCategory[0].image), (err) => {
          if (err) console.error('Error deleting old image:', err);
        });
      }

      const updateQuery = 'UPDATE categories SET name = ?, image = ? WHERE id = ?';
      const updateValues = [name, image || existingCategory[0].image, id];
      await db.query(updateQuery, updateValues);

      res.status(200).json({ message: 'Category updated successfully' });
    } catch (dbError) {
      res.status(500).json({ message: 'Error updating category', error: dbError.message });
    }
  });
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const selectQuery = 'SELECT * FROM categories WHERE id = ?';
    const [category] = await db.query(selectQuery, [id]);

    if (category.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category[0].image) {
      fs.unlink(path.join(__dirname, '../CategoryImages', category[0].image), (err) => {
        if (err) console.error('Error deleting image:', err);
      });
    }

    const deleteQuery = 'DELETE FROM categories WHERE id = ?';
    await db.query(deleteQuery, [id]);

    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting category', error: err.message });
  }
};
