// 360 Degree Hotel booking system JavaScript

// Global variables
let currentBookingType = '';
let currentPrice = 0;

// WhatsApp numbers for different services
const whatsappNumbers = {
    rooms: '2349163161616',        // Room bookings
    food: '2349163161617',         // Food orders
    sports: '2349163161618',       // Sports & Entertainment
    services: '2349163161619',     // Event Hall, Salon, Bar
    nightclub: '2349163161620',    // Nightclub & Pool
    pool: '2349163161620'          // Pool (same as nightclub)
};

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Modal functions - USING EXACT SAME METHOD AS WORKING SECTIONS
function openBookingModal(roomType, price) {
    console.log('Opening room booking modal:', roomType, price);
    currentBookingType = 'room';
    currentPrice = price;
    document.getElementById('roomType').value = roomType;
    document.getElementById('bookingModal').style.display = 'block';
    calculateRoomTotal();
}

function openFoodModal(foodItem, price) {
    console.log('Opening food modal:', foodItem, price);
    currentBookingType = 'food';
    currentPrice = price;
    document.getElementById('foodItem').value = foodItem;
    document.getElementById('foodModal').style.display = 'block';
    calculateFoodTotal();
}

// FIXED: Using exact same pattern as food and room modals
function openSportsModal(activity, price) {
    console.log('🎯 SPORTS BUTTON CLICKED:', activity, 'Price:', price);
    currentBookingType = 'sports';
    currentPrice = price;
    document.getElementById('sportsActivity').value = activity;
    document.getElementById('sportsModal').style.display = 'block';
    calculateSportsTotal();
    console.log('✅ Sports modal should be visible now');
}

function openServiceModal(service, price) {
    console.log('Opening service modal:', service, price);
    currentBookingType = 'service';
    currentPrice = price;
    document.getElementById('serviceType').value = service;
    document.getElementById('serviceModal').style.display = 'block';
    
    // Update duration label based on service type
    const durationLabel = document.getElementById('durationLabel');
    if (service === 'Event Center Hall') {
        durationLabel.textContent = 'days';
    } else if (service === 'Salon (Unisex)') {
        durationLabel.textContent = 'sessions';
    } else if (service === 'Premium Bar') {
        durationLabel.textContent = 'hours';
    }
    
    calculateServiceTotal();
}

function openNightclubModal(service, price) {
    console.log('Opening nightclub modal:', service, price);
    currentBookingType = 'nightclub';
    currentPrice = price;
    document.getElementById('nightclubService').value = service;
    document.getElementById('nightclubModal').style.display = 'block';
    calculateNightclubTotal();
}

