/* ==================================================
   O-PRIME RELOCATION - MAIN UI LOGIC
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileBtn && desktopNav) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            
            if (!isExpanded) {
                // Open menu
                desktopNav.style.display = 'block';
                desktopNav.style.position = 'absolute';
                desktopNav.style.top = '100%';
                desktopNav.style.left = '0';
                desktopNav.style.width = '100%';
                desktopNav.style.background = 'var(--bg-main)';
                desktopNav.style.padding = '2rem';
                desktopNav.style.boxShadow = 'var(--shadow-md)';
                desktopNav.style.borderBottom = '1px solid var(--border)';
                mobileBtn.setAttribute('aria-expanded', 'true');
                mobileBtn.innerHTML = '✕'; // Change icon to close
            } else {
                // Close menu
                desktopNav.style.display = 'none';
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.innerHTML = '☰'; // Reset icon
            }
        });

        // Ensure menu resets correctly if window is resized to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                desktopNav.style.display = 'block';
                desktopNav.style.position = 'static';
                desktopNav.style.padding = '0';
                desktopNav.style.boxShadow = 'none';
                desktopNav.style.borderBottom = 'none';
            } else if (mobileBtn.getAttribute('aria-expanded') !== 'true') {
                desktopNav.style.display = 'none';
            }
        });
    }

    // 2. FAQ Accordion Logic (For use on service pages)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.getAttribute('aria-expanded') === 'true';
            
            // Close all other accordions for a cleaner UI
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.style.maxHeight = null;
                item.previousElementSibling.setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                header.setAttribute('aria-expanded', 'true');
                // Set max-height for CSS transition
                content.style.maxHeight = content.scrollHeight + "px";
                
                // Track interaction
                if (window.OPrimeAnalytics) {
                    window.OPrimeAnalytics.trackEvent('faq_opened', { question: header.innerText });
                }
            }
        });
    });
});