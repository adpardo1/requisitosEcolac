const express = require('express');
const path = require('path');
const connectDB = require('./db');

const app = express();

// Conectar a MongoDB Atlas
connectDB();

// Servir archivos estáticos desde el directorio 'dist'
app.use(express.static(path.join(__dirname, 'auth-front/dist')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'auth-front/dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
