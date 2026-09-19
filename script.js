const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const modeIcon = document.querySelector('.mode i');

// Default is dark mode — only disable it if user has explicitly chosen light mode
const savedMode = localStorage.getItem('darkMode');
const isDarkMode = savedMode !== 'disabled'; // dark by default

if (isDarkMode) {
    body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    darkModeToggle.checked = true;
    if (modeIcon) modeIcon.classList.replace('fa-moon', 'fa-sun');
} else {
    body.classList.remove('dark-mode');
    document.documentElement.removeAttribute('data-bs-theme');
    if (modeIcon) modeIcon.classList.replace('fa-sun', 'fa-moon');
}


darkModeToggle.addEventListener('change', () => {
    const isDark = darkModeToggle.checked;

    // 1. Instantly switch theme classes so CSS transitions (background, text, cards) begin immediately with zero lag
    if (isDark) {
        body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        document.documentElement.removeAttribute('data-bs-theme');
        localStorage.setItem('darkMode', 'disabled');
    }

    // 2. Smoothly rotate, shrink, swap icon and spring back up
    if (modeIcon) {
        modeIcon.style.transform = 'rotate(180deg) scale(0.2)';
        modeIcon.style.opacity = '0';

        setTimeout(() => {
            if (isDark) {
                modeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                modeIcon.classList.replace('fa-sun', 'fa-moon');
            }
            modeIcon.style.transform = 'rotate(360deg) scale(1)';
            modeIcon.style.opacity = '1';
        }, 180);

        setTimeout(() => {
            modeIcon.style.transform = '';
            modeIcon.style.opacity = '';
        }, 450);
    }
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // HTML5 Validation Check
        if (!contactForm.checkValidity()) {
            e.stopPropagation();
            contactForm.classList.add('was-validated');
            return;
        }

        // Add class to show valid states if desired
        contactForm.classList.add('was-validated');

        // Let the user know it is submitting
        if (formStatus) {
            formStatus.classList.remove('d-none', 'alert-success', 'alert-danger');
            formStatus.classList.add('alert', 'alert-info');
            formStatus.textContent = 'Sending message...';
        }

        const formData = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                if (formStatus) {
                    formStatus.classList.replace('alert-info', 'alert-success');
                    formStatus.textContent = 'Thank you for your message! I will get back to you soon.';
                }
                contactForm.reset();
                contactForm.classList.remove('was-validated'); // Reset validation visually so empty fields aren't instantly red.
            } else {
                const data = await response.json();
                if (formStatus) {
                    formStatus.classList.replace('alert-info', 'alert-danger');
                    formStatus.textContent = 'Oops! There was a problem submitting your form.';
                    console.error("FormSubmit Error:", data);
                }
            }
        } catch (error) {
            if (formStatus) {
                formStatus.classList.replace('alert-info', 'alert-danger');
                formStatus.textContent = 'Oops! There was a problem submitting your form.';
                console.error("Submit Error:", error);
            }
        }

        // Hide the status message after a few seconds
        setTimeout(() => {
            if (formStatus) {
                formStatus.classList.add('d-none');
            }
        }, 5000);
    });
}

// Initialize AOS and Swiper
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize Horizontal Auto-Scrolling Swiper for Skills
    new Swiper('.mySkillsSwiper', {
        loop: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        speed: 3000,
        spaceBetween: 24,
        slidesPerView: 1,
        breakpoints: {
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
        }
    });

    // Initialize Typed.js for Hero Section
    if (document.getElementById('typed-text')) {
        new Typed('#typed-text', {
            strings: ['UI/UX Designer', 'UI Developer', 'Web Developement'],
            typeSpeed: 60,
            backSpeed: 40,
            backDelay: 1500,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
});

// Close responsive menu when a link is clicked
const navLinks = document.querySelectorAll('header ul li a');
const menuCheckbox = document.getElementById('click');
const headerUl = document.querySelector('header ul');
const menuLabel = document.querySelector('.mainicon');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (menuCheckbox && menuCheckbox.checked) {
            menuCheckbox.checked = false;
        }
    });
});

// Close responsive menu when clicking outside
document.addEventListener('click', (event) => {
    if (menuCheckbox && menuCheckbox.checked) {
        if (headerUl && menuLabel) {
            // Check if the click occurred outside the menu and the hamburger icon
            if (!headerUl.contains(event.target) && !menuLabel.contains(event.target) && event.target !== menuCheckbox) {
                menuCheckbox.checked = false;
            }
        }
    }
});

// Update active navigation link dynamically using robust viewport bounds
const sections = document.querySelectorAll('section');

function updateActiveNav() {
    let current = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // The section is considered 'current' if its top is above the middle of the screen 
        // AND its bottom hasn't scrolled completely past the top header
        if (rect.top <= (window.innerHeight / 2) && rect.bottom >= 150) {
            current = section.getAttribute('id');
        }
    });

    if (current) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// Bind to scroll and run once on load
window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

// Force-download the CV PDF across all environments (file://, http://, https://)
function forceDownloadCV(e) {
    if (e) e.preventDefault();
    const fileName = 'Premesh CV 2026.pdf';
    const filePath = 'Premesh CV 2026.pdf';

    function downloadBlob(blob) {
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
    }

    function downloadBase64(base64Data) {
        try {
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            downloadBlob(blob);
            return true;
        } catch (err) {
            console.error('Base64 decode error:', err);
            return false;
        }
    }

    // If running via file:/// protocol or if base64 data is present, use it for direct client download
    if (window.location.protocol === 'file:' && window.PREMESH_CV_BASE64) {
        if (downloadBase64(window.PREMESH_CV_BASE64)) return;
    }

    // For web servers (http/https), fetch as blob to guarantee immediate file download
    fetch(filePath)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.blob();
        })
        .then(blob => {
            downloadBlob(blob);
        })
        .catch(() => {
            // Fallback 1: use embedded base64 data if available
            if (window.PREMESH_CV_BASE64 && downloadBase64(window.PREMESH_CV_BASE64)) {
                return;
            }
            // Fallback 2: direct anchor download
            const fallbackLink = document.createElement('a');
            fallbackLink.href = filePath;
            fallbackLink.download = fileName;
            fallbackLink.target = '_blank';
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const cvButton = document.getElementById('downloadCvBtn');
    if (cvButton) {
        cvButton.addEventListener('click', forceDownloadCV);
    }
});

