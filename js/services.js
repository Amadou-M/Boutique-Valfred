// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    initBookingModal();
    initBookingForm();
    loadCartFromStorage();
});

// Booking modal functionality
function initBookingModal() {
    // Set minimum date to today
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }
}

function openBookingModal(serviceType) {
    const modal = document.getElementById('booking-modal');
    const serviceSelect = document.getElementById('service-type');
    
    if (modal && serviceSelect) {
        // Pre-select the service if specified
        if (serviceType) {
            serviceSelect.value = serviceType;
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset form
        const form = document.getElementById('booking-form');
        if (form) {
            form.reset();
        }
    }
}

// Booking form handling
function initBookingForm() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateBookingForm(form)) {
            submitBookingForm(form);
        }
    });
}

function validateBookingForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    // Clear previous errors
    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est requis');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Veuillez entrer une adresse email valide');
            isValid = false;
        } else if (field.type === 'tel' && field.value && !isValidPhone(field.value)) {
            showFieldError(field, 'Veuillez entrer un numéro de téléphone valide');
            isValid = false;
        }
    });
    
    // Validate date is not in the past
    const dateField = form.querySelector('#booking-date');
    if (dateField && dateField.value) {
        const selectedDate = new Date(dateField.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showFieldError(dateField, 'La date ne peut pas être dans le passé');
            isValid = false;
        }
    }
    
    return isValid;
}

function submitBookingForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = new FormData(form);
    const bookingData = {
        service: formData.get('service'),
        name: `${formData.get('firstName')} ${formData.get('lastName')}`,
        email: formData.get('email'),
        phone: formData.get('phone'),
        date: formData.get('date'),
        time: formData.get('time'),
        requests: formData.get('requests'),
        newsletter: formData.get('newsletter') === 'on',
        timestamp: new Date().toISOString()
    };
    
    // Simulate API call
    setTimeout(() => {
        // Save booking to localStorage for demo
        saveBookingToStorage(bookingData);
        
        // Show success message
        showToast('Réservation confirmée ! Nous vous contacterons bientôt.', 'success');
        
        // Reset form and close modal
        form.reset();
        closeBookingModal();
        
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        
        // Send confirmation email (in real app)
        // sendBookingConfirmation(bookingData);
        
    }, 2000);
}

function saveBookingToStorage(bookingData) {
    const bookings = loadFromStorage('boutique-bookings') || [];
    bookings.push(bookingData);
    saveToStorage('boutique-bookings', bookings);
}

// Service data for reference
const servicesData = {
    'soin-visage': {
        name: 'Soin du Visage',
        price: 45,
        duration: 60,
        description: 'Soins purifiants et hydratants à base d\'ingrédients naturels africains'
    },
    'coiffure': {
        name: 'Tresses & Coiffures',
        price: 35,
        duration: '90-180',
        description: 'Coiffures traditionnelles et modernes'
    },
    'massage': {
        name: 'Massage Traditionnel',
        price: 55,
        duration: '60-90',
        description: 'Massages relaxants aux huiles essentielles africaines'
    },
    'soin-pieds': {
        name: 'Soin des Pieds',
        price: 30,
        duration: 45,
        description: 'Pédicure traditionnelle et soins hydratants'
    },
    'soin-dentaire': {
        name: 'Soin Dentaire Naturel',
        price: 25,
        duration: 30,
        description: 'Soins d\'hygiène dentaire avec des produits naturels africains'
    },
    'coiffure-homme': {
        name: 'Coiffure Homme',
        price: 20,
        duration: 45,
        description: 'Coupes modernes et traditionnelles, taille de barbe'
    }
};

// Get service details
function getServiceDetails(serviceId) {
    return servicesData[serviceId] || null;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('booking-modal');
    if (e.target === modal) {
        closeBookingModal();
    }
});

// Close modal with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeBookingModal();
    }
});