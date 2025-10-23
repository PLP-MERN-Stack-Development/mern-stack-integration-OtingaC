const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect } = require('../middleware/auth');
const { categoryValidator } = require('../validators/postValidator');

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/categories/:id
// @desc    Get single category
// @access  Public
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

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
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

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
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

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
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