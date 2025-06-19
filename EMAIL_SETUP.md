# Email Contact Form Setup Instructions

Your contact form is now configured to send real emails using **two different methods**. Choose the one that works best for you:

## 🚀 Quick Setup Option: Formspree (Recommended for beginners)

### Step 1: Create Formspree Account
1. Go to [Formspree.io](https://formspree.io/)
2. Sign up for a free account (allows 50 submissions/month)
3. Create a new form

### Step 2: Get Your Form ID
1. After creating the form, you'll get a form endpoint like: `https://formspree.io/f/xpzgkjvw`
2. Copy the ID part (e.g., `xpzgkjvw`)

### Step 3: Update the Code
1. Open `js/combined.js`
2. Find the line: `'https://formspree.io/f/YOUR_FORMSPREE_ID'`
3. Replace `YOUR_FORMSPREE_ID` with your actual Formspree form ID

### Step 4: Test
1. Submit a test message through your contact form
2. Check your email for the message

---

## 🔧 Advanced Option: EmailJS (More customizable)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions to connect your email account
5. Note down your **Service ID** (e.g., "service_portfolio")

### Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Use the template ID: **template_contact**
4. Set up the template with these variables:
   ```
   Subject: New message from {{from_name}} - {{subject}}
   
   From: {{from_name}} <{{from_email}}>
   Subject: {{subject}}
   
   Message:
   {{message}}
   
   ---
   This message was sent from your portfolio contact form.
   Reply-to: {{from_email}}
   ```

### Step 4: Get Your Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### Step 5: Update the Code
1. Open `js/combined.js`
2. Find the line: `'YOUR_PUBLIC_KEY'`
3. Replace `YOUR_PUBLIC_KEY` with your actual public key from EmailJS
4. Verify the service ID matches what you created in Step 2

---

## 📋 How the System Works

Your contact form now uses a **fallback system**:

1. **First**: Tries EmailJS (if configured)
2. **Second**: Falls back to Formspree (if EmailJS fails)
3. **Last resort**: Shows error with your direct email

This ensures maximum reliability - if one service is down, the other takes over!

## 🛠️ Current Configuration Status

Before setup, the form will:
- ❌ Show error messages when submitted
- ✅ Display proper error handling
- ✅ Provide your direct email as backup

After setup, the form will:
- ✅ Send real emails
- ✅ Show success confirmations
- ✅ Handle errors gracefully

## 🔧 Quick Fix for Immediate Use

If you want emails working **right now** with minimal setup:

1. Use Formspree (takes 2 minutes to set up)
2. Or temporarily disable the complex EmailJS code and use a simple mailto link

## 📧 Current Configuration
- Service ID: `service_portfolio`
- Template ID: `template_contact`
- Recipient Email: `ironadamant@gmail.com`
- Formspree endpoint: `https://formspree.io/f/YOUR_FORMSPREE_ID`

## 🐛 Troubleshooting
- Check browser console for error messages
- Verify your email service credentials
- Test with different email addresses
- Check spam folders
- Ensure service IDs match exactly

## 💡 Pro Tip
Set up **both services** for maximum reliability. The form will automatically try EmailJS first, then fall back to Formspree if needed!
