// 360 Degree Hotel booking system JavaScript with Image Gallery and Gate Tickets

// Global variables
let currentBookingType = '';
let currentPrice = 0;

// Gallery management
const galleries = {};
const autoSlideIntervals = {};

// WhatsApp numbers for different services
const whatsappNumbers = {
    rooms: '2349163161616',        // Room bookings
    food: '2349163161616',         // Food orders
    sports: '2349163161616',       // Sports & Entertainment
    services: '2349163161616',     // Event Hall, Salon, Bar
    nightclub: '2349163161616',    // Nightclub & Pool
    pool: '2349163161616',         // Pool (same as nightclub)
    gateTickets: '2349163161616'   // Gate tickets
};

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
}

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth'
        });
    }
}

// Image Gallery Functions
function initializeGalleries() {
    console.log('🖼️ Initializing image galleries...');
    
    const galleryElements = document.querySelectorAll('.image-gallery');
    
    galleryElements.forEach(gallery => {
        const galleryId = gallery.getAttribute('data-gallery');
        const images = gallery.querySelectorAll('.gallery-image');
        const dots = gallery.querySelectorAll('.dot');
        const currentSlideSpan = gallery.querySelector('.current-slide');
        const totalSlidesSpan = gallery.querySelector('.total-slides');
        const descriptionElement = gallery.querySelector('.description-text');
        
        if (galleryId && images.length > 0) {
            galleries[galleryId] = {
                currentIndex: 0,
                totalImages: images.length,
                images: images,
                dots: dots,
                currentSlideSpan: currentSlideSpan,
                totalSlidesSpan: totalSlidesSpan,
                descriptionElement: descriptionElement,
                gallery: gallery
            };
            
            // Set total slides
            if (totalSlidesSpan) {
                totalSlidesSpan.textContent = images.length;
            }
            
            // Set initial description
            updateImageDescription(galleryId);
            
            // Start auto-slide for this gallery
            startAutoSlide(galleryId);
            
            console.log(`✅ Gallery "${galleryId}" initialized with ${images.length} images`);
        }
    });
    
    console.log(`🎯 Total galleries initialized: ${Object.keys(galleries).length}`);
}

function updateImageDescription(galleryId) {
    if (!galleries[galleryId]) return;
    
    const gallery = galleries[galleryId];
    const currentImage = gallery.images[gallery.currentIndex];
    const description = currentImage.getAttribute('data-description');
    
    if (gallery.descriptionElement && description) {
        gallery.descriptionElement.textContent = description;
    }
}

function changeImage(galleryId, direction) {
    if (!galleries[galleryId]) return;
    
    const gallery = galleries[galleryId];
    
    // Remove active class from current image and dot
    gallery.images[gallery.currentIndex].classList.remove('active');
    if (gallery.dots[gallery.currentIndex]) {
        gallery.dots[gallery.currentIndex].classList.remove('active');
    }
    
    // Calculate new index
    gallery.currentIndex += direction;
    
    // Handle wrap around
    if (gallery.currentIndex >= gallery.totalImages) {
        gallery.currentIndex = 0;
    } else if (gallery.currentIndex < 0) {
        gallery.currentIndex = gallery.totalImages - 1;
    }
    
    // Add active class to new image and dot
    gallery.images[gallery.currentIndex].classList.add('active');
    if (gallery.dots[gallery.currentIndex]) {
        gallery.dots[gallery.currentIndex].classList.add('active');
    }
    
    // Update counter
    if (gallery.currentSlideSpan) {
        gallery.currentSlideSpan.textContent = gallery.currentIndex + 1;
    }
    
    // Update description
    updateImageDescription(galleryId);
    
    // Restart auto-slide
    restartAutoSlide(galleryId);
}

