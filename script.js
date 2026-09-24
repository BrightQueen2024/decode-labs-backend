/**
 * OFFICE OF AYUBA GARBA — BESPOKE ARCHITECTURAL CLIENT SCRIPTS
 * Subtle Micro-Interactions, Active Navigation, Glassmorphic Feedback & Dynamic States
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Sleek Toast Notification Engine
    window.showGlassToast = (message, icon = '✦') => {
        // Remove existing toast if any
        const existingToast = document.querySelector('.glass-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.className = 'glass-toast';
        toast.innerHTML = `
            <span class="text-sm font-semibold text-white">${icon}</span>
            <span class="tracking-tight">${message}</span>
        `;
        
        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 4500);
    };

    // 2. Sticky Navbar Glass Morph on Scroll
    const floatingNavbar = document.getElementById('floating-navbar');
    window.addEventListener('scroll', () => {
        if (!floatingNavbar) return;
        if (window.scrollY > 40) {
            floatingNavbar.classList.add('glass-nav-scrolled');
        } else {
            floatingNavbar.classList.remove('glass-nav-scrolled');
        }
    }, { passive: true });

    // 3. Mobile Navigation Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenuOverlay) {
        const toggleMobileMenu = () => {
            const isOpen = !mobileMenuOverlay.classList.contains('hidden');
            if (isOpen) {
                mobileMenuOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                `;
            } else {
                mobileMenuOverlay.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                `;
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuOverlay.classList.add('hidden');
                document.body.style.overflow = '';
                mobileMenuBtn.innerHTML = `
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                `;
            });
        });
    }

    // 4. Active Section Highlighting in Floating Navbar
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-link-item');

    const updateActiveNav = () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navAnchors.forEach(anchor => {
            const href = anchor.getAttribute('href');
            if (href === `#${currentSectionId}`) {
                anchor.classList.add('text-white', 'border-b-2', 'border-white');
                anchor.classList.remove('text-neutral-400');
            } else {
                anchor.classList.remove('text-white', 'border-b-2', 'border-white');
                anchor.classList.add('text-neutral-400');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // 5. Executive RFP / Direct Inquiry Form Handler
    const inquiryForm = document.getElementById('advisoryInquiryForm');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = inquiryForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    Dispatching Payload...
                `;
            }

            const name = (document.getElementById('rfp-name')?.value || '').trim();
            const email = (document.getElementById('rfp-email')?.value || '').trim();
            const role = (document.getElementById('rfp-scope')?.value || '').trim();
            const message = (document.getElementById('rfp-message')?.value || '').trim();

            const fullDetails = `${role ? '[' + role + '] ' : ''}${message}`;

            try {
                const response = await fetch('/api/messages', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        role: fullDetails || 'Advisory Inquiry'
                    })
                });

                if (response.ok) {
                    showGlassToast('Consultation request dispatched to Ayuba Garba.', '✦');
                    inquiryForm.reset();
                } else {
                    // Graceful fallback for Netlify static deployments or missing DB connection
                    showGlassToast('Inquiry recorded. Email client fallback available.', '✓');
                    window.location.href = `mailto:ayubagarba.tech@gmail.com?subject=Strategic Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(fullDetails)}`;
                }
            } catch (err) {
                // Fallback to mailto link seamlessly
                showGlassToast('Network routed to direct advisory inbox.', '✓');
                window.location.href = `mailto:ayubagarba.tech@gmail.com?subject=Strategic Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(fullDetails)}`;
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    }

    // 6. Smooth Scroll for Anchor CTAs with Offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const offset = 90; // account for floating navbar
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = targetElement.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Dynamic Local Time in Footer
    const localTimeEl = document.getElementById('office-local-time');
    if (localTimeEl) {
        const updateLocalTime = () => {
            const options = { 
                timeZone: 'Africa/Lagos', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit',
                hour12: false 
            };
            const formatter = new Intl.DateTimeFormat([], options);
            localTimeEl.textContent = `${formatter.format(new Date())} WAT`;
        };
        updateLocalTime();
        setInterval(updateLocalTime, 1000);
    }
});