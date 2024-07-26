const express = require('express');
const path = require('path');
const connectDB = require('./db');

const app = express();

// Conectar a MongoDB Atlas
connectDB();

app.use(express.static(path.join(__dirname, 'auth-front/build')));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'auth-front/build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