function currentImage(galleryId, imageIndex) {
    if (!galleries[galleryId]) return;
    
    const gallery = galleries[galleryId];
    const newIndex = imageIndex - 1; // Convert to 0-based index
    
    if (newIndex >= 0 && newIndex < gallery.totalImages) {
        // Remove active class from current image and dot
        gallery.images[gallery.currentIndex].classList.remove('active');
        if (gallery.dots[gallery.currentIndex]) {
            gallery.dots[gallery.currentIndex].classList.remove('active');
        }
        
        // Set new index
        gallery.currentIndex = newIndex;
        
        // Add active class to new image and dot
        gallery.images[gallery.currentIndex].classList.add('active');
        if (gallery.dots[gallery.currentIndex]) {
            gallery.dots[gallery.currentIndex].classList.add('active');
        }
        
        // Update counter
        if (gallery.currentSlideSpan) {
            gallery.currentSlideSpan.textContent = gallery.currentIndex + 1;
        }
        
        // Update description
        updateImageDescription(galleryId);
        
        // Restart auto-slide
        restartAutoSlide(galleryId);
    }
}

function startAutoSlide(galleryId) {
    if (!galleries[galleryId]) return;
    
    // Clear existing interval if any
    if (autoSlideIntervals[galleryId]) {
        clearInterval(autoSlideIntervals[galleryId]);
    }
    
    // Start new interval (change image every 3 seconds)
    autoSlideIntervals[galleryId] = setInterval(() => {
        changeImage(galleryId, 1);
    }, 3000);
}

function restartAutoSlide(galleryId) {
    startAutoSlide(galleryId);
}

function pauseAutoSlide(galleryId) {
    if (autoSlideIntervals[galleryId]) {
        clearInterval(autoSlideIntervals[galleryId]);
    }
}

function resumeAutoSlide(galleryId) {
    startAutoSlide(galleryId);
}

// Google Maps Direction Function
function openDirections() {
    const hotelAddress = "360Degree Global Estate Second gate Nassarawa State university keffi, Behind Princess Sarah Hotel";
    const encodedAddress = encodeURIComponent(hotelAddress);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

// Modal functions
function openBookingModal(roomType, price) {
    console.log('Opening room booking modal:', roomType, price);
    currentBookingType = 'room';
    currentPrice = price;
    const roomTypeInput = document.getElementById('roomType');
    if (roomTypeInput) {
        roomTypeInput.value = roomType;
    }
    const modal = document.getElementById('bookingModal');
    if (modal) {
        modal.style.display = 'block';
        calculateRoomTotal();
    }
}

function openFoodModal(foodItem, price) {
    console.log('Opening food modal:', foodItem, price);
    currentBookingType = 'food';
    currentPrice = price;
    const foodItemInput = document.getElementById('foodItem');
    if (foodItemInput) {
        foodItemInput.value = foodItem;
    }
    const modal = document.getElementById('foodModal');
    if (modal) {
        modal.style.display = 'block';
        calculateFoodTotal();
    }
}

function openGateTicketModal(ticketType, price, accessType) {
    console.log('Opening gate ticket modal:', ticketType, price, accessType);
    currentBookingType = 'gateTicket';
    currentPrice = price;
    const ticketTypeInput = document.getElementById('gateTicketType');
    if (ticketTypeInput) {
        ticketTypeInput.value = ticketType;
    }
    const modal = document.getElementById('gateTicketModal');
    if (modal) {
        modal.style.display = 'block';
        calculateGateTicketTotal();
    }
}

function openSportsModal(activity, price) {
    console.log('Opening sports modal:', activity, price);
    currentBookingType = 'sports';
    currentPrice = price;
    const activityInput = document.getElementById('sportsActivity');
    if (activityInput) {
        activityInput.value = activity;
    }
    const modal = document.getElementById('sportsModal');
    if (modal) {
        modal.style.display = 'block';
        calculateSportsTotal();
    }
}

function openServiceModal(service, price) {
    console.log('Opening service modal:', service, price);
    currentBookingType = 'service';
    currentPrice = price;
    const serviceInput = document.getElementById('serviceType');
    if (serviceInput) {
        serviceInput.value = service;
    }
    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.style.display = 'block';
        
        // Update duration label based on service type
        const durationLabel = document.getElementById('durationLabel');
        if (durationLabel) {
            if (service === 'Event Center Hall') {
                durationLabel.textContent = 'days';
            } else if (service === 'Salon (Unisex)') {
                durationLabel.textContent = 'sessions';
            } else if (service === 'Premium Bar') {
                durationLabel.textContent = 'hours';
            }
        }
        
        calculateServiceTotal();
    }
}

