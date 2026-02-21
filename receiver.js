// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let allMessages = [];

// Check Authentication
function checkAuth() {
    const username = localStorage.getItem('ghostchat_username');
    
    if (!username) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = username;
    document.getElementById('usernameDisplay').textContent = currentUser;
    document.getElementById('userAvatar').textContent = currentUser.charAt(0).toUpperCase();
    
    loadMessages();
}

// Load Messages
async function loadMessages() {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p class="loading-text">Loading messages...</p></div>';
    
    try {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('recipient', currentUser.toLowerCase())
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        allMessages = data;
        displayMessages(data);
        updateStats(data);
        
    } catch (error) {
        console.error('Error:', error);
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <div class="no-messages-icon">⚠️</div>
                <p>Error loading messages</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">${error.message}</p>
            </div>
        `;
    }
}

// Display Messages
function displayMessages(messages) {
    const messagesContainer = document.getElementById('messagesContainer');
    
    if (messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="no-messages">
                <div class="no-messages-icon">📭</div>
                <p>No messages yet</p>
                <p style="font-size: 0.85rem; margin-top: 10px;">Share your link to receive anonymous messages</p>
            </div>
        `;
        return;
    }
    
    messagesContainer.innerHTML = messages.map(msg => `
        <div class="message-card">
            <div class="message-header">
                <div class="message-meta">
                    <span class="message-id">#${msg.id}</span>
                    <span class="message-time">${formatTime(msg.created_at)}</span>
                </div>
                <div class="message-actions">
                    <button class="btn-small" onclick="copyMessage(${msg.id})">📋 Copy</button>
                    <button class="btn-small delete" onclick="deleteMessage(${msg.id})">🗑️ Delete</button>
                </div>
            </div>
            <div class="message-body">${escapeHtml(msg.message)}</div>
        </div>
    `).join('');
}

// Update Stats
function updateStats(messages) {
    document.getElementById('totalMessages').textContent = messages.length;
    
    // Today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = messages.filter(msg => new Date(msg.created_at) >= today).length;
    document.getElementById('todayMessages').textContent = todayCount;
    
    // Last message time
    if (messages.length > 0) {
        document.getElementById('lastMessage').textContent = formatTime(messages[0].created_at);
    }
}

// Delete Message
async function deleteMessage(id) {
    if (!confirm('Delete this message?')) return;
    
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        
        showNotification('Message deleted', 'success');
        loadMessages();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to delete: ' + error.message, 'error');
    }
}

// Copy Message
function copyMessage(id) {
    const message = allMessages.find(msg => msg.id === id);
    if (!message) return;
    
    navigator.clipboard.writeText(message.message).then(() => {
        showNotification('Message copied to clipboard', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        showNotification('Failed to copy', 'error');
    });
}

// Delete All Messages
document.getElementById('deleteAllBtn').addEventListener('click', async () => {
    if (!confirm('Delete all messages? This cannot be undone!')) return;
    
    try {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('recipient', currentUser.toLowerCase());
        
        if (error) throw error;
        
        showNotification('All messages deleted', 'success');
        loadMessages();
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to delete: ' + error.message, 'error');
    }
});

// Refresh Messages
document.getElementById('refreshBtn').addEventListener('click', () => {
    loadMessages();
    showNotification('Messages refreshed', 'success');
});

// Search Messages
document.getElementById('searchBox').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    if (searchTerm === '') {
        displayMessages(allMessages);
    } else {
        const filtered = allMessages.filter(msg => 
            msg.message.toLowerCase().includes(searchTerm)
        );
        displayMessages(filtered);
    }
});

// Share Link
document.getElementById('shareLink').addEventListener('click', () => {
    const link = `${window.location.origin}/index.html?to=${currentUser}`;
    
    navigator.clipboard.writeText(link).then(() => {
        showNotification('Link copied: ' + link, 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
        alert('Your link: ' + link);
    });
});

// Send Message Button
document.getElementById('sendBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('ghostchat_username');
        window.location.href = 'login.html';
    }
});

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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
        max-width: 400px;
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

// Auto-refresh every 15 seconds
setInterval(() => {
    loadMessages();
}, 15000);

// Initialize
checkAuth();
