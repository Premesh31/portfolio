const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;
const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
if (isDarkMode) {
    body.classList.add('dark-mode');
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    darkModeToggle.checked = true;
}
darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
        body.classList.add('dark-mode');
        document.documentElement.setAttribute('data-bs-theme', 'dark');
        localStorage.setItem('darkMode', 'enabled');
    }
    else {
        body.classList.remove('dark-mode');
        document.documentElement.removeAttribute('data-bs-theme');
        localStorage.setItem('darkMode', 'disabled');
    }
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
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

// Initialize AOS
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
});
