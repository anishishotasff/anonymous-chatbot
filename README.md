# 👻 GhostChat - Anonymous Messaging Platform

A clean, modern anonymous messaging platform powered by Supabase. Send and receive messages without revealing your identity.

## ✨ Features

- **Simple Username Login**: No passwords, no email required
- **Anonymous Messaging**: Send messages without revealing sender identity
- **Personal Inbox**: Receive messages in your private inbox
- **Modern UI**: Clean, responsive design with smooth animations
- **Real-time Feed**: View all messages with auto-refresh
- **Message Management**: Copy, delete individual messages or clear all
- **Search & Filter**: Find messages quickly
- **Shareable Links**: Generate links for others to send you messages
- **Secure**: Powered by Supabase for secure data storage
- **Responsive**: Works perfectly on all devices

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the project to be set up

### 2. Create Database Table

In your Supabase project dashboard:

1. Go to **SQL Editor**
2. Run this SQL command:

```sql
CREATE TABLE messages (
  id BIGSERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert messages
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to read messages
CREATE POLICY "Anyone can read messages" ON messages
  FOR SELECT USING (true);

-- Allow anyone to delete messages
CREATE POLICY "Anyone can delete messages" ON messages
  FOR DELETE USING (true);

-- Create index for better performance
CREATE INDEX idx_messages_recipient ON messages(recipient);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

### 3. Get Your Supabase Credentials

1. Go to **Project Settings** > **API**
2. Copy your **Project URL**
3. Copy your **anon/public** key

### 4. Configure the App

Update these files with your Supabase credentials:
- `app.js`
- `receiver.js`

Replace the placeholders in each file:

```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
```

### 5. Run the App

Simply open `login.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000/login.html`

## 📖 How to Use

### First Time Setup

1. Open `login.html` in your browser
2. Enter a username (letters, numbers, and underscores only)
3. Click **Continue**
4. You're in! No password needed

### Sending Anonymous Messages

1. On the main page, enter the recipient's username
2. Type your anonymous message (max 500 characters)
3. Click **Send Message**
4. The message is sent anonymously - recipient won't know who sent it

### Viewing Your Inbox

1. Click **My Inbox** button in the header
2. View all messages sent to you
3. Use search to filter messages
4. Copy or delete individual messages
5. Share your link to receive more messages

### Sharing Your Link

1. Go to your inbox
2. Click **🔗 Share Link**
3. Share the link with others
4. They can send you anonymous messages using that link

## 🎨 Design Features

- **Modern Gradient UI**: Purple/indigo color scheme
- **Smooth Animations**: Fade-ins, slides, and hover effects
- **Floating Ghost Icon**: Animated logo
- **Card-based Layout**: Clean, organized interface
- **Responsive Design**: Works on all screen sizes
- **Custom Scrollbars**: Styled for better UX
- **Loading States**: Spinners and skeleton screens
- **Toast Notifications**: Non-intrusive feedback

## 🔒 Security Notes

- Username-based authentication (stored in localStorage)
- Messages are stored in Supabase with RLS (Row Level Security)
- Sender identity is never stored (truly anonymous messages)
- Only recipients can view their own messages
- No password storage or management
- Encrypted connections via HTTPS

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: LocalStorage-based username system
- **Fonts**: Google Fonts (Inter)
- **Styling**: Pure CSS with modern features
- **Icons**: Unicode emojis

## 📱 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera
- Any modern browser with ES6+ support

## 🎨 Customization

You can customize the color scheme in the CSS files by changing the CSS variables:

```css
:root {
    --primary: #6366f1;      /* Main purple */
    --secondary: #8b5cf6;    /* Secondary purple */
    --bg: #0f172a;          /* Dark background */
    --card-bg: #1e293b;     /* Card background */
    --text: #f1f5f9;        /* Light text */
    --text-muted: #94a3b8;  /* Muted text */
    --border: #334155;      /* Border color */
    --success: #10b981;     /* Success green */
    --danger: #ef4444;      /* Danger red */
}
```

## 🤝 Contributing

Feel free to fork and improve the design or functionality!

## 📄 License

Free to use and modify. No attribution required.

---

**GhostChat - Simple, Anonymous, Secure**
