const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
const path= require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Store user information in a local variable
let users = [];

// Handle GET request to render the login/signup page
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error loading page');
      return;
    }
    res.send(data);
  });
});

// Handle POST request for signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  users.push({ username, password });
  res.send('Signup successful!');
});

// Handle POST request for login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.send('Login successful!');
  } else {
    res.send('Invalid username or password!');
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server running on http://localhost:${port}");
});