# Campus Connection - Database Documentation

## Overview
This document provides a comprehensive overview of the MongoDB database structure, collections, relationships, indexing strategies, and data lifecycle management for the Campus Connection application.

## 🗄️ Database Architecture

### Technology Stack
- **Database**: MongoDB (NoSQL document database)
- **ODM**: Mongoose (Object Document Mapper)
- **Connection**: Mongoose with connection pooling
- **Indexing**: Compound and text indexes for performance
- **Validation**: Schema-level validation with Mongoose

### Database Configuration
```javascript
// Connection configuration
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-connection';

await mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
});
```

## 📊 Collections & Schemas

### 1. Users Collection

#### Schema Structure
```javascript
const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String, required: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  
  // Profile Information
  age: { type: Number, required: true, min: 18, max: 30 },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  
  // Academic Information
  college: { type: String, required: true, trim: true },
  department: { type: String, required: true, trim: true },
  year: { type: String, enum: ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', '1st', '2nd', '3rd', '4th'] },
  
  // Profile Details
  bio: { type: String, maxlength: 500 },
  photos: [{ type: String }], // Array of image URLs
  profileImage: { type: String },
  
  // Relationship Information
  relationshipStatus: { type: String, enum: ['Single', 'In a relationship', 'Married', 'It\'s complicated'] },
  lookingFor: [{ type: String, enum: ['Long term', 'Short term', 'Friendship'] }],
  interests: [{ type: String, trim: true }],
  
  // Social Features
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Account Management
  verified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastSeen: { type: Date, default: Date.now },
  
  // Privacy Settings
  showAge: { type: Boolean, default: true },
  showCollege: { type: Boolean, default: true },
  showDepartment: { type: Boolean, default: true },
  
  // Security
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

#### Indexes
```javascript
// Performance indexes
userSchema.index({ email: 1 }); // Unique index for email
userSchema.index({ college: 1 }); // College-based queries
userSchema.index({ department: 1 }); // Department-based queries
userSchema.index({ interests: 1 }); // Interest-based matching
userSchema.index({ age: 1 }); // Age range queries
userSchema.index({ gender: 1 }); // Gender filtering
userSchema.index({ isActive: 1 }); // Active user queries
userSchema.index({ lastSeen: -1 }); // Recent activity

// Compound indexes for complex queries
userSchema.index({ college: 1, department: 1 });
userSchema.index({ age: 1, gender: 1 });
userSchema.index({ interests: 1, lookingFor: 1 });
userSchema.index({ isActive: 1, verified: 1 });
```

#### Virtual Fields
```javascript
// Virtual for age display based on privacy settings
userSchema.virtual('displayAge').get(function() {
  return this.showAge ? this.age : null;
});
```

### 2. Chats Collection

#### Schema Structure
```javascript
const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 1000 },
    type: { type: String, enum: ['text', 'image', 'emoji'], default: 'text' },
    imageUrl: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    timestamp: { type: Date, default: Date.now }
  }],
  lastMessage: { type: String, default: '' },
  lastMessageAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});
```

#### Indexes
```javascript
// Chat performance indexes
chatSchema.index({ participants: 1 }); // Find chats by participants
chatSchema.index({ lastMessageAt: -1 }); // Recent chats first
chatSchema.index({ isActive: 1 }); // Active chats only
chatSchema.index({ 'participants': 1, 'lastMessageAt': -1 }); // User's recent chats
```

### 3. Confessions Collection

#### Schema Structure
```javascript
const confessionSchema = new mongoose.Schema({
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isAnonymous: { type: Boolean, default: true },
  category: { type: String, enum: ['love', 'academic', 'friendship', 'family', 'personal', 'other'], default: 'personal' },
  tags: [{ type: String, trim: true }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
    isAnonymous: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  }],
  isApproved: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  reportedBy: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, enum: ['inappropriate', 'spam', 'harassment', 'other'] },
    reportedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});
