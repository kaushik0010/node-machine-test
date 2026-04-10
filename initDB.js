// initDB.js
const pool = require('./db');

const initQuery = `
  -- 1. Category Master Table
  CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY, -- SERIAL is like Auto-increment in SQL
      name VARCHAR(255) UNIQUE NOT NULL
  );

  -- 2. Product Master Table
  CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      -- Foreign Key: Links product to a category
      -- ON DELETE CASCADE: If a category is deleted, all its products are deleted too.
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE
  );

  -- 3. Seed Data: Insert only if the table is empty
  INSERT INTO categories (name) 
  SELECT 'Electronics' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Electronics');
  
  INSERT INTO categories (name) 
  SELECT 'Clothing' WHERE NOT EXISTS (SELECT 1 FROM categories WHERE name = 'Clothing');
`;

const setupDatabase = async () => {
    try {
        console.log("⏳ Initializing database...");
        await pool.query(initQuery);
        console.log("✅ Database schema created/verified.");
        process.exit(0); // Exit script successfully
    } catch (err) {
        console.error("❌ Database Init Error:", err);
        process.exit(1); // Exit with error
    }
};

setupDatabase();