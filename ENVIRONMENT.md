# Campus Connection - Environment Variables Documentation

## Overview
This document provides comprehensive documentation for all environment variables used in the Campus Connection application, including their purpose, format, and security considerations.

## 🔧 Environment Variable Categories

### 1. Database Configuration

#### MONGODB_URI
- **Purpose**: MongoDB database connection string
- **Format**: `mongodb://username:password@host:port/database` or `mongodb+srv://username:password@cluster.mongodb.net/database`
- **Required**: Yes
- **Example**: 
  ```bash
  # Local development
  MONGODB_URI=mongodb://localhost:27017/campus-connection
  
  # MongoDB Atlas (Production)
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-connection?retryWrites=true&w=majority
  ```
- **Security**: Contains sensitive credentials, never commit to version control

#### MONGODB_TEST_URI
- **Purpose**: MongoDB connection string for testing environment
- **Format**: Same as MONGODB_URI
- **Required**: No (for testing only)
- **Example**: `MONGODB_TEST_URI=mongodb://localhost:27017/campus-connection-test`

### 2. Server Configuration

#### PORT
- **Purpose**: Port number for the Express server
- **Format**: Integer
- **Required**: No (defaults to 5000)
- **Example**: `PORT=5000`
- **Notes**: Most hosting platforms (Heroku, Render) set this automatically

#### NODE_ENV
- **Purpose**: Application environment (development, production, test)
- **Format**: String
- **Required**: No (defaults to 'development')
- **Values**: `development`, `production`, `test`
- **Example**: `NODE_ENV=production`
- **Impact**: Affects logging level, error handling, and security settings

### 3. JWT Configuration

#### JWT_SECRET
- **Purpose**: Secret key for signing JWT tokens
- **Format**: String (minimum 32 characters recommended)
- **Required**: Yes
- **Example**: `JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random`
- **Security**: Must be unique and kept secret, use strong random string
- **Generation**: Use `openssl rand -base64 64` or similar

#### JWT_EXPIRE
- **Purpose**: JWT token expiration time
- **Format**: String (time format)
- **Required**: No (defaults to '7d')
- **Examples**: 
  ```bash
  JWT_EXPIRE=7d          # 7 days
  JWT_EXPIRE=24h         # 24 hours
  JWT_EXPIRE=3600        # 3600 seconds
  JWT_EXPIRE=1h          # 1 hour
  ```

### 4. AWS S3 Configuration

#### AWS_ACCESS_KEY_ID
- **Purpose**: AWS access key ID for S3 access
- **Format**: String (20 characters)
- **Required**: Yes (for file uploads)
- **Example**: `AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE`
- **Security**: Sensitive credential, store securely

