document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');

    // 📤 Form Submission Handler (Securely sends payloads to the backend)
    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const nameInput = document.getElementById('internName') || document.getElementById('name');
            const emailInput = document.getElementById('internEmail') || document.getElementById('email');
            const messageInput = document.getElementById('internRole') || document.getElementById('message');

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(), // ✉️ Added email field
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
                    alert('🚀 Message sent successfully! I will get back to you soon.');
                    
                    // Reset inputs safely
                    nameInput.value = '';
                    if(emailInput) emailInput.value = '';
                    messageInput.value = '';
                } else {
                    console.error('❌ Server rejected the data packet transaction.');
                }
            } catch (error) {
                console.error('❌ Network link failure during form transmission:', error);
            }
        });
    }
});