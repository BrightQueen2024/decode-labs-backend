document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');

    // 📤 Form Submission Handler (Securely sends payloads to the backend)
    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const nameInput = document.getElementById('internName') || document.getElementById('name');
            const emailInput = document.getElementById('internEmail') || document.getElementById('email');
            const messageInput = document.getElementById('internRole') || document.getElementById('message');

            // 🌟 FIXED: Changed the property key from 'role' to 'message' to match database expectations
            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim() 
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
                    alert('🚀 Message sent successfully! I will get back to you soon.');
                    
                    // Reset inputs safely
                    if (nameInput) nameInput.value = '';
                    if (emailInput) emailInput.value = '';
                    if (messageInput) messageInput.value = '';
                } else {
                    console.error('❌ Server rejected the data packet transaction.');
                }
            } catch (error) {
                console.error('❌ Network link failure during form transmission:', error);
            }
        });
    }
});