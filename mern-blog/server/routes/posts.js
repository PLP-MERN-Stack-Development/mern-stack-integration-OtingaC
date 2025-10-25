const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { postValidator } = require('../validators/postValidator');
const fs = require('fs');
const path = require('path');

// GET all posts with pagination, search, and filter
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    
    // Search by title or content
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { content: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Get total count for pagination
    const total = await Post.countDocuments(query);

    // Get posts
    const posts = await Post.find(query)
      .populate('author', 'username email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    next(error);
  }
});

// GET post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email')
      .populate('category', 'name description');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST - Create a new post
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    // Validate input
    const { error } = postValidator(req.body);
    if (error) {
      // Delete uploaded file if validation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, content, category } = req.body;

    // Create post
    const post = await Post.create({
      title,
      content,
      category,
      author: req.user._id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    const populatedPost = await Post.findById(post._id)
      .populate('author', 'username email')
      .populate('category', 'name');

    res.status(201).json(populatedPost);
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// PUT - Update a post
router.put('/:id', protect, upload.single('image'), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Validate input
    const { error } = postValidator(req.body);
    if (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({ message: error.details[0].message });
    }

    // Delete old image if new one is uploaded
    if (req.file && post.image) {
      const oldImagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Update post
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;
    if (req.file) {
      post.image = `/uploads/${req.file.filename}`;
    }

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id)
      .populate('author', 'username email')
      .populate('category', 'name');

    res.json(populatedPost);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
});

// DELETE post
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete image if exists
    if (post.image) {
      const imagePath = path.join(__dirname, '..', post.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;