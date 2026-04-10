const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        // 1. Setup Pagination Variables
        const pageSize = 10;

        // Math.max guarantees the page is at least 1, preventing negative offsets
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const offset = (page - 1) * pageSize;

        // 2. Query 1: Get Total Count (Needed for "Total Pages" calculation)
        const countRes = await pool.query('SELECT COUNT(*) FROM products');
        const totalRecords = parseInt(countRes.rows[0].count);
        const totalPages = Math.ceil(totalRecords / pageSize);

        // 3. Query 2: Get Products with Category Names (The JOIN)
        // use LIMIT and OFFSET for server-side pagination
        const productQuery = `
            SELECT p.id as "ProductId", p.name as "ProductName", 
                   c.name as "CategoryName", c.id as "CategoryId"
            FROM products p
            INNER JOIN categories c ON p.category_id = c.id
            ORDER BY p.id ASC
            LIMIT $1 OFFSET $2
        `;
        const products = await pool.query(productQuery, [pageSize, offset]);

        // 4. Query 3: Get all categories (Needed for the "Add Product" dropdown)
        const categories = await pool.query('SELECT * FROM categories');

        res.render('products', {
            products: products.rows,
            categories: categories.rows,
            currentPage: page,
            totalPages: totalPages
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// Add Product Route
router.post('/add', async (req, res) => {
    // Add trim() to clean up trailing/leading spaces
    const productName = req.body.productName.trim(); 
    const categoryId = req.body.categoryId;

    // Reject if it was just empty spaces
    if (!productName || !categoryId) {
        return res.status(400).send("Product name and category are required.");
    }

    try {
        await pool.query('INSERT INTO products (name, category_id) VALUES ($1, $2)', [productName, categoryId]);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error adding product");
    }
});

// DELETE: Remove a product
router.post('/delete/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = $1', [req.params.id]);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});

// GET: Show the edit form for a product
router.get('/edit/:id', async (req, res) => {
    try {
        const productRes = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
        if (productRes.rows.length === 0) return res.status(404).send("Product not found");

        const categoriesRes = await pool.query('SELECT * FROM categories');
        
        res.render('editProduct', { 
            product: productRes.rows[0], 
            categories: categoriesRes.rows 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// UPDATE: Save the product changes
router.post('/edit/:id', async (req, res) => {
    const productName = req.body.productName.trim(); 
    const categoryId = req.body.categoryId;

    // Reject if it was just empty spaces
    if (!productName || !categoryId) {
        return res.status(400).send("Product name and category are required.");
    }

    try {
        await pool.query('UPDATE products SET name = $1, category_id = $2 WHERE id = $3', 
            [productName, categoryId, req.params.id]);
        res.redirect('/products');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});

module.exports = router;