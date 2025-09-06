# EmailJS Setup Guide (Updated 2025)

This portfolio website uses EmailJS to handle the contact form submission. Here's how to set it up:

## Step 1: Create an EmailJS Account

1. Go to [EmailJS website](https://www.emailjs.com/) and sign up for a free account
2. The free plan allows 200 emails per month

## Step 2: Create an Email Service

1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Give your service a name (e.g., "portfolio_contact")
6. Note the **Service ID** (you'll need it later)

## Step 3: Create an Email Template

1. Go to "Email Templates"
2. Click "Create New Template"
3. Design your email template with the following variables:
   - `{{user_name}}` - Sender's name
   - `{{user_email}}` - Sender's email
   - `{{user_phone}}` - Sender's phone
   - `{{message}}` - The message content
4. Note the **Template ID** (you'll need it later)

## Step 4: Get Your Public Key

1. In your EmailJS dashboard, go to "Account" > "API Keys"
2. Copy your **Public Key**

## Step 5: Update Your Website

1. Open `index.html` and find the EmailJS initialization code (near the bottom of the file)
2. Replace `YOUR_PUBLIC_KEY` with your EmailJS Public Key (found in Account > API Keys)
3. Open `asset/js/main.js` and find the `emailjs.send()` function
4. Replace:
   - `service_id` with your actual Service ID from Step 2
   - `template_id` with your actual Template ID from Step 3

Example:
```javascript
emailjs.send('portfolio_contact', 'contact_form', templateParams)
```

## Private Key (Optional - Paid Plans Only)

If you have a paid EmailJS plan and want extra security:

1. In your EmailJS dashboard Account page, create a new Private Key
2. In `main.js`, uncomment the privateKey line and add your key:
```javascript
emailjs.send("service_id", "template_id", templateParams, {
    privateKey: "YOUR_PRIVATE_KEY" 
})
```

## Testing

After completing the setup, test your form by:
1. Filling out the contact form on your website
2. Submitting the form
3. Check if you received the email at your address

## Troubleshooting

- If emails aren't being sent, check the browser console for errors
- Verify that your EmailJS account is active
- Make sure all IDs match exactly (User ID, Service ID, Template ID)
