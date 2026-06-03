const API_URL = 'http://localhost:3000/api/students';

// 📡 FUNCTION 1: Fetch data from Backend and display it on screen (GET)
function fetchInterns() {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const listContainer = document.getElementById('internList');
            listContainer.innerHTML = ''; // Clear old items

            // Build list entries dynamically
            data.forEach(intern => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <strong>${intern.name}</strong>
                    <span class="role">${intern.role}</span>
                `;
                listContainer.appendChild(li);
            });
        })
        .catch(err => console.error('Error loading interns:', err));
}

// 📡 FUNCTION 2: Capture form input and send it straight to Backend (POST)
document.getElementById('internForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page from reloading

    const nameValue = document.getElementById('internName').value;
    const roleValue = document.getElementById('internRole').value;

    const bodyPayload = {
        name: nameValue,
        role: roleValue
    };

    // Shoot data to backend server
    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
    })
    .then(res => res.json())
    .then(result => {
        console.log('Server response:', result);
        fetchInterns(); // Instantly update list responsively!
        document.getElementById('internForm').reset(); // Clear input boxes
    })
    .catch(err => console.error('Error saving intern:', err));
});

// Run automatically when webpage loads
window.onload = fetchInterns;