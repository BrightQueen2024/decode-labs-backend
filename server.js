document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');
    const modal = document.getElementById('customAlertModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const nameInput = document.getElementById('internName');
            const emailInput = document.getElementById('internEmail');
            const messageInput = document.getElementById('internRole');

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                role: messageInput.value.trim() 
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
                    // 🎉 Trigger the branded modal instead of a boring browser popup
                    if (modal) {
                        modal.style.display = 'flex';
                    }
                    
                    // Safely clear out the inputs for the next entry
                    nameInput.value = '';
                    if (emailInput) emailInput.value = '';
                    messageInput.value = '';
                } else {
                    console.error('❌ Server rejected the data packet transaction.');
                }
            } catch (error) {
                console.error('❌ Network link failure during form transmission:', error);
            }
        });
    }

    // 🔒 Close Modal Window Event
    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
});