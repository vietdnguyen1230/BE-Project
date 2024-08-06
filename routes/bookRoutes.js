const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get book by ISBN
router.get('/isbn/:isbn', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get books by author
router.get('/author/:author', async (req, res) => {
  try {
    const books = await Book.find({ author: req.params.author });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get books by title
router.get('/title/:title', async (req, res) => {
  try {
    const books = await Book.find({ title: req.params.title });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
    const { title, author, isbn } = req.body;
    const book = new Book({ title, author, isbn });
    try {
      await book.save();
      res.status(201).send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  });

module.exports = router;
