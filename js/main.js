/* ==================================================
   O-PRIME RELOCATION - MAIN UI LOGIC
   ================================================== */

/*document.addEventListener('DOMContentLoaded', () => {
    


     const heroImg = document.getElementById('rotating-hero-img');
    if (!heroImg) return;

    // Array of your 4 images (Replace these file paths with your actual image paths)
    const images = [
        "images/file_0000000064c881f5bbda4752afd413af.png",
        "images/file_00000000a18881f5aa49ed9abc633b4b.png",
        "images/file_000000005bb481f78a2aa2c7a46540b1.png",
        "images/file_00000000800081f5a1bd07a1373d718c.png"
    ];

    let currentIndex = 0;

    setInterval(() => {
        // Fade out slightly
        heroImg.style.opacity = '0.4';

        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            heroImg.src = images[currentIndex];
            // Fade back in
            heroImg.style.opacity = '1';
        }, 400); // Matches half of the transition time for a smooth crossfade

    }, 4500); // Changes image every 4.5 seconds



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
}); */


/* ==================================================
   O-PRIME RELOCATION - MAIN SITE SCRIPT
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Rotating Hero Image Slideshow (Only runs if hero image exists on the page)
    const heroImg = document.getElementById('rotating-hero-img');
    if (heroImg) {
        const images = [
            "images/file_0000000064c881f5bbda4752afd413af.png",
            "images/file_00000000a18881f5aa49ed9abc633b4b.png",
            "images/file_000000005bb481f78a2aa2c7a46540b1.png",
            "images/file_00000000800081f5a1bd07a1373d718c.png"
        ];

        let currentIndex = 0;

        setInterval(() => {
            heroImg.style.opacity = '0.4';

            setTimeout(() => {
                currentIndex = (currentIndex + 1) % images.length;
                heroImg.src = images[currentIndex];
                heroImg.style.opacity = '1';
            }, 400);

        }, 4500);
    }

    // 2. Mobile Menu Toggle (Works across all pages)
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (mobileBtn && desktopNav) {
        mobileBtn.addEventListener('click', () => {
            const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
            
            if (!isExpanded) {
                desktopNav.style.display = 'block';
                desktopNav.style.position = 'absolute';
                desktopNav.style.top = '100%';
                desktopNav.style.left = '0';
                desktopNav.style.width = '100%';
                desktopNav.style.background = 'var(--bg-main, #ffffff)';
                desktopNav.style.padding = '2rem';
                desktopNav.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                desktopNav.style.borderBottom = '1px solid var(--border, #e2e8f0)';
                mobileBtn.setAttribute('aria-expanded', 'true');
                mobileBtn.innerHTML = '✕';
            } else {
                desktopNav.style.display = 'none';
                mobileBtn.setAttribute('aria-expanded', 'false');
                mobileBtn.innerHTML = '☰';
            }
        });

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

    // 3. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isOpen = header.getAttribute('aria-expanded') === 'true';
            
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.style.maxHeight = null;
                item.previousElementSibling.setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                header.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = content.scrollHeight + "px";
                
                if (window.OPrimeAnalytics) {
                    window.OPrimeAnalytics.trackEvent('faq_opened', { question: header.innerText });
                }
            }
        });
    });
});