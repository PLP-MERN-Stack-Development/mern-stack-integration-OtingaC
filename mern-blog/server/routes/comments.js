const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth');
const { commentValidator } = require('../validators/commentValidator');

// GET all comments for a post
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    next(error);
  }
});

// POST - Create a new comment
router.post('/', protect, async (req, res, next) => {
  try {
    // Validate input
    const { error } = commentValidator(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { post, content } = req.body;

    // Check if post exists
    const postExists = await Post.findById(post);
    if (!postExists) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      post,
      author: req.user._id,
      content
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'username');

    res.status(201).json(populatedComment);
  } catch (error) {
    next(error);
  }
});

// PUT - Update a comment
router.put('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = req.body.content || comment.content;

    const updatedComment = await comment.save();

    const populatedComment = await Comment.findById(updatedComment._id)
      .populate('author', 'username');

    res.json(populatedComment);
  } catch (error) {
    next(error);
  }
});

// DELETE comment
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;