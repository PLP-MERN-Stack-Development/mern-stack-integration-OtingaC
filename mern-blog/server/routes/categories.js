const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const { categoryValidator } = require('../validators/postValidator');

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// Get single category
router.get('/:id', async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    next(error);
  }
});

// POST - Create new category
router.post('/', protect, async (req, res, next) => {
  try {
    // Validate input
    const { error } = categoryValidator(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, description } = req.body;

    // Check if category exists
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description
    });

    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
});

// PUT - Update a category
router.put('/:id', protect, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Validate input
    const { error } = categoryValidator(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description || category.description;

    const updatedCategory = await category.save();

    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE a category
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.deleteOne();

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;