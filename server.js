require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 🔌 Clean Environment Variable Link
const MONGO_URI = process.env.MONGO_URI;

// Connect to Database with a smart fallback mechanism
mongoose.connect(MONGO_URI)
    .then(() => console.log('🚀 Successfully connected to MongoDB Atlas Cloud Database!'))
    .catch(err => {
        console.log('⚠️ Local Network DNS blocked the Cloud. Switching to safe local memory driver fallback...');
        // Fallback to a localized state so your development environment stays awake smoothly
        mongoose.connect('mongodb://127.0.0.1:27017/portfolio_dev')
            .then(() => console.log('💻 Connected to Local Development Data Layer successfully.'))
            .catch(localErr => console.error('❌ Data Layer Offline:', localErr));
    });

// 📝 Define data schema rules for portfolio messages
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Middleware hooks configuration
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 📥 API Route: Fetch all message rows
app.get('/api/messages', async (req, res) => {
    try {
        const records = await Message.find().sort({ createdAt: -1 });
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// 📤 API Route: Push a new message payload
app.post('/api/messages', async (req, res) => {
    const { name, role } = req.body;
    
    if (!name || !role) {
        return res.status(400).json({ error: 'Name and message details are required.' });
    }

    try {
        const newMessage = new Message({ name, role });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to write message record.' });
    }
});

// 🎯 EXPRESS 5 IMMUNE FALLBACK: Handles single-page app routing using a custom middleware function
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🌐 Full-Stack Server running live at http://localhost:${PORT}`);
});