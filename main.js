document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const header = document.querySelector('header');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            header.classList.toggle('mobile-nav-active');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (header.classList.contains('mobile-nav-active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (header.classList.contains('mobile-nav-active') && 
            !event.target.closest('.navbar') && 
            !event.target.closest('.mobile-menu-btn')) {
            header.classList.remove('mobile-nav-active');
            
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu when clicking a nav link
            if (header.classList.contains('mobile-nav-active')) {
                header.classList.remove('mobile-nav-active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Active navigation highlight
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function highlightNavOnScroll() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Special case for home (when at the top)
        // if (scrollPosition < sections[0].offsetTop - document.querySelector('header').offsetHeight) {
        //     navLinks.forEach(link => {
        //         link.classList.remove('active');
        //         if (link.getAttribute('href') === '#') {
        //             link.classList.add('active');
        //         }
        //     });
        // }
    }
    
    window.addEventListener('scroll', highlightNavOnScroll);
    
    // Form validation for contact form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            // Simple validation
            let isValid = true;
            
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            } else {
                removeError(name);
            }
            
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(email);
            }
            
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            } else {
                removeError(message);
            }
            
            if (isValid) {
                // In a real app, you would send the form data to the server here
                // For now, we'll just show a success message
                showSuccessMessage(contactForm);
                contactForm.reset();
            }
        });
    }
    
    // Newsletter subscription form validation
    const newsletterForm = document.querySelector('.footer-newsletter form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            
            if (!emailInput.value.trim()) {
                // Show error for empty email
                emailInput.style.borderColor = 'var(--error-color)';
                return;
            } else if (!isValidEmail(emailInput.value)) {
                // Show error for invalid email
                emailInput.style.borderColor = 'var(--error-color)';
                return;
            }
            
            // Reset border color
            emailInput.style.borderColor = '';
            
            // Show success message (in a real app, you would send the data to the server)
            const successMessage = document.createElement('p');
            successMessage.textContent = 'Thank you for subscribing!';
            successMessage.style.color = 'var(--success-color)';
            successMessage.style.marginTop = '0.5rem';
            
            // Remove any existing success message
            const existingMessage = this.parentNode.querySelector('p:not(:first-child)');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            this.parentNode.appendChild(successMessage);
            this.reset();
            
            // Remove success message after 3 seconds
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        // Remove any existing error message
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and append error message
        const errorMessage = document.createElement('small');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = message;
        errorMessage.style.color = 'var(--error-color)';
        errorMessage.style.display = 'block';
        errorMessage.style.marginTop = '0.25rem';
        
        formGroup.appendChild(errorMessage);
        
        // Highlight input
        input.style.borderColor = 'var(--error-color)';
    }
    
    function removeError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('error');
        
        // Remove error message if exists
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        // Reset input style
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        // Simple email validation regex
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showSuccessMessage(form) {
        // Create success message element
        const successDiv = document.createElement('div');
        successDiv.classList.add('success-message');
        successDiv.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
        successDiv.style.color = 'var(--success-color)';
        successDiv.style.padding = '1rem';
        successDiv.style.borderRadius = 'var(--border-radius)';
        successDiv.style.marginTop = '1rem';
        
        const successIcon = document.createElement('i');
        successIcon.classList.add('fas', 'fa-check-circle');
        successIcon.style.marginRight = '0.5rem';
        
        const successText = document.createElement('span');
        successText.textContent = 'Your message has been sent successfully!';
        
        successDiv.appendChild(successIcon);
        successDiv.appendChild(successText);
        
        // Remove any existing success message
        const existingSuccess = form.parentNode.querySelector('.success-message');
        if (existingSuccess) {
            existingSuccess.remove();
        }
        
        // Append success message after the form
        form.parentNode.appendChild(successDiv);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    // Initialize animations on scroll
    initScrollAnimations();
});

// Animations on scroll
function initScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .pricing-card, .contact-form, .contact-info');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Stop observing after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1
    });
    
    elements.forEach(element => {
        // Add initial styles
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        // Add observed element
        observer.observe(element);
    });
    
    // Add CSS class for animated elements
    const style = document.createElement('style');
    style.textContent = `
        .animated {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}