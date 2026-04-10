const express = require('express');
const path = require('path');
require('dotenv').config();

// Import Routes
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// 1. SETTINGS: Tell Express to use EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 2. MIDDLEWARE: To handle data sent from HTML forms
app.use(express.urlencoded({ extended: true })); // Parses form data (req.body)
app.use(express.json()); // Parses JSON data
app.use(express.static(path.join(__dirname, 'public'))); // For CSS/Images

// 3. ROUTE REGISTRATION
app.use('/categories', categoryRoutes);
app.use('/products', productRoutes); 

// Redirect root to categories for convenience
app.get('/', (req, res) => res.redirect('/categories'));

// 4. START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});