const express = require('express');
const router = express.Router();
const pool = require('../db'); // Our database connection

// 1. READ: Display all categories
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
        res.render('categories', { categories: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});

// 2. CREATE: Add a new category
router.post('/add', async (req, res) => {
    const categoryName = req.body.categoryName.trim();
    
    // Prevent empty strings from passing
    if (!categoryName) return res.status(400).send("Category name cannot be empty.");

    try {
        await pool.query('INSERT INTO categories (name) VALUES ($1)', [categoryName]);
        res.redirect('/categories'); // Refresh the page to show new data
    } catch (err) {
        // Postgres error code for unique violation
        if (err.code === '23505') { 
            return res.status(400).send("Error: A category with this name already exists. Please go back and try again.");
        }
        console.error(err);
        res.status(500).send("Error adding category");
    }
});

// 3. DELETE: Remove a category
// We use POST here because plain HTML forms don't support DELETE methods easily
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM categories WHERE id = $1', [id]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting category");
    }
});

// 4. GET: Show the edit form for a specific category
router.get('/edit/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM categories WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).send("Category not found");
        
        res.render('editCategory', { category: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send("Database Error");
    }
});

// 5. UPDATE: Save the changes to the database
router.post('/edit/:id', async (req, res) => {
    const categoryName = req.body.categoryName.trim();
    
    // Prevent empty strings from passing
    if (!categoryName) return res.status(400).send("Category name cannot be empty.");
    
    try {
        await pool.query('UPDATE categories SET name = $1 WHERE id = $2', [categoryName, req.params.id]);
        res.redirect('/categories');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating category");
    }
});

module.exports = router;