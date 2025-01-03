const express = require('express');
const { Client } = require('pg');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;

// Setup PostgreSQL client
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'Testing',
  password: 'allworknoplay',
  port: 5432,
});

client.connect();

// Set up EJS templating
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Fetch book covers using Open Library API
const getBookCover = (bookId) => {
  return `https://covers.openlibrary.org/b/id/${bookId}-L.jpg`;
};

// Home route to display books
app.get('/books', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM books ORDER BY read_date DESC');
    res.render('index', { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching books');
  }
});

// Add a new book
app.post('/books', async (req, res) => {
  const { title, author, cover_url, review, rating, read_date } = req.body;
  try {
    await client.query(
      'INSERT INTO books (title, author, cover_url, review, rating, read_date) VALUES ($1, $2, $3, $4, $5, $6)',
      [title, author, cover_url, review, rating, read_date]
    );
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error adding book');
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  const { title, author, cover_url, review, rating, read_date } = req.body;
  try {
    await client.query(
      'UPDATE books SET title = $1, author = $2, cover_url = $3, review = $4, rating = $5, read_date = $6 WHERE id = $7',
      [title, author, cover_url, review, rating, read_date, req.params.id]
    );
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating book');
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    await client.query('DELETE FROM books WHERE id = $1', [req.params.id]);
    res.redirect('/books');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting book');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