#### AWS_SECRET_ACCESS_KEY
- **Purpose**: AWS secret access key for S3 access
- **Format**: String (40 characters)
- **Required**: Yes (for file uploads)
- **Example**: `AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- **Security**: Highly sensitive, never expose in logs or client-side code

#### AWS_REGION
- **Purpose**: AWS region for S3 bucket
- **Format**: String
- **Required**: No (defaults to 'us-east-1')
- **Example**: `AWS_REGION=us-east-1`
- **Common Values**: `us-east-1`, `us-west-2`, `eu-west-1`, `ap-southeast-1`

#### AWS_S3_BUCKET
- **Purpose**: S3 bucket name for file storage
- **Format**: String (lowercase, no spaces)
- **Required**: Yes (for file uploads)
- **Example**: `AWS_S3_BUCKET=campus-connection-images`
- **Notes**: Bucket name must be globally unique

### 5. Email Configuration

#### EMAIL_HOST
- **Purpose**: SMTP server hostname
- **Format**: String
- **Required**: No (for email features)
- **Example**: `EMAIL_HOST=smtp.gmail.com`

#### EMAIL_PORT
- **Purpose**: SMTP server port
- **Format**: Integer
- **Required**: No
- **Example**: `EMAIL_PORT=587`

#### EMAIL_USER
- **Purpose**: SMTP username
- **Format**: String (email address)
- **Required**: No
- **Example**: `EMAIL_USER=your-email@gmail.com`

#### EMAIL_PASS
- **Purpose**: SMTP password or app password
- **Format**: String
- **Required**: No
- **Example**: `EMAIL_PASS=your-app-password`
- **Security**: Use app-specific passwords for Gmail

### 6. Frontend Configuration

#### CLIENT_URL
- **Purpose**: Frontend application URL for CORS
- **Format**: URL string
- **Required**: Yes
- **Examples**:
  ```bash
  # Development
  CLIENT_URL=http://localhost:5173
  
  # Production
  CLIENT_URL=https://campus-connection.vercel.app
  ```

### 7. Rate Limiting Configuration

#### RATE_LIMIT_WINDOW_MS
- **Purpose**: Time window for rate limiting in milliseconds
- **Format**: Integer
- **Required**: No (defaults to 900000 = 15 minutes)
- **Example**: `RATE_LIMIT_WINDOW_MS=900000`

#### RATE_LIMIT_MAX_REQUESTS
- **Purpose**: Maximum requests per window per IP
- **Format**: Integer
- **Required**: No (defaults to 100)
- **Example**: `RATE_LIMIT_MAX_REQUESTS=100`

## 📁 Environment File Structure

### Development (.env)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/campus-connection

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRE=7d

# AWS S3 (Optional for development)
AWS_ACCESS_KEY_ID=your-dev-access-key
AWS_SECRET_ACCESS_KEY=your-dev-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=campus-connection-dev

# Frontend
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

### Production (.env.production)
```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-connection?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=production

# JWT
JWT_SECRET=super-secure-production-secret-key-64-characters-long
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
AWS_S3_BUCKET=campus-connection-images

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=noreply@campusconnection.app
EMAIL_PASS=your-app-password

# Frontend
CLIENT_URL=https://campus-connection.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Testing (.env.test)
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/campus-connection-test

# Server
PORT=5001
NODE_ENV=test

# JWT
JWT_SECRET=test-secret-key
JWT_EXPIRE=1h

# Frontend
CLIENT_URL=http://localhost:3000

# Rate Limiting (Relaxed for testing)
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=1000
```

## 🔒 Security Best Practices

### Environment Variable Security

#### 1. Never Commit Secrets
```bash
# Add to .gitignore
.env
.env.local
.env.production
.env.test
*.env
```

#### 2. Use Strong Secrets
```bash
# Generate strong JWT secret
openssl rand -base64 64

# Generate random password
openssl rand -base64 32
```

#### 3. Rotate Secrets Regularly
- Change JWT secrets monthly
- Rotate AWS credentials quarterly
- Update database passwords annually

#### 4. Use Different Secrets per Environment
- Development: Weak secrets (not sensitive)
- Staging: Medium strength secrets
- Production: Strong, unique secrets

### Production Security Checklist
- [ ] All secrets are strong and unique
- [ ] No secrets in version control
- [ ] Environment variables properly set in hosting platform
- [ ] Database credentials are secure
- [ ] AWS credentials have minimal required permissions
- [ ] CORS origins are restricted to production domains
- [ ] Rate limiting is configured for production traffic

## 🚀 Deployment Platform Configuration

### Vercel (Frontend)
```bash
# In Vercel dashboard, add environment variables:
VITE_API_URL=https://your-backend-url.com/api
VITE_APP_NAME=Campus Connection
VITE_APP_VERSION=1.0.0
```

### Render (Backend)
```bash
# In Render dashboard, add environment variables:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
CLIENT_URL=https://your-frontend-url.vercel.app
```

### Heroku (Backend)
```bash
# Using Heroku CLI
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_S3_BUCKET=your-bucket
heroku config:set CLIENT_URL=https://your-frontend-url.vercel.app
```

### Railway (Backend)
```bash
# In Railway dashboard, add environment variables:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket
CLIENT_URL=https://your-frontend-url.vercel.app
```

## 🔧 Environment Variable Validation

### Server-side Validation
```javascript
// utils/validateEnv.js
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLIENT_URL'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
  
  // Validate JWT secret strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.error('JWT_SECRET must be at least 32 characters long');
    process.exit(1);
  }
  
  // Validate MongoDB URI format
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.startsWith('mongodb')) {
    console.error('MONGODB_URI must be a valid MongoDB connection string');
    process.exit(1);
  }
};

