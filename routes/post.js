const express = require('express');
const BlogPost = require('../models/blogpost');
const authenticate = require('../middleware/authmiddleware');
const router = express.Router();

// Create a blog post
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = new BlogPost({ title, content, author: req.user._id });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'username email');
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

module.exports = router;