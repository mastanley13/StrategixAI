# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the StrategixAI website to Vercel.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [GitHub](https://github.com) account (for version control)
3. The [Neon](https://neon.tech) database already set up
4. A [SendGrid](https://sendgrid.com) account for email functionality

## Setup Steps

### 1. Push your code to GitHub

If you haven't already:

1. Create a new GitHub repository
2. Initialize your local git repository (if not already done)
3. Add your GitHub repository as a remote
4. Push your code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/your-repo-name.git
git push -u origin main
```

### 2. Connect to Vercel

1. Log in to your [Vercel account](https://vercel.com)
2. Click "Add New" > "Project"
3. Select your GitHub repository
4. Configure the project:
   - Framework Preset: Select "Other" (we've configured a custom build in vercel.json)
   - Root Directory: Leave as `.` (root)

### 3. Environment Variables

Add the following environment variables in the Vercel project settings:

| Name | Value | Description |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://neondb_owner:PASSWORD@ep-old-hat-a4abmelx-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require` | Your Neon Postgres connection string |
| `SENDGRID_API_KEY` | `SG.xxxxxxxxxxxx` | Your SendGrid API key |
| `GHL_API_KEY` | `xxxxxxx` | Your Go High Level API key |
| `RSS_FEED_URL` | `https://rss-link.com/feed/8lQAYS7QatKYV3ENYdl1?blogId=...&loadContent=true` | Your Go High Level RSS feed URL |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | `{}` | Your Firebase service account JSON (if using Firebase) |
| `NODE_ENV` | `production` | Set the Node environment to production |

### 4. Deploy

1. Click "Deploy" to initiate the deployment process
2. Vercel will automatically build and deploy your application
3. You'll receive a deployment URL once the process completes

### 5. Custom Domain (Optional)

1. Go to the "Domains" section in your Vercel project
2. Add your custom domain (e.g., strategixai.co)
3. Follow the instructions to configure your DNS settings

### 6. Post-Deployment Checks

After deployment, verify:

1. The website loads correctly
2. Blog content is fetched properly 
3. Contact form submissions work
4. Booking functionality works
5. Email notifications are sent

## Troubleshooting

### Common Issues

- **Build Failures**:
  - Check build logs in Vercel
  - Ensure all dependencies are correctly listed in package.json
  - Check that environment variables are correctly set

- **API Issues**:
  - Check if the database connection is working
  - Verify API routes are correctly configured
  - Check server logs for errors

- **Email Issues**:
  - Verify SendGrid API key is correct
  - Check email sender verification in SendGrid

### Debugging

1. Use Vercel's "Functions" tab to check serverless function logs
2. Add console logs to your server code to help identify issues
3. Check browser console for client-side errors

## Maintenance

- **Deploying Changes**:
  - Push changes to your GitHub repository
  - Vercel will automatically rebuild and redeploy

- **Environment Variables**:
  - Update environment variables in Vercel project settings as needed
  - Production builds will use these variables 