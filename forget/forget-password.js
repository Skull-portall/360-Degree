
const API_URL = 'https://three60hotel.onrender.com';  // Your backend URL
let resetCode = '';

async function requestResetCode() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message');

    try {
        const res = await fetch(`${API_URL}/api/auth/set-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        resetCode = data.code;

        // Send email via EmailJS
        await emailjs.send('service_z3xdzpn', 'template_16zmnpg', {
            to_email: username,
            code: resetCode
        });

        document.getElementById('requestSection').style.display = 'none';
        document.getElementById('codeSection').style.display = 'block';
        message.textContent = 'Reset code sent to your email.';
    } catch (err) {
        message.textContent = 'Error: ' + err.message;
    }
}

async function resetPassword() {
    const username = document.getElementById('username').value;
    const code = document.getElementById('code').value;
    const password = document.getElementById('newPassword').value;
    const message = document.getElementById('message');

    try {
        const res = await fetch(`${API_URL}/api/auth/forget-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, code, password })
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        message.textContent = 'Password reset successfully. You can now log in.';
    } catch (err) {
        message.textContent = 'Error: ' + err.message;
    }
}
