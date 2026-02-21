// Check if user is already logged in
function checkAuth() {
    const username = localStorage.getItem('ghostchat_username');
    
    if (username) {
        window.location.href = 'index.html';
    }
}

// Handle login form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim().toLowerCase();
    
    if (!username) {
        showNotification('Please enter a username', 'error');
        return;
    }
    
    if (username.length < 3) {
        showNotification('Username must be at least 3 characters', 'error');
        return;
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showNotification('Username can only contain letters, numbers, and underscores', 'error');
        return;
    }
    
    // Save username to localStorage
    localStorage.setItem('ghostchat_username', username);
    
    // Redirect to main app
    window.location.href = 'index.html';
});

// Notification System
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--danger)'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Check auth on page load
checkAuth();
