// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    loadCartFromStorage();
});

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm(form)) {
            submitContactForm(form);
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error on input
            const errorElement = this.parentNode.querySelector('.form-error');
            if (errorElement) {
                errorElement.remove();
                this.style.borderColor = '';
            }
        });
    });
}

function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    const existingError = field.parentNode.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Ce champ est requis';
        isValid = false;
    }
    // Email validation
    else if (field.type === 'email' && value && !isValidEmail(value)) {
        errorMessage = 'Veuillez entrer une adresse email valide';
        isValid = false;
    }
    // Phone validation
    else if (field.type === 'tel' && value && !isValidPhone(value)) {
        errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        isValid = false;
    }
    // Name validation (no numbers)
    else if ((field.id === 'first-name' || field.id === 'last-name') && value && /\d/.test(value)) {
        errorMessage = 'Le nom ne doit pas contenir de chiffres';
        isValid = false;
    }
    // Message length validation
    else if (field.id === 'message' && value && value.length < 10) {
        errorMessage = 'Le message doit contenir au moins 10 caractères';
        isValid = false;
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function submitContactForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const contactData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        privacy: formData.get('privacy') === 'on',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer
    };
    
    // Simulate API call
    setTimeout(() => {
        // Save contact to localStorage for demo
        saveContactToStorage(contactData);
        
        // Show success message
        showToast('Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
        // In a real application, you would send the data to your server
        // sendContactEmail(contactData);
        
    }, 2000);
}

function saveContactToStorage(contactData) {
    const contacts = loadFromStorage('boutique-contacts') || [];
    contacts.push(contactData);
    saveToStorage('boutique-contacts', contacts);
}

// Auto-save form data as user types (for better UX)
function initFormAutoSave() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Load saved data
        const savedValue = loadFromStorage(`contact-form-${input.name}`);
        if (savedValue && input.type !== 'checkbox') {
            input.value = savedValue;
        } else if (savedValue && input.type === 'checkbox') {
            input.checked = savedValue === 'true';
        }
        
        // Save data on change
        input.addEventListener('input', function() {
            if (this.type === 'checkbox') {
                saveToStorage(`contact-form-${this.name}`, this.checked.toString());
            } else {
                saveToStorage(`contact-form-${this.name}`, this.value);
            }
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        inputs.forEach(input => {
            localStorage.removeItem(`contact-form-${input.name}`);
        });
    });
}

// Character counter for message field
function initCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    const maxLength = 1000;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.textAlign = 'right';
    counter.style.fontSize = '0.9rem';
    counter.style.color = 'var(--gray)';
    counter.style.marginTop = 'var(--spacing-xs)';
    
    messageField.parentNode.appendChild(counter);
    
    function updateCounter() {
        const remaining = maxLength - messageField.value.length;
        counter.textContent = `${messageField.value.length}/${maxLength} caractères`;
        
        if (remaining < 50) {
            counter.style.color = 'var(--primary-color)';
        } else {
            counter.style.color = 'var(--gray)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    messageField.setAttribute('maxlength', maxLength);
    updateCounter();
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initFormAutoSave();
    initCharacterCounter();
});

// Subject-specific form customization
function initSubjectCustomization() {
    const subjectSelect = document.getElementById('subject');
    const messageField = document.getElementById('message');
    
    if (!subjectSelect || !messageField) return;
    
    const placeholders = {
        'information': 'Décrivez les informations que vous recherchez...',
        'reservation': 'Précisez le service souhaité, vos disponibilités...',
        'commande': 'Indiquez votre numéro de commande et votre question...',
        'produit': 'Quel produit vous intéresse ? Avez-vous des questions spécifiques ?',
        'partenariat': 'Décrivez votre proposition de partenariat...',
        'autre': 'Décrivez votre demande en détail...'
    };
    
    subjectSelect.addEventListener('change', function() {
        const selectedSubject = this.value;
        if (placeholders[selectedSubject]) {
            messageField.placeholder = placeholders[selectedSubject];
        }
    });
}

// Initialize subject customization
document.addEventListener('DOMContentLoaded', initSubjectCustomization);