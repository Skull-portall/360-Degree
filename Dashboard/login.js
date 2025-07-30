// 360 Degree Hotel Management Login System

// Demo credentials (in production, this would be handled by a secure backend)
const DEMO_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};



async function fetchOrders(username, password) {
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        if (!response.ok) throw new Error('Failed to fetch orders');


        const data = await response.json();

        console.log('Orders fetched successfully:', data);
        return data;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return null;
    }
}
// Session management
const SESSION_KEY = 'hotel_admin_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Initialize login system
document.addEventListener('DOMContentLoaded', function () {
    console.log('🔐 Login system initialized');

    // Check if user is already logged in
    checkExistingSession();

    // Setup form submission
    setupLoginForm();

    // Setup password toggle
    setupPasswordToggle();

    // Setup form animations
    setupFormAnimations();

    // Setup all click handlers
    setupClickHandlers();

    // Add keyboard support
    setupKeyboardSupport();
});

function checkExistingSession() {
    const session = getSession();
    if (session && isSessionValid(session)) {
        console.log('✅ Valid session found, redirecting to dashboard');
        redirectToDashboard();
    } else {
        // Clear invalid session
        clearSession();
        console.log('🔄 No valid session, staying on login page');
    }
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log('📝 Form submitted');
            handleLogin();
        });
        console.log('✅ Login form event listener attached');
    } else {
        console.error('❌ Login form not found');
    }
}

function setupPasswordToggle() {
    // Make togglePassword globally available
    window.togglePassword = function () {
        console.log('👁️ Password toggle clicked');
        const passwordInput = document.getElementById('password');
        const toggleIcon = document.getElementById('passwordToggleIcon');

        if (passwordInput && toggleIcon) {
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.className = 'fas fa-eye-slash';
                console.log('👁️ Password shown');
            } else {
                passwordInput.type = 'password';
                toggleIcon.className = 'fas fa-eye';
                console.log('👁️ Password hidden');
            }
        } else {
            console.error('❌ Password input or toggle icon not found');
        }
    };

    // Also add click event listener
    const passwordToggle = document.querySelector('.password-toggle');
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            window.togglePassword();
        });
        console.log('✅ Password toggle event listener attached');
    }
}

function setupFormAnimations() {
    // Add focus animations to inputs
    const inputs = document.querySelectorAll('.input-container input');

    inputs.forEach((input, index) => {
        console.log(`🎯 Setting up input ${index + 1}: ${input.id}`);

        input.addEventListener('focus', function () {
            console.log(`🎯 Input focused: ${this.id}`);
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function () {
            console.log(`🎯 Input blurred: ${this.id}`);
            if (!this.value.trim()) {
                this.parentElement.classList.remove('focused');
            }
        });

        input.addEventListener('input', function () {
            console.log(`⌨️ Input changed: ${this.id} = ${this.value}`);
            if (this.value.trim()) {
                this.parentElement.classList.add('focused');
            } else {
                this.parentElement.classList.remove('focused');
            }
        });

        // Check if input has value on load
        if (input.value.trim()) {
            input.parentElement.classList.add('focused');
        }
    });

    console.log(`✅ Form animations setup for ${inputs.length} inputs`);
}

function setupClickHandlers() {
    // Remember me checkbox
    const rememberMeLabel = document.querySelector('.remember-me');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (rememberMeLabel && rememberMeCheckbox) {
        rememberMeLabel.addEventListener('click', function (e) {
            e.preventDefault();
            rememberMeCheckbox.checked = !rememberMeCheckbox.checked;
            console.log('☑️ Remember me toggled:', rememberMeCheckbox.checked);
        });
        console.log('✅ Remember me click handler attached');
    }

    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-passwor');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function (e) {
            e.preventDefault();
            showToast('Password reset feature coming soon!', 'info');
            console.log('🔗 Forgot password clicked');
        });
        console.log('✅ Forgot password click handler attached');
    }

    // Support link
    const supportLink = document.querySelector('.support-link');
    if (supportLink) {
        supportLink.addEventListener('click', function (e) {
            e.preventDefault();
            showToast('Support: Contact admin@360hotel.com', 'info');
            console.log('🔗 Support link clicked');
        });
        console.log('✅ Support link click handler attached');
    }

    // Login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('🔘 Login button clicked');
            handleLogin();
        });
        console.log('✅ Login button click handler attached');
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (event) {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay && event.target === loadingOverlay) {
            // Don't close loading overlay by clicking
            return;
        }
    });
}

function setupKeyboardSupport() {
    // Enter key support
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.id === 'username' || activeElement.id === 'password')) {
                e.preventDefault();
                handleLogin();
                console.log('⌨️ Enter key pressed, submitting form');
            }
        }

        // Escape key to clear form
        if (e.key === 'Escape') {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (usernameInput) usernameInput.value = '';
            if (passwordInput) passwordInput.value = '';
            showToast('Form cleared', 'info');
            console.log('⌨️ Escape key pressed, form cleared');
        }
    });

    console.log('✅ Keyboard support setup complete');
}

