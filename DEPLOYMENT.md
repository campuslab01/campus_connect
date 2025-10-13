# Campus Connection - Deployment Guide

## Overview
This comprehensive deployment guide covers step-by-step instructions for deploying the Campus Connection application to production environments, including frontend (Vercel/Netlify) and backend (Render/Heroku/AWS) deployment strategies.

## 🏗️ Architecture Overview

### Production Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Vercel)      │───▶│   (Render)      │───▶│   (MongoDB      │
│                 │    │                 │    │    Atlas)       │
│ - React App     │    │ - Express API   │    │                 │
│ - Static Assets │    │ - Node.js       │    │ - User Data     │
│ - CDN           │    │ - File Storage  │    │ - Chat History  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   File Storage  │
                       │   (AWS S3)      │
                       │                 │
                       │ - Profile Images│
                       │ - Chat Images   │
                       │ - CDN           │
                       └─────────────────┘
```

## 🚀 Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository
- Environment variables configured

### Step 1: Prepare Frontend for Production

#### 1.1 Update Vite Configuration
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true
  }
}));
```

#### 1.2 Environment Variables
Create `.env.production` file:
```bash
# Production API URL
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=Campus Connection
VITE_APP_VERSION=1.0.0
```

### Step 2: Deploy to Vercel

#### 2.1 Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository containing your frontend code

#### 2.2 Configure Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

#### 2.3 Environment Variables
Add these environment variables in Vercel dashboard:
```
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=Campus Connection
VITE_APP_VERSION=1.0.0
```

#### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Access your deployed app via the provided URL

### Step 3: Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Enable SSL certificate

## 🖥️ Backend Deployment (Render)

### Prerequisites
- Render account
- MongoDB Atlas account
- AWS S3 account (for file storage)

### Step 1: Prepare Backend for Production

#### 1.1 Update Package.json Scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required'",
    "seed": "node utils/seedData.js"
  }
}
```

#### 1.2 Production Environment Variables
Create production environment variables:
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-connection?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-here
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=campus-connection-images

# CORS
CLIENT_URL=https://your-frontend-url.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 2: Deploy to Render

#### 2.1 Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository containing your backend code

#### 2.2 Configure Service Settings
```
Name: campus-connection-api
Environment: Node
Build Command: npm install
Start Command: npm start
Instance Type: Starter (Free) or Standard (Paid)
```

#### 2.3 Environment Variables
Add all production environment variables in Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `CLIENT_URL`
- And all other required variables

#### 2.4 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete
3. Access your API via the provided URL

### Step 3: Custom Domain (Optional)
1. Go to Settings → Custom Domains
2. Add your custom domain
3. Configure DNS records
4. Enable SSL certificate

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new account or sign in
3. Create a new cluster
4. Choose your preferred cloud provider and region
5. Select cluster tier (M0 for free tier)

### Step 2: Configure Database Access
1. Go to Database Access
2. Create a new database user
3. Set username and password
4. Grant read/write permissions

### Step 3: Configure Network Access
1. Go to Network Access
2. Add IP address (0.0.0.0/0 for all IPs, or specific IPs)
3. Save changes

### Step 4: Get Connection String
1. Go to Clusters
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

## ☁️ File Storage Setup (AWS S3)

### Step 1: Create S3 Bucket
1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com)
2. Click "Create bucket"
3. Choose a unique bucket name
4. Select region
5. Configure public access settings

### Step 2: Configure Bucket Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### Step 3: Create IAM User
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam)
2. Create new user
3. Attach policy: `AmazonS3FullAccess`
4. Generate access keys
5. Save access key ID and secret access key

## 🔧 Alternative Deployment Options

### Backend Deployment Options

#### Option 1: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create campus-connection-api

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set AWS_ACCESS_KEY_ID=your-aws-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-aws-secret
heroku config:set AWS_S3_BUCKET=your-bucket-name
heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app

# Deploy
git push heroku main
```

#### Option 2: Railway
1. Go to [Railway](https://railway.app)
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically

#### Option 3: AWS EC2
```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/your-username/campus-connection.git
cd campus-connection/server

# Install dependencies
npm install

# Install PM2 for process management
sudo npm install -g pm2

# Start application
pm2 start server.js --name "campus-connection-api"
pm2 startup
pm2 save
```

### Frontend Deployment Options

#### Option 1: Netlify
1. Go to [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables
5. Deploy

#### Option 2: AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Install AWS CLI
pip install awscli

# Configure AWS CLI
aws configure

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Create CloudFront distribution
# Configure in AWS Console
```

## 🔒 Production Security Checklist

### Environment Security
- [ ] Strong JWT secret (32+ characters)
- [ ] Secure MongoDB connection string
- [ ] AWS credentials properly configured
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] Security headers configured

### Application Security
- [ ] HTTPS enabled on all domains
- [ ] Database access restricted
- [ ] File upload restrictions active
- [ ] Input validation enabled
- [ ] Error logging configured
- [ ] Monitoring alerts set up

### Infrastructure Security
- [ ] Database backups enabled
- [ ] SSL certificates valid
- [ ] Firewall rules configured
- [ ] Access logs monitored
- [ ] Security updates applied

## 📊 Monitoring & Logging

### Application Monitoring
```javascript
// Add to server.js
const { logRequest, logError } = require('./utils/logger');

// Request logging
app.use(logRequest);

// Error logging
app.use((err, req, res, next) => {
  logError(err, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userId: req.user ? req.user._id : null
  });
  next(err);
});
```

### Health Checks
```javascript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check database connection
    await mongoose.connection.db.admin().ping();
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});
```

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v0.0.8
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

## 🔧 Troubleshooting

### Common Issues

#### Frontend Issues
- **Build Failures**: Check Node.js version compatibility
- **Environment Variables**: Ensure all required variables are set
- **CORS Errors**: Verify backend CORS configuration
- **API Connection**: Check API URL configuration

#### Backend Issues
- **Database Connection**: Verify MongoDB URI and network access
- **File Upload**: Check AWS S3 credentials and bucket permissions
- **Memory Issues**: Increase instance size or optimize code
- **Rate Limiting**: Adjust rate limits for production traffic

#### Database Issues
- **Connection Timeouts**: Check network access and connection string
- **Index Performance**: Monitor and optimize database indexes
- **Storage Limits**: Monitor database storage usage
- **Backup Issues**: Verify backup configuration

### Performance Optimization

#### Frontend Optimization
- Enable gzip compression
- Implement lazy loading
- Optimize images
- Use CDN for static assets
- Enable browser caching

#### Backend Optimization
- Implement connection pooling
- Add database indexes
- Use Redis for caching
- Optimize API responses
- Implement request compression

## 📋 Post-Deployment Checklist

### Immediate Tasks
- [ ] Test all API endpoints
- [ ] Verify file upload functionality
- [ ] Check database connections
- [ ] Test authentication flow
- [ ] Verify CORS configuration
- [ ] Check error logging
- [ ] Test rate limiting

### Ongoing Maintenance
- [ ] Monitor application performance
- [ ] Review error logs regularly
- [ ] Update dependencies monthly
- [ ] Backup database weekly
- [ ] Monitor storage usage
- [ ] Review security logs
- [ ] Update SSL certificates

---

**Last Updated**: January 2025  
**Next Review**: March 2025  
**Deployment Version**: Production Ready