```

#### Indexes
```javascript
// Confession performance indexes
confessionSchema.index({ createdAt: -1 }); // Recent confessions first
confessionSchema.index({ category: 1 }); // Category filtering
confessionSchema.index({ isApproved: 1, isActive: 1 }); // Approved and active
confessionSchema.index({ 'likes': 1 }); // Popular confessions
confessionSchema.index({ author: 1, createdAt: -1 }); // User's confessions
confessionSchema.index({ tags: 1 }); // Tag-based search
```

## 🔗 Relationships & References

### User Relationships
```javascript
// User-to-User relationships
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users liked by this user
likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who liked this user
matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Mutual matches
```

### Chat Relationships
```javascript
// Chat-to-User relationships
participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Chat participants
messages.sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Message sender
```

### Confession Relationships
```javascript
// Confession-to-User relationships
author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Confession author
likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who liked
comments.author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Comment authors
reportedBy.user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reporters
```

## 📈 Performance Optimization

### Query Optimization Strategies

#### 1. Efficient User Search
```javascript
// Optimized user search query
const searchUsers = async (criteria) => {
  const query = { isActive: true };
  
  // Add filters efficiently
  if (criteria.gender && criteria.gender !== 'all') {
    query.gender = criteria.gender;
  }
  
  if (criteria.interests && criteria.interests.length > 0) {
    query.interests = { $in: criteria.interests };
  }
  
  // Use compound index for age range
  if (criteria.ageMin || criteria.ageMax) {
    query.age = {};
    if (criteria.ageMin) query.age.$gte = criteria.ageMin;
    if (criteria.ageMax) query.age.$lte = criteria.ageMax;
  }
  
  return User.find(query)
    .select('-password -emailVerificationToken -passwordResetToken')
    .sort({ createdAt: -1 })
    .limit(20);
};
```

#### 2. Pagination Strategy
```javascript
// Efficient pagination with skip and limit
const getPaginatedResults = async (Model, query, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  
  const [results, total] = await Promise.all([
    Model.find(query).skip(skip).limit(limit),
    Model.countDocuments(query)
  ]);
  
  return {
    results,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      hasNext: skip + results.length < total,
      hasPrev: page > 1
    }
  };
};
```

#### 3. Aggregation Pipelines
```javascript
// User matching aggregation
const findMatches = async (userId) => {
  return User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(userId) } },
    { $lookup: {
      from: 'users',
      localField: 'likes',
      foreignField: '_id',
      as: 'likedUsers'
    }},
    { $unwind: '$likedUsers' },
    { $match: { 'likedUsers.likes': new mongoose.Types.ObjectId(userId) } },
    { $replaceRoot: { newRoot: '$likedUsers' } }
  ]);
};
```

### Indexing Strategy

#### 1. Single Field Indexes
- **Email**: Unique index for authentication
- **College/Department**: For filtering and search
- **Age/Gender**: For matching algorithms
- **Interests**: For interest-based matching
- **Timestamps**: For chronological ordering

#### 2. Compound Indexes
- **College + Department**: Academic filtering
- **Age + Gender**: Demographic matching
- **Interests + LookingFor**: Preference matching
- **IsActive + Verified**: User status filtering

#### 3. Text Indexes
```javascript
// Text search index for user profiles
userSchema.index({
  name: 'text',
  college: 'text',
  department: 'text',
  bio: 'text'
}, {
  weights: {
    name: 10,
    college: 5,
    department: 5,
    bio: 1
  }
});
```

## 🔄 Data Lifecycle Management

### Data Retention Policies

#### 1. User Data
- **Active Users**: Indefinite retention
- **Inactive Users**: 2 years after last activity
- **Deleted Users**: 30 days soft delete, then hard delete
- **Account Data**: Retained for legal compliance

#### 2. Chat Data
- **Active Chats**: Indefinite retention
- **Inactive Chats**: 1 year after last message
- **Deleted Chats**: 7 days soft delete, then hard delete
- **Message History**: Configurable retention period

#### 3. Confession Data
- **Approved Confessions**: Indefinite retention
- **Pending Confessions**: 30 days, then auto-delete
- **Reported Confessions**: Retained for moderation review
- **Deleted Confessions**: 7 days soft delete, then hard delete

### Data Cleanup Procedures

#### 1. Automated Cleanup
```javascript
// Scheduled cleanup job
const cleanupInactiveData = async () => {
  const cutoffDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1 year ago
  
  // Clean up inactive users
  await User.updateMany(
    { lastSeen: { $lt: cutoffDate }, isActive: false },
    { $set: { isActive: false } }
  );
  
  // Clean up old confessions
  await Confession.deleteMany({
    isApproved: false,
    createdAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });
};
```

#### 2. Manual Cleanup
- **Admin Dashboard**: Manual data cleanup tools
- **User Requests**: Data deletion on user request
- **Legal Requests**: Compliance with data protection laws
- **System Maintenance**: Regular maintenance procedures

## 🔒 Data Security & Privacy

### Data Encryption
- **At Rest**: Database-level encryption
- **In Transit**: TLS/SSL encryption
- **Application Level**: Sensitive field encryption
- **Backup Encryption**: Encrypted database backups

### Privacy Controls
- **User Privacy Settings**: Granular privacy controls
- **Data Anonymization**: Anonymous data collection
- **Right to Deletion**: GDPR compliance
- **Data Portability**: User data export

### Access Control
- **Database Access**: Role-based access control
- **Application Access**: JWT-based authentication
- **Admin Access**: Multi-factor authentication
- **Audit Logging**: All database access logged

## 📊 Monitoring & Analytics

### Database Monitoring
- **Performance Metrics**: Query performance tracking
- **Connection Monitoring**: Connection pool monitoring
- **Index Usage**: Index efficiency analysis
- **Storage Usage**: Database size monitoring

### Query Analytics
- **Slow Queries**: Query performance analysis
- **Index Usage**: Index utilization tracking
- **Connection Patterns**: Usage pattern analysis
- **Error Tracking**: Database error monitoring

## 🚀 Scalability Considerations

### Horizontal Scaling
- **Sharding Strategy**: User-based sharding
- **Replica Sets**: Read replica configuration
- **Load Balancing**: Database load distribution
- **Connection Pooling**: Efficient connection management

### Vertical Scaling
- **Resource Monitoring**: CPU and memory usage
- **Index Optimization**: Regular index maintenance
- **Query Optimization**: Performance tuning
- **Storage Optimization**: Data compression and archiving

## 🔧 Maintenance Procedures

### Regular Maintenance
- **Index Rebuilding**: Monthly index optimization
- **Statistics Update**: Database statistics refresh
- **Backup Verification**: Backup integrity checks
- **Performance Tuning**: Query optimization

### Backup Strategy
- **Full Backups**: Daily full database backups
- **Incremental Backups**: Hourly incremental backups
- **Point-in-Time Recovery**: Continuous backup logging
- **Disaster Recovery**: Cross-region backup replication

## 📋 Database Schema Versioning

### Migration Strategy
- **Schema Versioning**: Version-controlled schema changes
- **Backward Compatibility**: Maintain compatibility during updates
- **Data Migration**: Automated data migration scripts
- **Rollback Procedures**: Safe rollback mechanisms

### Schema Evolution
- **Additive Changes**: Safe schema additions
- **Breaking Changes**: Careful migration planning
- **Data Validation**: Schema validation on updates
- **Testing**: Comprehensive testing before deployment

---

**Last Updated**: January 2025  
**Next Review**: March 2025  
**Database Version**: MongoDB 6.0+
