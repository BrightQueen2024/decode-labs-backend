document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');
    const internList = document.getElementById('internList');

    // 📥 1. Fetch and render data records
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
                        <span class="role">💬 ${record.role || record.message || 'No message provided.'}</span>
                    </div>
                `;
                internList.appendChild(li);
            });
        } catch (error) {
            console.error('❌ Error rendering live system records:', error);
        }
    }

    // 📤 2. Form Submission Handler
    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Halt standard webpage refresh

            // ⚠️ If your HTML IDs are actually 'name' and 'message', update these strings here:
            const nameInput = document.getElementById('internName') || document.getElementById('name');
            const roleInput = document.getElementById('internRole') || document.getElementById('message');

            if (!nameInput || !roleInput) {
                console.error("❌ Form input elements could not be found in the HTML DOM.");
                return;
            }

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
                    console.log('🚀 Transmission successful! Saved securely.');
                    
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