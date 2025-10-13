#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Campus Connection Setup Script');
console.log('================================\n');

// Check if Node.js version is compatible
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion < 16) {
  console.error('❌ Node.js version 16 or higher is required');
  console.error(`   Current version: ${nodeVersion}`);
  process.exit(1);
}

console.log(`✅ Node.js version: ${nodeVersion}`);

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'server', '.env');
const envExamplePath = path.join(__dirname, 'server', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from template');
    console.log('   Please edit server/.env with your configuration');
  } else {
    // Create basic .env file
    const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/campus-connection

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-${Date.now()}
JWT_EXPIRE=7d

# Frontend URL
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created basic .env file');
    console.log('   Please edit server/.env with your configuration');
  }
} else {
  console.log('✅ .env file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');

try {
  console.log('   Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('   Installing backend dependencies...');
  execSync('cd server && npm install', { stdio: 'inherit' });
  
  console.log('✅ All dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Create uploads directory
const uploadsDir = path.join(__dirname, 'server', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Edit server/.env with your configuration');
console.log('2. Make sure MongoDB is running');
console.log('3. Run: npm run dev:full (to start both frontend and backend)');
console.log('4. Or run: npm run server:dev (backend only) or npm run dev (frontend only)');
console.log('\n🌐 URLs:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend:  http://localhost:5000/api');
console.log('\n📚 Documentation: Check README.md for detailed setup instructions');
