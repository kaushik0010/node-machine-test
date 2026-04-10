# Inventory Management System - Node.js Machine Test

A robust, Multi-Page Application (MPA) built to demonstrate server-side rendering, RESTful routing, and advanced RDBMS data modeling. This project implements a complete Category and Product Master with relational integrity and server-side pagination.

## Demo Video
[screen-capture (3).webm](https://github.com/user-attachments/assets/e9a50f21-8dc2-485c-990b-039adf4943fd)


## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Hosted on Neon.tech), `pg` (Node Postgres)
* **View Engine:** EJS (Embedded JavaScript)
* **Styling:** Bootstrap 5 (via CDN)

## ✨ Key Features & Technical Highlights

* **Complete CRUD Operations:** Full Create, Read, Update, and Delete capabilities for both Categories and Products.
* **Relational Database Design:** Utilizes Primary/Foreign Key relationships (`category_id`) with `ON DELETE CASCADE` to maintain data integrity.
* **Server-Side Pagination:** Implemented using SQL `LIMIT` and `OFFSET`, ensuring only the requested subset of data is fetched from the database, preventing memory overload on large datasets.
* **SQL Joins:** The Product view leverages `INNER JOIN` queries to efficiently attach the associated `CategoryName` directly at the database layer.
* **Edge Case Mitigation:**
    * **Data Integrity:** Implemented a `UNIQUE` constraint on Category names to prevent duplicate entries at the database level.
    * **Input Sanitization:** Uses `.trim()` on server routes to prevent users from bypassing validation using blank spaces.
    * **Pagination Guarding:** Added mathematical boundaries (`Math.max()`) to ensure URL manipulation (e.g., `?page=-1`) does not crash the database query.

## 🛠️ Local Setup & Installation

**1. Clone the repository**
```bash
git clone https://github.com/kaushik0010/node-machine-test.git
cd node-machine-test
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**:

Create a .env file in the root directory and add your PostgreSQL connection string (Neon/Supabase recommended).

```bash
DATABASE_URL=postgresql://user:password@hostname/dbname?sslmode=require
PORT=3000
```

**4. Initialize the Database Schema**:

Run the built-in seed script. This automatically connects to your database, builds the categories and products tables, and enforces the schema rules.

```bash
npm run init-db
```

**5. Start the Server**
```bash
npm start
# OR for development: npm run dev
```

**6. Access the Application**:

Open your browser and navigate to http://localhost:3000.


## 🗄️ Database Schema Summary
**Categories Table**

- id (SERIAL PRIMARY KEY)
- name (VARCHAR 255, UNIQUE, NOT NULL)

**Products Table**

- id (SERIAL PRIMARY KEY)
- name (VARCHAR 255, NOT NULL)
- category_id (INTEGER, FOREIGN KEY references Categories, ON DELETE CASCADE)

---

Developed by Kaushik.
