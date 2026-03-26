document.addEventListener('DOMContentLoaded', () => {
    // 0. Settings Toggle
    const settingsToggle = document.getElementById('settingsToggle');
    const settingsDropdown = document.getElementById('settingsDropdown');

    if (settingsToggle && settingsDropdown) {
        settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsDropdown.classList.toggle('hidden');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsToggle.contains(e.target) && !settingsDropdown.contains(e.target)) {
                settingsDropdown.classList.add('hidden');
            }
        });
    }

    // 1. Mobile Menu Toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileSidebar = document.getElementById('mobileSidebar');
    const closeSidebar = document.getElementById('closeSidebar');

    if (mobileMenu && mobileSidebar) {
        const toggleMenu = () => {
            mobileSidebar.classList.toggle('active');
            const icon = mobileMenu.querySelector('i');
            if (mobileSidebar.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        };

        mobileMenu.addEventListener('click', toggleMenu);
        if (closeSidebar) closeSidebar.addEventListener('click', () => {
            mobileSidebar.classList.remove('active');
            const icon = mobileMenu.querySelector('i');
            if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
        });

        // Close mobile menu when clicking a link
        document.querySelectorAll('.sidebar-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileSidebar.classList.remove('active');
                const icon = mobileMenu.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            if (mobileMenu) {
                const icon = mobileMenu.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // 2. Sticky Navbar & Active Link Update on Scroll
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Update
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id') || '';
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            // Check if link href matches #current
            if (current && link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            } else if (!current && link.getAttribute('href') === '#top') {
               link.classList.add('active');
            }
        });
    });

    // 3. Scroll Reveal Animations using Intersection Observer
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animate only once per element
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Counter Animation inside achievements section
    const counters = document.querySelectorAll('.stat-number');
    const achievementsSection = document.getElementById('achievements');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            counter.innerText = '0';
            const target = +counter.getAttribute('data-target');
            // Approx 60fps = 16ms per frame. Duration max 2s (125 frames)
            const increment = target / 100;
            
            const updateCounter = () => {
                const current = +counter.innerText;
                if (current < target) {
                    counter.innerText = Math.ceil(current + increment);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    // Observer for counters container
    if (achievementsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !hasCounted) {
                runCounters();
                hasCounted = true;
            }
        }, { threshold: 0.5 });
        counterObserver.observe(achievementsSection);
    }

    // 5. Testimonial Slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;

        const updateSlider = (index) => {
            // reset all
            slides.forEach(slide => slide.classList.remove('active-slide'));
            dots.forEach(dot => dot.classList.remove('active'));

            // set active slide
            slides[index].classList.add('active-slide');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let nextIndex = (currentSlide + 1) % totalSlides;
                updateSlider(nextIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
                updateSlider(prevIndex);
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
            });
        });

        // Auto slide interval every 6 seconds
        setInterval(() => {
            let nextIndex = (currentSlide + 1) % totalSlides;
            updateSlider(nextIndex);
        }, 6000);
    }

    // 6. FAQ Accordion Logic
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            
            // Close all other accordions first
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const icon = otherItem.querySelector('.accordion-icon i');
                    if (icon) {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            });

            // Toggle current accordion
            item.classList.toggle('active');
            const icon = header.querySelector('.accordion-icon i');
            if (item.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
            }
        });
    });

    // 7. Form Submission Mock functionality
    const enrollmentForm = document.getElementById('enrollmentForm');
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (enrollmentForm) {
        enrollmentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard page reload
            
            // Basic frontend validation mock logic
            const studentName = document.getElementById('studentName').value;
            const parentName = document.getElementById('parentName').value;
            
            if (studentName && parentName) {
                // Show success view
                enrollmentForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
            }
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            enrollmentForm.reset();
            formSuccess.classList.add('hidden');
            enrollmentForm.classList.remove('hidden');
        });
    }

    // 9. Typing Animation Logic
    const typingText = document.getElementById('typing-text');
    const phrase = "Every Reaction Begins with Understanding.";
    let i = 0;
    const speed = 70; // typing speed in ms

    if (typingText) {
        const typeWriter = () => {
            if (i < phrase.length) {
                typingText.innerHTML += phrase.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        };

        // Start typing after a short delay
        setTimeout(typeWriter, 1000);
    }

    // 10. Scroll to Top Logic
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        // Initial state
        scrollTopBtn.style.opacity = '0';
        scrollTopBtn.style.pointerEvents = 'none';
        scrollTopBtn.style.transform = 'translateY(20px)';
        scrollTopBtn.style.transition = 'all 0.4s ease';

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.pointerEvents = 'auto';
                scrollTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.pointerEvents = 'none';
                scrollTopBtn.style.transform = 'translateY(20px)';
            }
        });
    }
});
