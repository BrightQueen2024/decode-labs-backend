const express = require('express');
const app = express();
const PORT = 3000;

// This middleware lets your server read incoming JSON data
app.use(express.json());

// Mock local data store (Key Requirement: Handle data flow)
let students = [
    { id: 1, name: "Ayuba Garba", role: "Full Stack Intern" }
];

// 📡 REQUIREMENT 1: GET Endpoint (Fetch all data)
app.get('/api/students', (req, res) => {
    res.status(200).json(students);
});

// 📡 REQUIREMENT 2: POST Endpoint (Receive and validate user input)
app.post('/api/students', (req, res) => {
    const { name, role } = req.body;

    // Data Validation check
    if (!name || !role) {
        return res.status(400).json({ error: "Validation failed. Name and role are required fields!" });
    }

    const newStudent = {
        id: students.length + 1,
        name: name,
        role: role
    };

    students.push(newStudent);
    res.status(201).json({ message: "Data received successfully! 🚀", student: newStudent });
});

// Root check route
app.get('/', (req, res) => {
    res.send('Welcome to the DecodeLabs Week 2 Backend Engine! 🚀');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});