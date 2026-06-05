require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('❌ CRITICAL ERROR: MONGO_URI is missing from your environment configurations!');
    process.exit(1);
}

mongoose.connect(MONGO_URI)
    .then(() => console.log('🚀 Successfully connected to MongoDB Atlas Cloud Database!'))
    .catch(err => console.error('❌ Database Connection Failure:', err.message));

// 📝 Schema Configuration Rule
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, 
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// 🌐 Parse JSON Payloads
app.use(express.json());

// 📁 CORRECT PATHING: Serves all static files out of your /public directory
app.use(express.static(path.join(__dirname, 'public')));

// 📤 API Route: Push form records
app.post('/api/messages', async (req, res) => {
    const { name, email, role } = req.body;
    
    if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and message details are required.' });
    }

    try {
        const newMessage = new Message({ name, email, role });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('❌ Failed to write message record to MongoDB:', error);
        res.status(500).json({ error: 'Failed to write message record.' });
    }
});

// 🏠 FALLBACK ROUTE: Delivers index.html for any root or unhandled pathing requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Full-Stack Server running live on port ${PORT}`);
});