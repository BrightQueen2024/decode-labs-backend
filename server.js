require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI) {
    mongoose.connect(MONGO_URI)
        .then(() => console.log('🚀 Successfully connected to MongoDB Atlas Cloud Database!'))
        .catch(err => console.error('❌ Database Connection Failure:', err.message));
} else {
    console.warn('⚠️ Notice: MONGO_URI is not set in environment. Running with in-memory storage fallback.');
}

// 📝 Schema Configuration Rule
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, 
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
const memoryMessages = [];

// 🌐 Parse JSON Payloads
app.use(express.json());

// 📁 CORRECT PATHING: Serves all static files out of your /public directory
app.use(express.static(path.join(__dirname, 'public')));

// 📤 API Route: Push form records
app.post('/api/messages', async (req, res) => {
    // 🌟 FALLBACK WORKAROUND: Pulls either 'role' OR 'message' fields dynamically
    const name = req.body.name;
    const email = req.body.email;
    const role = req.body.role || req.body.message; 
    
    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and message details are required.' });
    }

    try {
        if (MONGO_URI && mongoose.connection.readyState === 1) {
            const newMessage = new Message({ name, email, role });
            await newMessage.save();
            return res.status(201).json(newMessage);
        } else {
            const record = { id: Date.now().toString(), name, email, role, createdAt: new Date() };
            memoryMessages.push(record);
            console.log('📥 Advisory RFP Recorded (In-Memory):', record);
            return res.status(201).json(record);
        }
    } catch (error) {
        console.error('❌ Failed to write message record:', error);
        res.status(500).json({ error: 'Failed to write message record.' });
    }
});

// 🏠 BULLETPROOF FALLBACK ROUTE: Express v5 compatible middleware
// This naturally catches any unhandled paths and serves index.html safely
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Full-Stack Server running live on port ${PORT}`);
});