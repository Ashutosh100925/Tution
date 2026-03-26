/* =========================================================================
   EduPrime - JavaScript Interactivity
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. NAVBAR SCROLL EFFECT & MOBILE MENU --- */
    const navbar = document.getElementById('navbar');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile nav when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                let icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    /* --- 2. SCROLL REVEAL ANIMATIONS (Intersection Observer) --- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade, .reveal-scale');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once per load
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before crossing the view
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    /* --- 3. ANIMATED COUNTERS --- */
    const counters = document.querySelectorAll('.counter-num');
    let hasCounted = false;

    const counterCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                counters.forEach(counter => {
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        
                        // Calculate increment for smooth animation (lower speed = faster)
                        const speed = 150; 
                        const inc = target / speed;

                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 15);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });
                hasCounted = true;
                observer.disconnect(); // Stop observing once counted
            }
        });
    };

    const resultsSection = document.getElementById('results');
    if(resultsSection) {
        const counterObserver = new IntersectionObserver(counterCallback, { threshold: 0.5 });
        counterObserver.observe(resultsSection);
    }

    /* --- 4. TESTIMONIAL SLIDER --- */
    const track = document.getElementById('testimonial-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (track && prevBtn && nextBtn && dots.length > 0) {
        let currentIndex = 0;
        const totalSlides = dots.length;
        let slideInterval;

        const updateSlider = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
        };

        const startAutoSlide = () => {
            slideInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % totalSlides;
                updateSlider(currentIndex);
            }, 6000); // 6 seconds per slide
        };
        
        const resetInterval = () => {
            clearInterval(slideInterval);
            startAutoSlide();
        };

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlider(currentIndex);
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlider(currentIndex);
            resetInterval();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider(currentIndex);
                resetInterval();
            });
        });

        startAutoSlide(); // Initialize
    }

    /* --- 5. FAQ ACCORDION --- */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        
        questionBtn.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle current if it wasn't open
            if (!isOpen) {
                item.classList.add('active');
                const answer = item.querySelector('.faq-answer');
                // Calculate actual height needed (+ padding)
                answer.style.maxHeight = answer.scrollHeight + 40 + "px"; 
            }
        });
    });

    /* --- 6. FRONTEND FORM VALIDATION & MOCK SUBMIT --- */
    const form = document.getElementById('enrollForm');
    const formMsg = document.getElementById('formMsg');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const btn = document.getElementById('submitBtn');
            const originalText = btn.innerHTML;
            
            // Show loading state
            btn.innerHTML = 'Processing... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.style.opacity = '0.7';
            btn.disabled = true;
            
            // Simulate API request (1.5s delay)
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
                
                // Clear form and show success message
                form.reset();
                formMsg.textContent = "Application submitted successfully! Our team will contact you shortly.";
                formMsg.className = "form-msg success";
                formMsg.style.display = "block";
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    formMsg.style.display = 'none';
                }, 5000);
            }, 1500);
        });
    }

    /* --- 7. SMOOTH SCROLLING FOR ANCHOR LINKS --- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Account for fixed navbar height (approx 80px)
                const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
