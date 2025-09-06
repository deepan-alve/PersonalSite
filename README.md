# Portfolio Website with Secure Contact Form

This portfolio website includes a secure contact form implementation using Vercel Serverless Functions and API Routes.

## Features

- Static HTML/CSS/JS portfolio website
- Secure API route for contact form processing
- Rate limiting to prevent abuse (max 10 submissions per IP per day)
- Environment variables for sensitive information

## How To Run Locally

For SCSS compilation:
```
sass asset/scss/app.scss asset/css/styles.css --watch
```

## Deployment to Vercel

### Prerequisites

- A [Vercel](https://vercel.com) account
- Git installed on your computer

### Deployment Steps

1. **Push your code to GitHub:**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

2. **Connect Vercel to your GitHub repository:**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the project type

3. **Add environment variables:**

   In the Vercel dashboard for your project:
   
   - Go to "Settings" > "Environment Variables"
   - Add the following variables:
     - `EMAILJS_PUBLIC_KEY`: Your EmailJS public key
     - `EMAILJS_SERVICE_ID`: Your EmailJS service ID
     - `EMAILJS_TEMPLATE_ID`: Your EmailJS template ID

4. **Deploy your project:**

   - Click "Deploy"
   - Vercel will build and deploy your project
   - Your site will be available at `your-project-name.vercel.app`

## Security Features

- API keys are not exposed in client-side code
- Rate limiting prevents abuse of your contact form
- Form submissions are processed server-side
