const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { authenticateJWT } = require('../middleware/auth');

// Get reviews for a book
router.get('/:bookId', async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a review
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { bookId, review, rating } = req.body;
    const newReview = new Review({
      bookId,
      userId: req.user.userId,
      review,
      rating,
    });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Modify a review
router.put('/:reviewId', authenticateJWT, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    review.review = req.body.review || review.review;
    review.rating = req.body.rating || review.rating;
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a review
router.delete('/:reviewId', authenticateJWT, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
