// Supabase Configuration
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// Check Authentication
function checkAuth() {
    const username = localStorage.getItem('ghostchat_username');
    
    if (!username) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = username;
    updateUserInfo();
}

// Update User Info in UI
function updateUserInfo() {
    document.getElementById('usernameDisplay').textContent = currentUser;
    document.getElementById('userAvatar').textContent = currentUser.charAt(0).toUpperCase();
}

// Logout Function
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('ghostchat_username');
        window.location.href = 'login.html';
    }
});

// Go to Inbox
document.getElementById('inboxBtn').addEventListener('click', () => {
    window.location.href = 'receiver.html';
});

// Tab Switching
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(tc => tc.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
        
        if (targetTab === 'view') {
            loadMessages();
        }
    });
});

// Character Counter
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

messageTextarea.addEventListener('input', () => {
    const count = messageTextarea.value.length;
    charCount.textContent = count;
    
    if (count > 500) {
        messageTextarea.value = messageTextarea.value.substring(0, 500);
        charCount.textContent = 500;
    }
});

// Send Message
const messageForm = document.getElementById('messageForm');

messageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const recipient = document.getElementById('recipient').value.trim().toLowerCase();
    const message = document.getElementById('message').value.trim();
    
    if (!recipient || !message) {
        showNotification('All fields are required', 'error');
        return;
    }
    
    const btn = messageForm.querySelector('.btn-primary');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    recipient: recipient,
                    message: message,
                    created_at: new Date().toISOString()
                }
            ]);
        
        if (error) throw error;
        
        showNotification('Message sent successfully!', 'success');
        messageForm.reset();
        charCount.textContent = '0';
        
    } catch (error) {
        console.error('Error:', error);
        showNotification('Failed to send message: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
        btn.textContent = 'Send Message';
    }
});

// Load Messages
async function loadMessages(filterUser = '') {
    const messagesFeed = document.getElementById('messagesFeed');
    messagesFeed.innerHTML = '<div class="loading"><div class="loading-spinner"></div><p class="loading-text">Loading messages...</p></div>';
    
    try {
        let query = supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (filterUser) {
            query = query.eq('recipient', filterUser.toLowerCase());
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data.length === 0) {
            messagesFeed.innerHTML = `
                <div class="no-messages">
                    <div class="no-messages-icon">📭</div>
                    <p>No messages found</p>
                </div>
            `;
            return;
        }
        
        messagesFeed.innerHTML = data.map(msg => `
            <div class="message-card">
                <div class="message-header">
                    <span class="message-to">To: ${escapeHtml(msg.recipient)}</span>
                    <span class="message-time">${formatTime(msg.created_at)}</span>
                </div>
                <div class="message-body">${escapeHtml(msg.message)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error:', error);
        messagesFeed.innerHTML = `
            <div class="no-messages">
                <div class="no-messages-icon">⚠️</div>
                <p>Error loading messages: ${error.message}</p>
            </div>
        `;
    }
}

// Filter Messages
const filterInput = document.getElementById('filterUser');
const refreshBtn = document.getElementById('refreshBtn');

filterInput.addEventListener('input', () => {
    const filterValue = filterInput.value.trim();
    loadMessages(filterValue);
});

refreshBtn.addEventListener('click', () => {
    const filterValue = filterInput.value.trim();
    loadMessages(filterValue);
});

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
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

// Check for recipient in URL
function checkRecipientParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipient = urlParams.get('to');
    
    if (recipient) {
        document.getElementById('recipient').value = recipient;
        tabs[0].click();
    }
}

// Auto-refresh messages every 10 seconds when on view tab
setInterval(() => {
    const viewTab = document.getElementById('view');
    if (viewTab.classList.contains('active')) {
        const filterValue = filterInput.value.trim();
        loadMessages(filterValue);
    }
}, 10000);

// Initialize
checkAuth();
checkRecipientParam();