function openNightclubModal(service, price) {
    console.log('Opening nightclub modal:', service, price);
    currentBookingType = 'nightclub';
    currentPrice = price;
    const serviceInput = document.getElementById('nightclubService');
    if (serviceInput) {
        serviceInput.value = service;
    }
    const modal = document.getElementById('nightclubModal');
    if (modal) {
        modal.style.display = 'block';
        calculateNightclubTotal();
    }
}

function openPoolModal(service, price) {
    console.log('Opening pool modal:', service, price);
    currentBookingType = 'pool';
    currentPrice = price;
    const serviceInput = document.getElementById('poolService');
    if (serviceInput) {
        serviceInput.value = service;
    }
    const modal = document.getElementById('poolModal');
    if (modal) {
        modal.style.display = 'block';
        calculatePoolTotal();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modals = ['bookingModal', 'foodModal', 'gateTicketModal', 'sportsModal', 'serviceModal', 'nightclubModal', 'poolModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal && event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Calculate totals
function calculateRoomTotal() {
    const nightsInput = document.getElementById('nights');
    const totalPriceElement = document.getElementById('totalPrice');
    if (nightsInput && totalPriceElement) {
        const nights = nightsInput.value || 1;
        const total = currentPrice * nights;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculateFoodTotal() {
    const quantityInput = document.getElementById('foodQuantity');
    const totalPriceElement = document.getElementById('foodTotalPrice');
    if (quantityInput && totalPriceElement) {
        const quantity = quantityInput.value || 1;
        const total = currentPrice * quantity;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculateGateTicketTotal() {
    const daysInput = document.getElementById('gateTicketDays');
    const peopleInput = document.getElementById('gateTicketPeople');
    const totalPriceElement = document.getElementById('gateTicketTotalPrice');
    if (daysInput && peopleInput && totalPriceElement) {
        const days = daysInput.value || 1;
        const people = peopleInput.value || 1;
        const total = currentPrice * days * people;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculateSportsTotal() {
    const quantityInput = document.getElementById('sportsQuantity');
    const totalPriceElement = document.getElementById('sportsTotalPrice');
    if (quantityInput && totalPriceElement) {
        const quantity = quantityInput.value || 1;
        const total = currentPrice * quantity;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculateServiceTotal() {
    const durationInput = document.getElementById('serviceDuration');
    const peopleInput = document.getElementById('servicePeople');
    const serviceTypeInput = document.getElementById('serviceType');
    const totalPriceElement = document.getElementById('serviceTotalPrice');
    
    if (durationInput && peopleInput && serviceTypeInput && totalPriceElement) {
        const duration = durationInput.value || 1;
        const people = peopleInput.value || 1;
        const service = serviceTypeInput.value;
        
        let total;
        if (service === 'Event Center Hall') {
            // Event hall is per day, not per person
            total = currentPrice * duration;
        } else {
            // Salon and Bar are per person
            total = currentPrice * duration * people;
        }
        
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculateNightclubTotal() {
    const peopleInput = document.getElementById('nightclubPeople');
    const totalPriceElement = document.getElementById('nightclubTotalPrice');
    if (peopleInput && totalPriceElement) {
        const people = peopleInput.value || 1;
        const total = currentPrice * people;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

function calculatePoolTotal() {
    const daysInput = document.getElementById('poolDays');
    const peopleInput = document.getElementById('poolPeople');
    const totalPriceElement = document.getElementById('poolTotalPrice');
    if (daysInput && peopleInput && totalPriceElement) {
        const days = daysInput.value || 1;
        const people = peopleInput.value || 1;
        const total = currentPrice * days * people;
        totalPriceElement.textContent = total.toLocaleString();
    }
}

// Event listeners for quantity changes
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, setting up ALL event listeners...');
    
    // Initialize image galleries first
    initializeGalleries();
    
    // Add hover pause/resume for galleries
    Object.keys(galleries).forEach(galleryId => {
        const gallery = galleries[galleryId].gallery;
        
        gallery.addEventListener('mouseenter', () => {
            pauseAutoSlide(galleryId);
        });
        
        gallery.addEventListener('mouseleave', () => {
            resumeAutoSlide(galleryId);
        });
    });
    
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

    // Gate ticket listeners
    const gateTicketDaysInput = document.getElementById('gateTicketDays');
    const gateTicketPeopleInput = document.getElementById('gateTicketPeople');
    if (gateTicketDaysInput) {
        gateTicketDaysInput.addEventListener('input', calculateGateTicketTotal);
    }
    if (gateTicketPeopleInput) {
        gateTicketPeopleInput.addEventListener('input', calculateGateTicketTotal);
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
    
    // Set minimum date to today for all date inputs
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.min = today;
    });
});

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

    // Gate ticket form
    const gateTicketForm = document.getElementById('gateTicketForm');
    if (gateTicketForm) {
        gateTicketForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleGateTicketPurchase();
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

function handleGateTicketPurchase() {
    const ticketType = document.getElementById('gateTicketType').value;
    const days = document.getElementById('gateTicketDays').value;
    const people = document.getElementById('gateTicketPeople').value;
    const date = document.getElementById('gateTicketDate').value;
    const guestName = document.getElementById('gateTicketGuestName').value;
    const guestPhone = document.getElementById('gateTicketGuestPhone').value;
    const requirements = document.getElementById('gateTicketRequirements').value;
    const total = document.getElementById('gateTicketTotalPrice').textContent;

    const message = `🎫 *360 DEGREE HOTEL - GATE ENTRY TICKET*

👤 *Customer Details:*
Name: ${guestName}
Phone: ${guestPhone}

🎯 *Ticket Details:*
Ticket Type: ${ticketType}
Number of Days: ${days}
Number of People: ${people}
Entry Date: ${date}
Special Requirements: ${requirements || 'None'}

💰 *Total Amount: ₦${total}*

💳 *Payment Details:*
Bank: First Bank Nigeria
Account Name: 360 Degree Hotel Ltd
Account Number: 3014567890
Sort Code: 011

📋 *Instructions:*
Please make payment and send receipt via WhatsApp to receive your gate entry ticket.

⚠️ *Important:* Keep your gate ticket receipt as proof of entry to the hotel premises.

Thank you for choosing 360 Degree Hotel!`;

    sendToWhatsApp(message, 'gateTickets');
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
Please make payment and send receipt via WhatsApp to receive your booking confirmation.

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
    const modals = ['bookingModal', 'foodModal', 'gateTicketModal', 'sportsModal', 'serviceModal', 'nightclubModal', 'poolModal'];
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
    
    // Show success message with service-specific info
    showSuccessMessage(serviceType);
}

function showSuccessMessage(serviceType) {
    const serviceNames = {
        rooms: 'Room Booking',
        food: 'Food Order',
        gateTickets: 'Gate Entry Ticket Purchase',
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

// Enhanced Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
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
    const cards = document.querySelectorAll('.room-card, .food-card, .sport-card, .service-card, .nightclub-card, .amenity-card, .gate-ticket-card');
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

// Handle form validation
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = '#e0e0e0';
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});

// Enhanced accessibility for mobile
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard support for gallery navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeGallery = document.querySelector('.image-gallery:hover');
            if (activeGallery) {
                const galleryId = activeGallery.getAttribute('data-gallery');
                if (galleryId) {
                    const direction = e.key === 'ArrowLeft' ? -1 : 1;
                    changeImage(galleryId, direction);
                }
            }
        }
        
        // Close modals with Escape key
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="block"]');
            if (openModal) {
                openModal.style.display = 'none';
            }
        }
    });
    
    // Add touch support for gallery navigation
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleGallerySwipe(e.target);
    });
    
    function handleGallerySwipe(target) {
        const gallery = target.closest('.image-gallery');
        if (!gallery) return;
        
        const galleryId = gallery.getAttribute('data-gallery');
        if (!galleryId) return;
        
        const swipeDistance = touchEndX - touchStartX;
        const minSwipeDistance = 50;
        
        if (Math.abs(swipeDistance) > minSwipeDistance) {
            const direction = swipeDistance > 0 ? -1 : 1;
            changeImage(galleryId, direction);
        }
    }
});