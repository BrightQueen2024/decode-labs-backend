document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');
    const internList = document.getElementById('internList');

    // 📥 1. Fetch and render data records directly from the SQLite database
    async function fetchDatabaseRecords() {
        try {
            const response = await fetch('/api/messages');
            if (!response.ok) throw new Error('Network response was not stable.');
            
            const records = await response.json();
            
            // Clear the list to prepare for fresh data rows
            internList.innerHTML = '';
            
            // Generate visual list elements for each database entry
            records.forEach(record => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="record-details">
                        <span class="record-name">👤 ${record.name || 'Anonymous User'}</span>
                        <span class="role">💬 ${record.role || 'No message provided.'}</span>
                    </div>
                `;
                internList.appendChild(li);
            });
        } catch (error) {
            console.error('❌ Error rendering live system records:', error);
        }
    }

    // 📤 2. Form Submission Handler to securely send payloads to the backend API
    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Halt standard hardware webpage refresh

            const nameInput = document.getElementById('internName');
            const roleInput = document.getElementById('internRole');

            const formData = {
                name: nameInput.value.trim(),
                role: roleInput.value.trim()
            };

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    console.log('🚀 Transmission successful! Saved securely to portfolio.db.');
                    
                    // Reset inputs safely
                    nameInput.value = '';
                    roleInput.value = '';
                    
                    // Asynchronously update the UI feed stream automatically
                    await fetchDatabaseRecords();
                } else {
                    console.error('❌ Server rejected the data packet transaction.');
                }
            } catch (error) {
                console.error('❌ Network link failure during form transmission:', error);
            }
        });
    }

    // Initialize the live dashboard feed instantly on execution loop
    fetchDatabaseRecords();
});