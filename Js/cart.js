// Shopping Cart System for 360 Degree Hotel
// Maintains compatibility with existing HTML/CSS/JS structure

class HotelShoppingCart {
    constructor() {
        this.cart = [];
        this.isOpen = false;
        this.whatsappNumbers = {
            rooms: '2349156546479',
            food: '2349156546479',
            sports: '2349156546479',
            services: '2349156546479',
            nightclub: '2349156546479',
            pool: '2349156546479',
            gateTickets: '2349156546479'
        };

        this.init();
    }

    init() {
        this.loadCart();
        this.createCartUI();
        this.bindEvents();
        this.updateCartButton();
        console.log('🛒 Shopping Cart System Initialized');
    }

    // Create Cart UI Elements
    createCartUI() {
        // Create cart button
        const cartButton = document.createElement('button');
        cartButton.id = 'cartButton';
        cartButton.className = 'cart-button';
        cartButton.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span id="cartBadge" class="cart-badge" style="display: none;">0</span>
        `;
        document.body.appendChild(cartButton);

        // Create cart modal
        const cartModal = document.createElement('div');
        cartModal.id = 'cartModal';
        cartModal.className = 'cart-modal';
        cartModal.innerHTML = `
            <div class="cart-content">
                <div class="cart-header">
                    <div class="cart-title">
                        <i class="fas fa-shopping-cart"></i>
                        <span>360° Global Estate Ltd. Cart</span>
                        <span id="cartItemCount" class="cart-badge" style="display: none;">0</span>
                    </div>
                    <button id="cartClose" class="cart-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="cart-body" id="cartBody">
                    <!-- Cart items will be inserted here -->
                </div>
                <div class="cart-footer" id="cartFooter" style="display: none;">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span id="cartTotalAmount" class="cart-total-amount">₦0</span>
                    </div>
                    <div class="cart-actions">
                        <button id="cartClear" class="cart-clear">
                            <i class="fas fa-trash"></i> Clear Cart
                        </button>
                        <button id="cartCheckout" class="cart-checkout">
                            <i class="fab fa-whatsapp"></i> Checkout via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(cartModal);
    }

    // Bind Event Listeners
    bindEvents() {
        // Cart button click
        document.getElementById('cartButton').addEventListener('click', () => {
            this.openCart();
        });

        // Close cart
        document.getElementById('cartClose').addEventListener('click', () => {
            this.closeCart();
        });

        // Close cart when clicking outside
        document.getElementById('cartModal').addEventListener('click', (e) => {
            if (e.target.id === 'cartModal') {
                this.closeCart();
            }
        });

        // Clear cart
        document.getElementById('cartClear').addEventListener('click', () => {
            this.clearCart();
        });

        // Checkout
        document.getElementById('cartCheckout').addEventListener('click', () => {
            this.checkout();
        });

        // Add event listeners to existing booking buttons
        this.enhanceExistingButtons();
    }

    // Enhance existing booking buttons with cart functionality
    enhanceExistingButtons() {
        // Replace existing booking buttons with dual buttons
        const bookButtons = document.querySelectorAll('.book-btn, .order-btn');

        bookButtons.forEach(button => {
            // Create dual button container
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'dual-button-container';

            // Create Order Now button (preserves original functionality)
            const orderNowBtn = document.createElement('button');
            orderNowBtn.className = 'order-now-btn';
            orderNowBtn.innerHTML = `
                <i class="fas fa-bolt"></i>
                <span>Order Now</span>
            `;

            // Create Add to Cart button
            const addToCartBtn = document.createElement('button');
            addToCartBtn.className = 'add-to-cart-btn';
            addToCartBtn.innerHTML = `
                <i class="fas fa-cart-plus"></i>
                <span>Add to Cart</span>
            `;

            // Get service details from the button's context
            const serviceCard = button.closest('.room-card, .food-card, .sport-card, .service-card, .nightclub-card, .amenity-card, .gate-ticket-card');
            if (serviceCard) {
                const serviceData = this.extractServiceData(serviceCard, button);

                // Order Now button - preserves original modal functionality
                orderNowBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleOrderNow(serviceData, button);
                });

                // Add to Cart button
                addToCartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addToCart(serviceData);
                });

                // Add both buttons to container
                buttonContainer.appendChild(orderNowBtn);
                buttonContainer.appendChild(addToCartBtn);