module.exports = { validateEnvironment };
```

### Frontend Environment Validation
```javascript
// utils/validateEnv.js (Frontend)
const requiredEnvVars = [
  'VITE_API_URL'
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error('Environment validation failed');
  }
};

export { validateEnvironment };
```

## 📊 Environment Monitoring

### Health Check with Environment Info
```javascript
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version,
    // Don't expose sensitive information
    hasDatabase: !!process.env.MONGODB_URI,
    hasS3: !!process.env.AWS_S3_BUCKET,
    hasEmail: !!process.env.EMAIL_HOST
  });
});
```

### Environment Variable Logging (Development Only)
```javascript
// Log environment info in development
if (process.env.NODE_ENV === 'development') {
  console.log('Environment Configuration:');
  console.log('- Database:', process.env.MONGODB_URI ? 'Configured' : 'Missing');
  console.log('- JWT Secret:', process.env.JWT_SECRET ? 'Configured' : 'Missing');
  console.log('- S3 Bucket:', process.env.AWS_S3_BUCKET || 'Not configured');
  console.log('- Client URL:', process.env.CLIENT_URL);
}
```

## 🔄 Environment Migration

### Updating Environment Variables
1. **Backup Current Configuration**: Export current environment variables
2. **Update Variables**: Modify values in hosting platform
3. **Test Changes**: Verify application functionality
4. **Monitor Logs**: Check for any configuration errors
5. **Rollback Plan**: Keep previous values for quick rollback

### Environment Variable Migration Script
```javascript
// scripts/migrateEnv.js
const fs = require('fs');
const path = require('path');

const migrateEnvironment = (fromEnv, toEnv) => {
  const fromPath = path.join(__dirname, `../.env.${fromEnv}`);
  const toPath = path.join(__dirname, `../.env.${toEnv}`);
  
  if (!fs.existsSync(fromPath)) {
    console.error(`Source environment file .env.${fromEnv} not found`);
    return;
  }
  
  const fromContent = fs.readFileSync(fromPath, 'utf8');
  const toContent = fromContent
    .replace(/NODE_ENV=.*/g, `NODE_ENV=${toEnv}`)
    .replace(/MONGODB_URI=.*/g, `MONGODB_URI=mongodb://localhost:27017/campus-connection-${toEnv}`);
  
  fs.writeFileSync(toPath, toContent);
  console.log(`Environment migrated from ${fromEnv} to ${toEnv}`);
};

module.exports = { migrateEnvironment };
```

## 📋 Environment Checklist

### Development Setup
- [ ] `.env` file created with development values
- [ ] Database connection string configured
- [ ] JWT secret set (can be weak for development)
- [ ] Frontend URL configured
- [ ] Rate limiting relaxed for development
- [ ] File upload configured (local or S3)

### Production Setup
- [ ] Strong JWT secret (32+ characters)
- [ ] Production database connection string
- [ ] AWS S3 credentials configured
- [ ] Email configuration (if using email features)
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting configured for production traffic
- [ ] Environment variables set in hosting platform
- [ ] No sensitive data in version control

### Testing Setup
- [ ] Test database connection string
- [ ] Test-specific JWT secret
- [ ] Relaxed rate limiting for testing
- [ ] Test environment variables configured
- [ ] CI/CD environment variables set

---

**Last Updated**: January 2025  
**Next Review**: March 2025  
**Environment Version**: Production Ready