function openPoolModal(service, price) {
    console.log('Opening pool modal:', service, price);
    currentBookingType = 'pool';
    currentPrice = price;
    document.getElementById('poolService').value = service;
    document.getElementById('poolModal').style.display = 'block';
    calculatePoolTotal();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = ['bookingModal', 'foodModal', 'sportsModal', 'serviceModal', 'nightclubModal', 'poolModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Calculate totals
function calculateRoomTotal() {
    const nights = document.getElementById('nights').value || 1;
    const total = currentPrice * nights;
    document.getElementById('totalPrice').textContent = total.toLocaleString();
}

function calculateFoodTotal() {
    const quantity = document.getElementById('foodQuantity').value || 1;
    const total = currentPrice * quantity;
    document.getElementById('foodTotalPrice').textContent = total.toLocaleString();
}

function calculateSportsTotal() {
    const quantity = document.getElementById('sportsQuantity').value || 1;
    const total = currentPrice * quantity;
    document.getElementById('sportsTotalPrice').textContent = total.toLocaleString();
}

function calculateServiceTotal() {
    const duration = document.getElementById('serviceDuration').value || 1;
    const people = document.getElementById('servicePeople').value || 1;
    const service = document.getElementById('serviceType').value;
    
    let total;
    if (service === 'Event Center Hall') {
        // Event hall is per day, not per person
        total = currentPrice * duration;
    } else {
        // Salon and Bar are per person
        total = currentPrice * duration * people;
    }
    
    document.getElementById('serviceTotalPrice').textContent = total.toLocaleString();
}

function calculateNightclubTotal() {
    const people = document.getElementById('nightclubPeople').value || 1;
    const total = currentPrice * people;
    document.getElementById('nightclubTotalPrice').textContent = total.toLocaleString();
}

function calculatePoolTotal() {
    const days = document.getElementById('poolDays').value || 1;
    const people = document.getElementById('poolPeople').value || 1;
    const total = currentPrice * days * people;
    document.getElementById('poolTotalPrice').textContent = total.toLocaleString();
}

// Event listeners for quantity changes
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, setting up ALL event listeners...');
    
    // Room booking listeners
    const nightsInput = document.getElementById('nights');
    if (nightsInput) {
        nightsInput.addEventListener('input', calculateRoomTotal);
    }

    // Food ordering listeners
    const foodQuantityInput = document.getElementById('foodQuantity');
    if (foodQuantityInput) {
        foodQuantityInput.addEventListener('input', calculateFoodTotal);
    }

    // Sports booking listeners
    const sportsQuantityInput = document.getElementById('sportsQuantity');
    if (sportsQuantityInput) {
        sportsQuantityInput.addEventListener('input', calculateSportsTotal);
    }

    // Service booking listeners
    const serviceDurationInput = document.getElementById('serviceDuration');
    const servicePeopleInput = document.getElementById('servicePeople');
    if (serviceDurationInput) {
        serviceDurationInput.addEventListener('input', calculateServiceTotal);
    }
    if (servicePeopleInput) {
        servicePeopleInput.addEventListener('input', calculateServiceTotal);
    }

    // Nightclub booking listeners
    const nightclubPeopleInput = document.getElementById('nightclubPeople');
    if (nightclubPeopleInput) {
        nightclubPeopleInput.addEventListener('input', calculateNightclubTotal);
    }

    // Pool booking listeners
    const poolDaysInput = document.getElementById('poolDays');
    const poolPeopleInput = document.getElementById('poolPeople');
    if (poolDaysInput) {
        poolDaysInput.addEventListener('input', calculatePoolTotal);
    }
    if (poolPeopleInput) {
        poolPeopleInput.addEventListener('input', calculatePoolTotal);
    }

    // Form submissions
    setupFormSubmissions();
    
    // CRITICAL: Test all sports buttons immediately
    testSportsButtons();
});

// CRITICAL: Test function to verify sports buttons work
function testSportsButtons() {
    console.log('🔍 Testing all sports buttons...');
    
    // Find all sports buttons and test them
    const sportsSection = document.getElementById('sports');
    if (sportsSection) {
        const sportsButtons = sportsSection.querySelectorAll('.book-btn');
        console.log(`Found ${sportsButtons.length} sports buttons`);
        
        sportsButtons.forEach((button, index) => {
            console.log(`Button ${index + 1}:`, button.textContent, 'onclick:', button.getAttribute('onclick'));
        });
    } else {
        console.error('❌ Sports section not found!');
    }
    
    // Test if modal exists
    const sportsModal = document.getElementById('sportsModal');
    if (sportsModal) {
        console.log('✅ Sports modal found');
    } else {
        console.error('❌ Sports modal not found!');
    }
}

function setupFormSubmissions() {
    // Room booking form
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRoomBooking();
        });
    }

    // Food ordering form
    const foodForm = document.getElementById('foodForm');
    if (foodForm) {
        foodForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFoodOrder();
        });
    }

    // Sports booking form
    const sportsForm = document.getElementById('sportsForm');
    if (sportsForm) {
        sportsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleSportsBooking();
        });
    }

    // Service booking form
    const serviceForm = document.getElementById('serviceForm');
    if (serviceForm) {
        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleServiceBooking();
        });
    }

    // Nightclub booking form
    const nightclubForm = document.getElementById('nightclubForm');
    if (nightclubForm) {
        nightclubForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNightclubBooking();
        });
    }

    // Pool booking form
    const poolForm = document.getElementById('poolForm');
    if (poolForm) {
        poolForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePoolBooking();
        });
    }
}

