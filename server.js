const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose(); // <-- 1. Import SQLite
const app = express();
const PORT = 3000;

// Middleware configurations
app.use(cors());
app.use(express.json());

// 📦 2. Initialize Database Connection (Creates a file named portfolio.db on your hard drive)
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("🗄️ Connected securely to the SQLite Database file.");
    }
});

// 🛠️ 3. Create Messages Table if it doesn't exist yet (Database Schema)
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    receivedAt TEXT NOT NULL
)`);


// 📡 REQUIREMENT 1: GET Endpoint (Reads data directly from the Database file)
app.get('/api/messages', (req, res) => {
    const sqlQuery = "SELECT * FROM messages ORDER BY id DESC";
    
    db.all(sqlQuery, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Failed to fetch database records." });
        }
        res.status(200).json(rows); // Sends the real database rows back to the frontend
    });
});


// 📡 REQUIREMENT 2: POST Endpoint (Inserts incoming user input directly into the Database)
app.post('/api/messages', (req, res) => {
    const { name, email, message } = req.body;

    // 🛡️ Data Validation Guard
    if (!name || !email || !message) {
        return res.status(400).json({ error: "Validation failed. Name, email, and message are all required!" });
    }

    const timestamp = new Date().toISOString();
    const sqlInsert = "INSERT INTO messages (name, email, message, receivedAt) VALUES (?, ?, ?, ?)";
    const values = [name, email, message, timestamp];

    // Run the SQL command execution
    db.run(sqlInsert, values, function (err) {
        if (err) {
            console.error("❌ SQL Insert Error:", err.message);
            return res.status(500).json({ error: "Failed to save message to the database vault." });
        }

        // Log the success live into your VS Code terminal console
        console.log(`📬 New Database Entry Created! ID: ${this.lastID}`);
        
        // 🌟 THE FIX: Added 'return' to cleanly cut off execution and protect the response stream
        return res.status(201).json({ 
            success: true, 
            message: "Your message was permanently saved to the database vault! 🚀",
            id: this.lastID 
        });
    });
});

// Root check route
app.get('/', (req, res) => {
    res.send('Welcome to the DecodeLabs Week 3 Database Engine! 🗄️🚀');
});


// 📡 REQUIREMENT 3: DELETE Endpoint (Removes a specific message by its ID vault number)
app.delete('/api/messages/:id', (req, res) => {
    const messageId = req.params.id;
    const sqlDelete = "DELETE FROM messages WHERE id = ?";

    db.run(sqlDelete, messageId, function (err) {
        if (err) {
            console.error("❌ SQL Delete Error:", err.message);
            return res.status(500).json({ error: "Failed to erase record from database storage." });
        }
        
        if (this.changes === 0) {
            return res.status(404).json({ error: "Message ID not found in database records." });
        }

        console.log(`🗑️ Database Entry Cleared! ID: ${messageId}`);
        res.status(200).json({ 
            success: true, 
            message: `Message with ID ${messageId} was permanently deleted from the vault! 🧹` 
        });
    });
});


// 📡 REQUIREMENT 4: UPDATE Endpoint (Allows editing a message entry if needed)
app.put('/api/messages/:id', (req, res) => {
    const messageId = req.params.id;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Please provide the updated message text." });
    }

    const sqlUpdate = "UPDATE messages SET message = ? WHERE id = ?";
    
    db.run(sqlUpdate, [message, messageId], function (err) {
        if (err) {
            console.error("❌ SQL Update Error:", err.message);
            return res.status(500).json({ error: "Failed to update database record." });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "Message ID not found." });
        }

        console.log(`📝 Database Entry Updated! ID: ${messageId}`);
        res.status(200).json({ success: true, message: "Message text updated securely!" });
    });
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});