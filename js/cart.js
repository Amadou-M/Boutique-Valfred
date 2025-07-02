let cart = [];

function loadCartFromStorage() {
    const savedCart = loadFromStorage('boutique-cart');
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
        renderCartItems();
    }
}

function addToCart(id, name, price, image = null) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1,
            image: image || getProductImage(id)
        });
    }
    
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast(`${name} ajouté au panier`, 'success');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast('Produit retiré du panier', 'error');
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCartToStorage();
            updateCartCount();
            renderCartItems();
        }
    }
}

function saveCartToStorage() {
    saveToStorage('boutique-cart', cart);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Votre panier est vide</p>
            </div>
        `;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=100'">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')" title="Supprimer">
                    🗑️
                </button>
            </div>
        `).join('');
    }
    
    if (cartTotalElement) {
        cartTotalElement.textContent = formatPrice(getCartTotal());
    }
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar && cartOverlay) {
        const isActive = cartSidebar.classList.contains('active');
        
        if (isActive) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartItems();
        }
    }
}

function getProductImage(id) {
    const imageMap = {
        'dress-1': 'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=400',
        'bracelet-1': 'https://images.pexels.com/photos/1454243/pexels-photo-1454243.jpeg?auto=compress&cs=tinysrgb&w=400',
        'earrings-1': 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
        'cream-1': 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return imageMap[id] || 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400';
}

function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast('Panier vidé', 'success');
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Votre panier est vide', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.classList.add('modal', 'active');
    modal.id = 'checkout-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" onclick="closeCheckoutModal()">×</button>
            <h2>Finaliser votre commande</h2>
            <form id="checkout-form" class="booking-form">
                <div class="form-group">
                    <label for="client-name">Nom complet *</label>
                    <input type="text" id="client-name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="client-email">Email *</label>
                    <input type="email" id="client-email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="client-phone">Téléphone</label>
                    <input type="tel" id="client-phone" name="phone">
                </div>
                <button type="submit" class="cta-button">
                    <span class="btn-text">Confirmer la commande</span>
                    <span class="btn-loading" style="display: none;">Envoi en cours...</span>
                </button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateCheckoutForm(checkoutForm)) {
            submitCheckoutForm(checkoutForm);
        }
    });

    document.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCheckoutModal();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCheckoutModal();
        }
    });
}

function validateCheckoutForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    const errors = form.querySelectorAll('.form-error');
    errors.forEach(error => error.remove());

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'Ce champ est requis');
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            showFieldError(field, 'Veuillez entrer une adresse email valide');
            isValid = false;
        }
    });

    return isValid;
}

function submitCheckoutForm(form) {
    const submitButton = form.querySelector('.cta-button');
    const buttonText = submitButton.querySelector('.btn-text');
    const buttonLoading = submitButton.querySelector('.btn-loading');
    buttonText.style.display = 'none';
    buttonLoading.style.display = 'inline';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const orderData = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        items: cart,
        total: getCartTotal()
    };

    fetch('send_order.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            clearCart();
            toggleCart();
            closeCheckoutModal();
            showToast('Commande confirmée ! Nous vous contacterons bientôt.', 'success');
        } else {
            showToast(data.message || 'Erreur lors de l\'envoi de la commande.', 'error');
        }
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
    })
    .catch(error => {
        showToast('Erreur lors de l\'envoi de la commande. Veuillez réessayer.', 'error');
        console.error('Fetch error:', error);
        buttonText.style.display = 'inline';
        buttonLoading.style.display = 'none';
        submitButton.disabled = false;
    });
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();

    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }

    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartSidebar && cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
        closeCheckoutModal();
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(field, message) {
    const error = document.createElement('div');
    error.className = 'form-error';
    error.style.color = '#e74c3c';
    error.style.fontSize = '0.9rem';
    error.style.marginTop = 'var(--spacing-xs)';
    error.textContent = message;
    field.parentElement.appendChild(error);
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.top = '90px';
    toast.style.right = '20px';
    toast.style.padding = 'var(--spacing-sm) var(--spacing-md)';
    toast.style.background = type === 'success' ? '#27ae60' : '#e74c3c';
    toast.style.color = '#fff';
    toast.style.borderRadius = 'var(--border-radius)';
    toast.style.zIndex = '1001';
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatPrice(price) {
    return price.toFixed(2) + ' €';
}