// WhatsApp integration functions
function handleRoomBooking() {
    const roomType = document.getElementById('roomType').value;
    const nights = document.getElementById('nights').value;
    const checkinDate = document.getElementById('checkinDate').value;
    const checkoutDate = document.getElementById('checkoutDate').value;
    const guests = document.getElementById('guests').value;
    const guestName = document.getElementById('guestName').value;
    const guestPhone = document.getElementById('guestPhone').value;
    const total = document.getElementById('totalPrice').textContent;

    const message = `🏨 *360 DEGREE HOTEL - ROOM BOOKING*

👤 *Guest Details:*
Name: ${guestName}
Phone: ${guestPhone}

🛏️ *Booking Details:*
Room Type: ${roomType}
Number of Nights: ${nights}
Check-in Date: ${checkinDate}
Check-out Date: ${checkoutDate}
Number of Guests: ${guests}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to confirm your booking.

Thank you for choosing 360 Degree Hotel!`;

    sendToWhatsApp(message, 'rooms');
}

function handleFoodOrder() {
    const foodItem = document.getElementById('foodItem').value;
    const quantity = document.getElementById('foodQuantity').value;
    const instructions = document.getElementById('foodInstructions').value;
    const guestName = document.getElementById('foodGuestName').value;
    const roomNumber = document.getElementById('roomNumber').value;
    const guestPhone = document.getElementById('foodGuestPhone').value;
    const total = document.getElementById('foodTotalPrice').textContent;

    const message = `🍽️ *360 DEGREE HOTEL - FOOD ORDER*

👤 *Customer Details:*
Name: ${guestName}
Room Number: ${roomNumber}
Phone: ${guestPhone}

🥘 *Order Details:*
Food Item: ${foodItem}
Quantity: ${quantity}
Special Instructions: ${instructions || 'None'}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp. Your order will be prepared and delivered to your room.

Thank you for dining with us!`;

    sendToWhatsApp(message, 'food');
}

function handleSportsBooking() {
    const activity = document.getElementById('sportsActivity').value;
    const quantity = document.getElementById('sportsQuantity').value;
    const date = document.getElementById('sportsDate').value;
    const guestName = document.getElementById('sportsGuestName').value;
    const guestPhone = document.getElementById('sportsGuestPhone').value;
    const total = document.getElementById('sportsTotalPrice').textContent;

    const message = `⚽ *360 DEGREE HOTEL - SPORTS BOOKING*

👤 *Customer Details:*
Name: ${guestName}
Phone: ${guestPhone}

🎯 *Booking Details:*
Activity: ${activity}
Quantity: ${quantity}
Preferred Date: ${date}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to receive your tickets/access pass.

Thank you for choosing our sports services!`;

    sendToWhatsApp(message, 'sports');
}

function handleServiceBooking() {
    const service = document.getElementById('serviceType').value;
    const duration = document.getElementById('serviceDuration').value;
    const people = document.getElementById('servicePeople').value;
    const date = document.getElementById('serviceDate').value;
    const time = document.getElementById('serviceTime').value;
    const guestName = document.getElementById('serviceGuestName').value;
    const guestPhone = document.getElementById('serviceGuestPhone').value;
    const requirements = document.getElementById('serviceRequirements').value;
    const total = document.getElementById('serviceTotalPrice').textContent;

    let durationText = '';
    if (service === 'Event Center Hall') {
        durationText = `Duration: ${duration} day(s)`;
    } else if (service === 'Salon (Unisex)') {
        durationText = `Sessions: ${duration}`;
    } else if (service === 'Premium Bar') {
        durationText = `Hours: ${duration}`;
    }

    const message = `🏢 *360 DEGREE HOTEL - SERVICE BOOKING*

👤 *Customer Details:*
Name: ${guestName}
Phone: ${guestPhone}

🎯 *Booking Details:*
Service: ${service}
${durationText}
Number of People: ${people}
Preferred Date: ${date}
Preferred Time: ${time}
Special Requirements: ${requirements || 'None'}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to confirm your service booking.

Thank you for choosing our premium services!`;

    sendToWhatsApp(message, 'services');
}

