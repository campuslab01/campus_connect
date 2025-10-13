# Campus Connection

A modern college dating and social networking app built with React, Vite, Express.js, and MongoDB. Connect with fellow students, discover new friendships, and share your campus experiences.

## 🌟 Features

### Frontend (React + Vite)
- **Modern UI/UX**: Beautiful glassmorphism design with smooth animations
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure login/signup with profile management
- **User Discovery**: Advanced search and filtering system
- **Real-time Chat**: Instant messaging between matched users
- **Confessions**: Anonymous sharing platform for campus experiences
- **Profile Management**: Photo uploads, interests, and preferences
- **Likes & Matches**: Swipe-style interaction system

### Backend (Express.js + MongoDB)
- **RESTful API**: Well-structured API endpoints
- **Authentication**: JWT-based secure authentication
- **File Upload**: Image upload with AWS S3 integration
- **Real-time Features**: Socket.io ready for live chat
- **Data Validation**: Comprehensive input validation
- **Security**: Rate limiting, CORS, and security headers
- **Database**: MongoDB with Mongoose ODM

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- AWS S3 account (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus-connection
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment template
   cp server/.env.example server/.env
   
   # Edit server/.env with your configuration
   ```

4. **Start Development Servers**
   ```bash
   # Start both frontend and backend
   npm run dev:full
   
   # Or start individually
   npm run dev          # Frontend only
   npm run server:dev   # Backend only
   ```

5. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 📁 Project Structure

```
campus-connection/
├── src/                    # Frontend React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts (Auth, Chat)
│   ├── data/              # Mock data and types
│   ├── hooks/             # Custom React hooks
│   └── Images/            # Static images
├── server/                # Backend Express.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middlewares
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── uploads/          # Local file uploads
├── public/               # Static assets
└── dist/                 # Production build
```

## 🔧 Configuration

### Environment Variables

Create a `server/.env` file with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/campus-connection

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# AWS S3 (for image uploads)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=campus-connection-images

# Frontend URL
CLIENT_URL=http://localhost:5173
```

### MongoDB Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   ```

2. **MongoDB Atlas (Cloud)**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in your `.env` file

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Private |
| PUT | `/api/auth/profile` | Update profile | Private |
| POST | `/api/auth/logout` | Logout user | Private |

### User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/users/search` | Search users | Private |
| GET | `/api/users/suggestions` | Get suggested users | Private |
| GET | `/api/users/:id` | Get user profile | Private |
| POST | `/api/users/:id/like` | Like a user | Private |
| GET | `/api/users/likes` | Get user's likes | Private |

### Chat Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/chat` | Get user's chats | Private |
| GET | `/api/chat/:userId` | Get/create chat | Private |
| POST | `/api/chat/:chatId/messages` | Send message | Private |
| GET | `/api/chat/:chatId/messages` | Get messages | Private |

### Upload Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/upload/profile` | Upload profile image | Private |
| POST | `/api/upload/images` | Upload multiple images | Private |
| DELETE | `/api/upload/images/:url` | Delete image | Private |

## 🛠️ Development

### Available Scripts

```bash
# Frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Backend
npm run server:dev       # Start Express dev server
npm run server           # Start Express production server

# Full Stack
npm run dev:full         # Start both frontend and backend
npm run install:all      # Install all dependencies
```

### Code Structure

#### Frontend Architecture
- **Components**: Reusable UI components with TypeScript
- **Pages**: Route-based page components
- **Contexts**: Global state management (Auth, Chat)
- **Hooks**: Custom React hooks for common functionality
- **Data**: TypeScript interfaces and mock data

#### Backend Architecture
- **Controllers**: Handle business logic and HTTP requests
- **Models**: MongoDB schemas with Mongoose
- **Routes**: API endpoint definitions
- **Middlewares**: Authentication, validation, error handling
- **Utils**: Helper functions and utilities

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

### Backend Deployment (Heroku/Railway)

1. **Prepare for production**
   ```bash
   cd server
   npm install --production
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create campus-connection-api
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-production-mongodb-uri
   git push heroku main
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **File Upload Security**: Type and size validation

## 📱 Mobile Responsiveness

The app is fully responsive and optimized for:
- **Mobile**: Primary target with touch-friendly interface
- **Tablet**: Optimized layouts for medium screens
- **Desktop**: Full-featured desktop experience

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🎯 Roadmap

- [ ] Real-time chat with Socket.io
- [ ] Push notifications
- [ ] Video calling integration
- [ ] Advanced matching algorithm
- [ ] Campus events integration
- [ ] Group chat functionality
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

---

**Built with ❤️ for the campus community**