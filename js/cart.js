// Shopping cart functionality
let cart = [];

// Load cart from localStorage on page load
function loadCartFromStorage() {
    const savedCart = loadFromStorage('boutique-cart');
    if (savedCart) {
        cart = savedCart;
        updateCartCount();
        renderCartItems();
    }
}

// Add item to cart
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
    showToast(`${name} ajouté au panier`);
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast('Produit retiré du panier', 'error');
}

// Update item quantity
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

// Save cart to localStorage
function saveCartToStorage() {
    saveToStorage('boutique-cart', cart);
}

// Update cart count in navigation
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.textContent = totalItems;
        cartCountElement.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Calculate cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Render cart items in sidebar
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

// Toggle cart sidebar
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

// Get product image by ID
function getProductImage(id) {
    const imageMap = {
        'dress-1': 'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&w=400',
        'bracelet-1': 'https://images.pexels.com/photos/1454243/pexels-photo-1454243.jpeg?auto=compress&cs=tinysrgb&w=400',
        'earrings-1': 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400',
        'cream-1': 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    
    return imageMap[id] || 'https://images.pexels.com/photos/1191531/pexels-photo-1191531.jpeg?auto=compress&cs=tinysrgb&w=400';
}

// Clear entire cart
function clearCart() {
    cart = [];
    saveCartToStorage();
    updateCartCount();
    renderCartItems();
    showToast('Panier vidé');
}

// Checkout functionality
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Votre panier est vide', 'error');
        return;
    }
    
    // Here you would typically integrate with a payment processor
    // For this demo, we'll just show a success message
    const total = getCartTotal();
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    showToast(`Commande confirmée ! Total: ${formatPrice(total)} pour ${itemCount} article(s)`);
    
    // Clear cart after successful checkout
    setTimeout(() => {
        clearCart();
        toggleCart();
    }, 2000);
}

// Initialize checkout button
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
});

// Close cart with escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cart-sidebar');
        if (cartSidebar && cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});