function handleNightclubBooking() {
    const service = document.getElementById('nightclubService').value;
    const people = document.getElementById('nightclubPeople').value;
    const date = document.getElementById('nightclubDate').value;
    const time = document.getElementById('nightclubTime').value;
    const guestName = document.getElementById('nightclubGuestName').value;
    const guestPhone = document.getElementById('nightclubGuestPhone').value;
    const requests = document.getElementById('nightclubRequests').value;
    const total = document.getElementById('nightclubTotalPrice').textContent;

    const message = `🎉 *360 DEGREE HOTEL - NIGHTCLUB BOOKING*

👤 *Customer Details:*
Name: ${guestName}
Phone: ${guestPhone}

🎵 *Booking Details:*
Service: ${service}
Number of People: ${people}
Preferred Date: ${date}
Preferred Time: ${time}
Special Requests: ${requests || 'None'}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to confirm your nightclub reservation.

Thank you for choosing our nightclub services!`;

    sendToWhatsApp(message, 'nightclub');
}

function handlePoolBooking() {
    const service = document.getElementById('poolService').value;
    const days = document.getElementById('poolDays').value;
    const people = document.getElementById('poolPeople').value;
    const date = document.getElementById('poolDate').value;
    const guestName = document.getElementById('poolGuestName').value;
    const guestPhone = document.getElementById('poolGuestPhone').value;
    const total = document.getElementById('poolTotalPrice').textContent;

    const message = `🏊‍♂️ *360 DEGREE HOTEL - POOL ACCESS*

👤 *Customer Details:*
Name: ${guestName}
Phone: ${guestPhone}

🏊 *Booking Details:*
Service: ${service}
Number of Days: ${days}
Number of People: ${people}
Preferred Date: ${date}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to receive your pool access pass.

Thank you for choosing our pool facilities!`;

    sendToWhatsApp(message, 'pool');
}

function sendToWhatsApp(message, serviceType) {
    // Get the appropriate WhatsApp number for the service type
    const phoneNumber = whatsappNumbers[serviceType] || whatsappNumbers.rooms;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
    
    // Close the modal after sending
    const modals = ['bookingModal', 'foodModal', 'sportsModal', 'serviceModal', 'nightclubModal', 'poolModal'];
    modals.forEach(modalId => {
        document.getElementById(modalId).style.display = 'none';
    });
    
    // Show success message with service-specific info
    showSuccessMessage(serviceType);
}

function showSuccessMessage(serviceType) {
    const serviceNames = {
        rooms: 'Room Booking',
        food: 'Food Order',
        sports: 'Sports Booking',
        services: 'Service Booking',
        nightclub: 'Nightclub Booking',
        pool: 'Pool Booking'
    };

    // Create and show a success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #e74c3c, #c0392b);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 3000;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(231, 76, 60, 0.3);
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <i class="fas fa-check-circle" style="margin-right: 10px;"></i>
        ${serviceNames[serviceType]} - Redirecting to WhatsApp...
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.remove();
    }, 4000);
}

// Add CSS animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Set minimum date to today for all date inputs
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards for animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.room-card, .food-card, .sport-card, .service-card, .nightclub-card, .amenity-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add loading animation to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.book-btn, .order-btn, .cta-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const originalText = this.textContent;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
            }, 1000);
        });
    });
});