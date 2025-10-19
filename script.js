// AIPermit Website JavaScript
// Handles interactivity, animations, and user interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize button interactions
    initButtonInteractions();
    
    // Initialize mobile menu (if needed)
    initMobileMenu();
    
    // Initialize form handling (if forms are added later)
    initFormHandling();
    
    // Initialize modal functionality
    initModal();
    
    // Add test button for debugging
    addTestButton();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .feature-content, .feature-visual');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Button interactions and CTA handling
function initButtonInteractions() {
    // Header CTA button - Open modal
    const headerCta = document.getElementById('header-cta');
    if (headerCta) {
        console.log('Header CTA button found, adding click listener');
        headerCta.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Header CTA clicked, opening modal');
            openDemoModal();
        });
    } else {
        console.log('Header CTA button not found');
    }

    // Hero CTA button - Open modal
    const heroCta = document.getElementById('hero-cta');
    if (heroCta) {
        console.log('Hero CTA button found, adding click listener');
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hero CTA clicked, opening modal');
            openDemoModal();
        });
    } else {
        console.log('Hero CTA button not found');
    }

    // Service card buttons
    const cardButtons = document.querySelectorAll('.btn-card');
    cardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.closest('.service-card').querySelector('.card-title').textContent;
            handleCtaClick(`Learn More clicked for ${cardTitle}`);
        });
    });

    // Footer CTA links
    const footerCtas = document.querySelectorAll('.footer-link');
    footerCtas.forEach(link => {
        if (link.textContent === 'Request a Demo') {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                handleCtaClick('Footer CTA clicked');
            });
        }
    });
}

// Handle CTA button clicks
function handleCtaClick(action) {
    console.log(action);
    
    // Add visual feedback
    showNotification('Thank you for your interest! We\'ll be in touch soon.');
    
    // Here you could integrate with:
    // - Email services (EmailJS, Formspree)
    // - CRM systems
    // - Analytics tracking
    // - Contact forms
}

// Show notification to user
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Mobile menu functionality (if needed)
function initMobileMenu() {
    // This would be implemented if a mobile menu is needed
    // For now, the navigation is hidden on mobile as per design
    console.log('Mobile menu initialized');
}

// Form handling for future contact forms
function initFormHandling() {
    // This would handle form submissions when contact forms are added
    console.log('Form handling initialized');
}

// Utility function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll-to-top button functionality
function addScrollToTopButton() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '<i data-lucide="arrow-up"></i>';
    scrollButton.className = 'scroll-to-top';
    scrollButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-green);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    scrollButton.addEventListener('click', scrollToTop);
    document.body.appendChild(scrollButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollButton.style.display = 'flex';
        } else {
            scrollButton.style.display = 'none';
        }
    });
}

// Initialize scroll-to-top button
addScrollToTopButton();

// Re-initialize icons after dynamic content changes
function refreshIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    // Refresh icons on resize
    refreshIcons();
});

// Analytics tracking (placeholder for future implementation)
function trackEvent(eventName, eventData) {
    console.log(`Analytics: ${eventName}`, eventData);
    
    // Here you could integrate with:
    // - Google Analytics
    // - Facebook Pixel
    // - Other analytics platforms
}

// Modal functionality
function openDemoModal() {
    console.log('openDemoModal called');
    const modal = document.getElementById('demoModal');
    if (modal) {
        console.log('Modal found, opening...');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
        console.log('Modal not found!');
    }
}

function closeDemoModal() {
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }
}

// Initialize modal functionality
function initModal() {
    const modal = document.getElementById('demoModal');
    const closeBtn = document.querySelector('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const demoForm = document.getElementById('demoForm');

    // Close modal when clicking X
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDemoModal);
    }

    // Close modal when clicking Cancel
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDemoModal);
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDemoModal();
            }
        });
    }

    // Handle form submission
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDemoSubmission();
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeDemoModal();
        }
    });
}

// Handle demo form submission
function handleDemoSubmission() {
    const form = document.getElementById('demoForm');
    const formData = new FormData(form);
    
    // Collect form data
    const demoData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        company: formData.get('company'),
        jobTitle: formData.get('jobTitle'),
        phone: formData.get('phone'),
        industry: formData.get('industry'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on'
    };

    // Validate required fields
    if (!demoData.firstName || !demoData.lastName || !demoData.email || !demoData.company) {
        showNotification('Please fill in all required fields.');
        return;
    }

    // Show success message
    showNotification('Thank you for your demo request! We\'ll contact you soon.');
    
    // Close modal
    closeDemoModal();
    
    // Reset form
    form.reset();
    
    // Here you would typically send the data to your server
    console.log('Demo request data:', demoData);
    
    // Track the event
    trackEvent('demo_request_submitted', {
        company: demoData.company,
        industry: demoData.industry
    });
}

// Add test button for debugging
function addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = 'TEST MODAL';
    testButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: red;
        color: white;
        padding: 10px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    testButton.addEventListener('click', function() {
        console.log('Test button clicked');
        openDemoModal();
    });
    document.body.appendChild(testButton);
}

// Export functions for potential external use
window.AIPermit = {
    trackEvent,
    showNotification,
    scrollToTop,
    refreshIcons,
    openDemoModal,
    closeDemoModal
};