                // Replace the original button with dual button container
                button.parentNode.replaceChild(buttonContainer, button);
            }
        });
    }

    // Handle Order Now functionality (preserves original modal behavior)
    handleOrderNow(serviceData, originalButton) {
        // Get the original onclick function and execute it
        const onclickAttr = originalButton.getAttribute('onclick');
        if (onclickAttr) {
            try {
                // Execute the original onclick function
                eval(onclickAttr);
            } catch (error) {
                console.error('Error executing original onclick:', error);
                // Fallback: show a simple booking message
                this.showNotification(`Opening booking for ${serviceData.name}...`, 'info');
            }
        } else {
            // Fallback: open a simple booking modal or redirect to WhatsApp
            this.handleDirectBooking(serviceData);
        }
    }

    // Handle direct booking for services without modal
    handleDirectBooking(serviceData) {
        const message = this.generateSingleServiceMessage(serviceData);
        const phoneNumber = this.whatsappNumbers[serviceData.type] || this.whatsappNumbers.rooms;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
        this.showNotification(`Redirecting to WhatsApp for ${serviceData.name}...`, 'success');
    }

    // Generate message for single service booking
    generateSingleServiceMessage(serviceData) {
        let message = `🏨 *360 DEGREE HOTEL - SINGLE SERVICE BOOKING*\n\n`;
        message += `📋 *Service Details:*\n`;
        message += `Service: ${serviceData.name}\n`;
        message += `Price: ₦${serviceData.price.toLocaleString()}\n`;
        message += `Type: ${serviceData.type}\n\n`;

        message += `💳 *Payment Details:*\n`;
        message += `Bank: UBA\n`;
        message += `Account Name: 360 degree global estate ltd\n`;
        message += `Account Number: 1025588876\n`;
        message += `Sort Code: 011\n\n`;

        message += `📋 *Instructions:*\n`;
        message += `Please make payment and send receipt via WhatsApp to confirm your booking.\n\n`;
        message += `Thank you for choosing 360 Degree Hotel!`;

        return message;
    }

    // Extract service data from card elements
    extractServiceData(card, button) {
        const nameElement = card.querySelector('h3');
        const priceElement = card.querySelector('.price');
        const descElement = card.querySelector('p');

        let serviceName = nameElement ? nameElement.textContent.trim() : 'Unknown Service';
        let price = 0;
        let serviceType = 'service';

        // Extract price
        if (priceElement) {
            const priceText = priceElement.textContent.replace(/[^\d]/g, '');
            price = parseInt(priceText) || 0;
        }

        // Determine service type from card class or button onclick
        if (card.classList.contains('room-card')) serviceType = 'rooms';
        else if (card.classList.contains('food-card')) serviceType = 'food';
        else if (card.classList.contains('sport-card')) serviceType = 'sports';
        else if (card.classList.contains('service-card')) serviceType = 'services';
        else if (card.classList.contains('nightclub-card')) serviceType = 'nightclub';
        else if (card.classList.contains('amenity-card')) serviceType = 'pool';
        else if (card.classList.contains('gate-ticket-card')) serviceType = 'gateTickets';

        // Try to extract from button onclick if available
        const onclickAttr = button.getAttribute('onclick');
        if (onclickAttr) {
            if (onclickAttr.includes('openBookingModal')) serviceType = 'rooms';
            else if (onclickAttr.includes('openFoodModal')) serviceType = 'food';
            else if (onclickAttr.includes('openSportsModal')) serviceType = 'sports';
            else if (onclickAttr.includes('openServiceModal')) serviceType = 'services';
            else if (onclickAttr.includes('openNightclubModal')) serviceType = 'nightclub';
            else if (onclickAttr.includes('openPoolModal')) serviceType = 'pool';
            else if (onclickAttr.includes('openGateTicketModal')) serviceType = 'gateTickets';
        }

        return {
            id: `${serviceType}-${serviceName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
            type: serviceType,
            name: serviceName,
            price: price,
            description: descElement ? descElement.textContent.trim() : '',
            quantity: 1,
            addedAt: new Date().toISOString()
        };
    }

    // Add item to cart
    addToCart(item) {
        // Check if item already exists
        const existingItemIndex = this.cart.findIndex(cartItem =>
            cartItem.type === item.type &&
            cartItem.name === item.name
        );

        if (existingItemIndex >= 0) {
            // Increase quantity
            this.cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item
            this.cart.push(item);
        }

        this.saveCart();
        this.updateCartButton();
        this.showNotification(`${item.name} added to cart!`);

        // Add visual feedback to button
        this.animateAddToCart(event.target);

        console.log('🛒 Item added to cart:', item);
    }

    // Remove item from cart
    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.updateCartButton();
        this.renderCart();
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            this.renderCart();
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartButton();
            this.renderCart();
            this.showNotification('Cart cleared!', 'info');
        }
    }

    // Open cart modal
    openCart() {
        this.isOpen = true;
        document.getElementById('cartModal').classList.add('active');
        this.renderCart();
        document.body.style.overflow = 'hidden';
    }

    // Close cart modal
    closeCart() {
        this.isOpen = false;
        document.getElementById('cartModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    // Render cart contents
    renderCart() {
        const cartBody = document.getElementById('cartBody');
        const cartFooter = document.getElementById('cartFooter');
        const cartItemCount = document.getElementById('cartItemCount');

        if (this.cart.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some services to get started!</p>
                </div>
            `;
            cartFooter.style.display = 'none';
            cartItemCount.style.display = 'none';
        } else {
            cartBody.innerHTML = `
                <div class="cart-items">
                    ${this.cart.map(item => this.renderCartItem(item)).join('')}
                </div>
            `;
            cartFooter.style.display = 'block';
            cartItemCount.style.display = 'block';
            cartItemCount.textContent = this.getTotalItems();

            this.updateCartTotal();
            this.bindCartItemEvents();
        }
    }

    // Render individual cart item
    renderCartItem(item) {
        const icon = this.getServiceIcon(item.type);
        return `
            <div class="cart-item" data-item-id="${item.id}">
                <div class="cart-item-icon service-icon-${item.type}">
                    ${icon}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₦${item.price.toLocaleString()} each</div>
                    <div class="cart-item-meta">${item.description.substring(0, 50)}...</div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn quantity-decrease" data-item-id="${item.id}">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn quantity-increase" data-item-id="${item.id}">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <button class="remove-item" data-item-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }

    // Bind events for cart item controls
    bindCartItemEvents() {
        // Quantity controls
        document.querySelectorAll('.quantity-decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                const item = this.cart.find(item => item.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.quantity-increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                const item = this.cart.find(item => item.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('button').dataset.itemId;
                this.removeFromCart(itemId);
            });
        });
    }

    // Update cart button badge
    updateCartButton() {
        const badge = document.getElementById('cartBadge');
        const totalItems = this.getTotalItems();

        if (totalItems > 0) {
            badge.style.display = 'block';
            badge.textContent = totalItems > 99 ? '99+' : totalItems;
        } else {
            badge.style.display = 'none';
        }
    }

    // Update cart total
    updateCartTotal() {
        const totalAmount = this.getTotalPrice();
        const cartFooter = document.getElementById('cartFooter');

        // Update existing total or create new footer content
        cartFooter.innerHTML = `
            <div class="customer-details">
                <h4><i class="fas fa-user"></i> Customer Details</h4>
                <div class="customer-form">
                    <input type="text" id="cartCustomerName" placeholder="Full Name" required>
                    <input type="tel" id="cartCustomerPhone" placeholder="Phone Number" required>
                </div>
            </div>
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotalAmount" class="cart-total-amount">₦${totalAmount.toLocaleString()}</span>
            </div>
            <div class="cart-actions">
                <button id="cartClear" class="cart-clear">
                    <i class="fas fa-trash"></i> Clear Cart
                </button>
                <button id="cartCheckout" class="cart-checkout">
                    <i class="fab fa-whatsapp"></i> Checkout via WhatsApp
                </button>
            </div>
        `;

        // Re-bind events after updating HTML
        this.bindFooterEvents();
    }

    // Bind footer events
    bindFooterEvents() {
        // Clear cart
        const clearBtn = document.getElementById('cartClear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Checkout
        const checkoutBtn = document.getElementById('cartCheckout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }
    }

    // Get total items count
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Get total price
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Checkout via WhatsApp
    async checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        // Validate customer details
        const customerName = document.getElementById('cartCustomerName')?.value.trim();
        const customerPhone = document.getElementById('cartCustomerPhone')?.value.trim();

        if (!customerName || !customerPhone) {
            this.showNotification('Please fill in your name and phone number', 'error');
            return;
        }
        const checkoutBtn = document.getElementById('cartCheckout');
        checkoutBtn.classList.add('loading');
        checkoutBtn.innerHTML = `
            <div class="loading-spinner"></div>
            Processing...
        `;

        const newAmount = this.getTotalPrice();
        const stringAmount = newAmount.toLocaleString();
        // console.log('====================================');
        // console.log(stringAmount);
        // console.log('====================================');

        try {

            const cartData = {
                customer: customerName,
                phone: customerPhone,
                services: [...this.cart],
                amount: `${stringAmount}`,
                date: new Date().toISOString(),
                status: "pending",
                details: { note: "Deliver before 9AM" },
                service: 'multiple services'
            };


            const res = await fetch('https://three60hotel.onrender.com/api/carts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cartData)
            });



            // Generate WhatsApp message
            const message = this.generateWhatsAppMessage(customerName, customerPhone);

            // Get WhatsApp number (using the first service type's number)
            const phoneNumber = this.whatsappNumbers[this.cart[0].type] || this.whatsappNumbers.rooms;

            // Create WhatsApp URL
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Show success message
            this.showNotification('Redirecting to WhatsApp...', 'success');
            console.log(this.cart)
            // Clear cart after successful checkout
            setTimeout(() => {
                this.clearCart();
                this.closeCart();
            }, 2000);

        } catch (error) {
            console.error('Checkout error:', error);
            this.showNotification('Checkout failed. Please try again.', 'error');
        } finally {
            // Reset button
            setTimeout(() => {
                checkoutBtn.classList.remove('loading');
                checkoutBtn.innerHTML = `
                    <i class="fab fa-whatsapp"></i> Checkout via WhatsApp
                `;
            }, 1000);
        }
    }

    // Generate WhatsApp message
    generateWhatsAppMessage() {
        const totalAmount = this.getTotalPrice();
        const totalItems = this.getTotalItems();

        let message = `🛒 *360 DEGREE HOTEL - MULTIPLE SERVICES ORDER*\n\n`;
        message += `📋 *Order Summary:*\n`;
        message += `Total Items: ${totalItems}\n`;
        message += `Total Amount: ₦${totalAmount.toLocaleString()}\n\n`;

        message += `🛍️ *Items Ordered:*\n`;
        this.cart.forEach((item, index) => {
            message += `${index + 1}. ${item.name}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Unit Price: ₦${item.price.toLocaleString()}\n`;
            message += `   Subtotal: ₦${(item.price * item.quantity).toLocaleString()}\n\n`;
        });

        message += `💳 *Payment Details:*\n`;
        message += `Bank: UBA\n`;
        message += `Account Name: 360 degree global estate ltd\n`;
        message += `Account Number: 1025588876\n`;
        message += `Sort Code: 011\n\n`;

        message += `📋 *Instructions:*\n`;
        message += `Please make payment and send receipt via WhatsApp to confirm your order.\n\n`;
        message += `Thank you for choosing 360 Degree Hotel!`;

        return message;
    }

    // Get service icon
    getServiceIcon(type) {
        const icons = {
            rooms: '<i class="fas fa-bed"></i>',
            food: '<i class="fas fa-utensils"></i>',
            sports: '<i class="fas fa-futbol"></i>',
            services: '<i class="fas fa-concierge-bell"></i>',
            nightclub: '<i class="fas fa-music"></i>',
            pool: '<i class="fas fa-swimming-pool"></i>',
            gateTickets: '<i class="fas fa-ticket-alt"></i>'
        };
        return icons[type] || '<i class="fas fa-shopping-bag"></i>';
    }

    // Show notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `cart-notification ${type}`;

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';

        notification.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Animate add to cart button
    animateAddToCart(button) {
        button.classList.add('adding');
        button.innerHTML = `
            <div class="loading-spinner"></div>
            <span>ADDING</span>
        `;

        setTimeout(() => {
            button.classList.remove('adding');
            button.classList.add('success');
            button.innerHTML = `
                <i class="fas fa-check"></i>
                <span>ADDED</span>
            `;

            setTimeout(() => {
                button.classList.remove('success');
                button.innerHTML = `
                    <i class="fas fa-cart-plus"></i>
                    <span>ADD CART</span>
                `;
            }, 1200);
        }, 1000);
    }

    // Save cart to localStorage
    saveCart() {
        try {
            localStorage.setItem('hotel_cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    }

    // Load cart from localStorage
    loadCart() {
        try {
            const savedCart = localStorage.getItem('hotel_cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            this.cart = [];
        }
    }
}

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Wait a bit for the existing script to load
    setTimeout(() => {
        window.hotelCart = new HotelShoppingCart();
    }, 1000);
});

// Export for global access
window.HotelShoppingCart = HotelShoppingCart;