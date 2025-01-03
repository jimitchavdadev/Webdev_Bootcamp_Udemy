const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const postsFilePath = './posts.json';

// Helper function to load posts
// Helper function to load posts
const loadPosts = () => {
  if (!fs.existsSync(postsFilePath)) {
    fs.writeFileSync(postsFilePath, JSON.stringify([])); // Create an empty array if file doesn't exist
  }

  try {
    return JSON.parse(fs.readFileSync(postsFilePath)); // Try to parse the JSON content
  } catch (err) {
    console.error("Error parsing posts.json:", err);
    return []; // Return an empty array if there's an error (e.g., malformed JSON)
  }
};


// Home Route - Display all posts
app.get('/', (req, res) => {
  const posts = loadPosts();
  res.render('index', { posts });
});

// Create Route - Show form to create a post
app.get('/create', (req, res) => {
  res.render('create');
});

// Create Post Route - Handle form submission
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  const posts = loadPosts();
  posts.push({ id: Date.now(), title, content });
  fs.writeFileSync(postsFilePath, JSON.stringify(posts));
  res.redirect('/');
});

// Edit Route - Show form to edit a post
app.get('/edit/:id', (req, res) => {
  const postId = req.params.id;
  const posts = loadPosts();
  const post = posts.find(p => p.id == postId);
  res.render('edit', { post });
});

// Edit Post Route - Handle form submission
app.post('/edit/:id', (req, res) => {
  const postId = req.params.id;
  const { title, content } = req.body;
  const posts = loadPosts();
  const postIndex = posts.findIndex(p => p.id == postId);
  if (postIndex !== -1) {
    posts[postIndex] = { id: postId, title, content };
    fs.writeFileSync(postsFilePath, JSON.stringify(posts));
  }
  res.redirect('/');
});

// Delete Route - Handle post deletion
app.get('/delete/:id', (req, res) => {
  const postId = req.params.id;
  let posts = loadPosts();
  posts = posts.filter(p => p.id != postId);
  fs.writeFileSync(postsFilePath, JSON.stringify(posts));
  res.redirect('/');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
