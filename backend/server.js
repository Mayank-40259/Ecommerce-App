const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());

// Database Connection Pool
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Mayank@BCA', 
    database: 'naya_ecommerce_db',
    waitForConnections: true,
    connectionLimit: 10
}).promise();

// 1. API: Get All Products
app.get('/api/products', async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. API: Register New User
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Saari fields bharna zaroori hai!' });
        }
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Email pehle se registered hai!' });
        }
        await db.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
            [name, email, password]
        );
        res.status(201).json({ message: 'Registration safal raha! Ab login karein.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. API: Login User
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ? AND password_hash = ?', [email, password]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Galti Email ya Password!' });
        }
        const activeUser = users[0]; // Pehla user nikala
        res.json({ 
            message: `Welcome back, ${activeUser.name}!`, 
            user: { id: activeUser.id, name: activeUser.name, email: activeUser.email } 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// 4. API: Place Real Order inside MySQL (Safe Mode Enabled)
app.post('/api/orders/place', async (req, res) => {
    const { user_id, total_amount, cartItems } = req.body;
    try {
        if (!total_amount || !cartItems || cartItems.length === 0) {
            return res.status(400).json({ message: 'Order place karne ke liye data adhoora hai!' });
        }

        // सेफ्टी चेक: अगर user_id गायब या खराब है, तो उसे डिफॉल्ट 1 मान लें
        const safeUserId = user_id && !isNaN(user_id) ? user_id : 1;

        // 1. Parent orders table mein entry
        const [orderResult] = await db.execute(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [safeUserId, total_amount, 'Pending']
        );
        const newOrderId = orderResult.insertId;

        // 2. Loop chalakar saare items order_items table mein entry
        for (let item of cartItems) {
            await db.execute(
                'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
                [newOrderId, item.id, item.qty, item.price]
            );
        }

        res.status(201).json({ message: `Order #NT${newOrderId} successfully database mein save ho gaya hai! 🎉` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server chalu hai port ${PORT} par`));

