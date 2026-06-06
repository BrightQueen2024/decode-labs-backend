document.addEventListener('DOMContentLoaded', () => {
    const internForm = document.getElementById('internForm');

    // ✨ Helper Function to Trigger Glassmorphism Toast
    const showGlassToast = (message, icon = '🚀') => {
        // Create toast element container dynamically
        const toast = document.createElement('div');
        toast.className = 'glass-toast';
        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
        `;
        
        document.body.appendChild(toast);

        // Tiny delay to allow CSS transition engine to capture entry animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 50);

        // Automatically slide out and destroy toast after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 500); // Completely delete element from DOM tree
        }, 4000);
    };

    // 📤 Form Submission Handler
    if (internForm) {
        internForm.addEventListener('submit', async (event) => {
            event.preventDefault(); 

            const nameInput = document.getElementById('internName') || document.getElementById('name');
            const emailInput = document.getElementById('internEmail') || document.getElementById('email');
            const messageInput = document.getElementById('internRole') || document.getElementById('message');

            const formData = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim() 
            };

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    // 🌟 UPGRADED: Silky premium toast replaces standard browser layout
                    showGlassToast('Message delivered successfully! I will reach out shortly.', '✨');
                    
                    // Reset inputs safely
                    if (nameInput) nameInput.value = '';
                    if (emailInput) emailInput.value = '';
                    if (messageInput) messageInput.value = '';
                } else {
                    showGlassToast('Server rejected data packet transaction.', '❌');
                }
            } catch (error) {
                showGlassToast('Network link failure during transmission.', '📡');
            }
        });
    }
});