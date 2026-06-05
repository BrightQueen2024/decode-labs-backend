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

// 📝 Updated Schema Rule: Added 'email' as a strictly required string
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true }, // 👈 Enforces email capture
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📤 API Route: Push a new message payload
app.post('/api/messages', async (req, res) => {
    const { name, email, role } = req.body; // 👈 Destructure email
    
    // Validate that all fields exist before touching the database
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

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Full-Stack Server running live on port ${PORT}`);
});