async function handleLogin() {
    console.log('🚀 Starting login process...');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    if (!usernameInput || !passwordInput) {
        console.error('❌ Username or password input not found');
        showToast('Login form error. Please refresh the page.', 'error');
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

    console.log('📝 Login attempt:', { username, passwordLength: password.length, rememberMe });

    // Validate inputs
    if (!username || !password) {
        showToast('Please fill in all fields', 'error');
        console.log('❌ Validation failed: empty fields');
        return;
    }

    // Show loading
    showLoading(true);
    console.log('⏳ Loading state activated');

    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Validate credentials
        const isValid = await fetchOrders(username, password)
        console.log('🔐 Credential validation result:', isValid);

        if (isValid) {
            // Create session
            createSession(username, rememberMe);
            console.log('✅ Session created successfully');

            showToast('Login successful! Redirecting...', 'success');

            // Redirect after short delay
            setTimeout(() => {
                redirectToDashboard();
            }, 1000);
        } else {
            console.log('❌ Invalid credentials provided');
            showToast('Invalid username or password', 'error');

            // Add shake animation to form
            const loginCard = document.querySelector('.login-card');
            if (loginCard) {
                loginCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        }
    } catch (error) {
        console.error('💥 Login error:', error);
        showToast('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
        console.log('⏳ Loading state deactivated');
    }
}

async function validateCredentials(username, password) {
    // In production, this would make an API call to your authentication server
    // For demo purposes, we're using hardcoded credentials
    console.log('🔍 Validating credentials...');

    const isValid = username === DEMO_CREDENTIALS.username &&
        password === DEMO_CREDENTIALS.password;

    console.log('🔍 Validation result:', isValid);
    return isValid;
}

function createSession(username, rememberMe) {
    const session = {
        username: username,
        loginTime: Date.now(),
        rememberMe: rememberMe,
        expiresAt: Date.now() + (rememberMe ? SESSION_DURATION * 7 : SESSION_DURATION) // 7 days if remember me
    };

    try {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        console.log('✅ Session created for user:', username);
        console.log('📅 Session expires at:', new Date(session.expiresAt).toLocaleString());
    } catch (error) {
        console.error('❌ Failed to create session:', error);
    }
}

function getSession() {
    try {
        const sessionData = localStorage.getItem(SESSION_KEY);
        const session = sessionData ? JSON.parse(sessionData) : null;
        console.log('📖 Retrieved session:', session ? 'Found' : 'Not found');
        return session;
    } catch (error) {
        console.error('❌ Error reading session:', error);
        return null;
    }
}

function isSessionValid(session) {
    if (!session || !session.expiresAt) {
        console.log('❌ Session invalid: missing data');
        return false;
    }

    const isValid = Date.now() < session.expiresAt;
    console.log('🕐 Session validity check:', isValid);

    if (!isValid) {
        console.log('⏰ Session expired at:', new Date(session.expiresAt).toLocaleString());
    }

    return isValid;
}

function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
        console.log('🗑️ Session cleared');
    } catch (error) {
        console.error('❌ Error clearing session:', error);
    }
}

function redirectToDashboard() {
    console.log('🚀 Redirecting to dashboard...');

    // Add exit animation
    const loginCard = document.querySelector('.login-card');
    if (loginCard) {
        loginCard.style.animation = 'slideOutDown 0.5s ease-in-out';
    }

    setTimeout(() => {
        try {
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('❌ Redirect failed:', error);
            showToast('Redirect failed. Please navigate manually.', 'error');
        }
    }, 500);
}

function showLoading(show) {
    const loadingOverlay = document.getElementById('loadingOverlay');

    if (loadingOverlay) {
        if (show) {
            loadingOverlay.classList.add('show');
            console.log('⏳ Loading overlay shown');
        } else {
            loadingOverlay.classList.remove('show');
            console.log('⏳ Loading overlay hidden');
        }
    } else {
        console.error('❌ Loading overlay not found');
    }
}

function showToast(message, type = 'info') {
    console.log(`🍞 Toast: ${type} - ${message}`);

    const toast = document.getElementById('toast');
    if (!toast) {
        console.error('❌ Toast element not found');
        return;
    }

    const icon = toast.querySelector('.toast-icon');
    const messageEl = toast.querySelector('.toast-message');

    if (!icon || !messageEl) {
        console.error('❌ Toast icon or message element not found');
        return;
    }

    // Set icon based on type
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };

    icon.className = `toast-icon ${icons[type]}`;
    messageEl.textContent = message;
    toast.className = `toast ${type} show`;

    // Hide after 4 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        console.log('🍞 Toast hidden');
    }, 4000);
}

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes slideOutDown {
    from {
        opacity: 1;
        transform: translateY(0);
    }
    to {
        opacity: 0;
        transform: translateY(50px);
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = shakeCSS;
document.head.appendChild(style);

// Debug function to test login
window.debugLogin = function () {
    console.log('🐛 Debug login function called');
    document.getElementById('username').value = 'admin';
    document.getElementById('password').value = 'admin123';
    handleLogin();
};

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateCredentials,
        createSession,
        getSession,
        isSessionValid,
        clearSession
    };
}

console.log('🎯 Login.js loaded successfully');