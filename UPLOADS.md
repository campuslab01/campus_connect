# Campus Connection - File Upload System Documentation

## Overview
This document provides comprehensive documentation for the file upload system in Campus Connection, covering security measures, storage options, validation rules, and implementation details.

## 🏗️ Architecture Overview

### Technology Stack
- **File Handling**: Multer (Express.js middleware)
- **Local Storage**: Node.js filesystem for development
- **Cloud Storage**: AWS S3 for production
- **Image Processing**: Ready for Sharp integration
- **Security**: Comprehensive validation and sanitization

### System Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Storage       │
│   (React)       │───▶│   (Express)     │───▶│   (S3/Local)    │
│                 │    │                 │    │                 │
│ - File Input    │    │ - Multer        │    │ - Images        │
│ - Preview       │    │ - Validation    │    │ - Metadata      │
│ - Progress      │    │ - Security      │    │ - CDN Ready     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔒 Security Implementation

### File Type Validation
```javascript
// Allowed MIME types
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp'
];

// Allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Enhanced file filter
const fileFilter = (req, file, cb) => {
  // MIME type validation
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.'), false);
  }
  
  // File extension validation
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Invalid file extension.'), false);
  }
  
  // Suspicious filename detection
  const suspiciousPatterns = [
    /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.scr$/i,
    /\.pif$/i, /\.vbs$/i, /\.js$/i, /\.php$/i,
    /\.asp$/i, /\.jsp$/i
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(file.originalname))) {
    return cb(new Error('Suspicious file name detected.'), false);
  }
  
  cb(null, true);
};
```

### File Size & Quantity Limits
```javascript
// Multer configuration with security limits
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5, // Maximum 5 files per request
    fieldSize: 10 * 1024 * 1024, // 10MB total request size
    fieldNameSize: 100, // Maximum field name length
    fields: 10 // Maximum number of fields
  },
  fileFilter: fileFilter
});
```

### Security Headers & Validation
- **Content-Type Validation**: Strict MIME type checking
- **File Signature Validation**: Magic number verification (future)
- **Virus Scanning**: Ready for ClamAV integration
- **Rate Limiting**: Upload frequency restrictions
- **IP-based Limits**: Per-IP upload restrictions

## 📁 Storage Options

### Local Storage (Development)
```javascript
// Local storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp and random suffix
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
```

### AWS S3 Storage (Production)
```javascript
// AWS S3 configuration
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

// S3 upload function
const uploadToS3 = async (file, folder = 'profiles') => {
  try {
    const fileContent = fs.readFileSync(file.path);
    const fileName = `${folder}/${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: fileName,
      Body: fileContent,
      ContentType: file.mimetype,
      ACL: 'public-read',
      ServerSideEncryption: 'AES256' // Encryption at rest
    };

    const result = await s3.upload(params).promise();
    
    // Clean up local file after S3 upload
    fs.unlinkSync(file.path);
    
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};
```

## 🛠️ Upload Endpoints

### Profile Image Upload
```javascript
// POST /api/upload/profile
// Single profile image upload
router.post('/profile', uploadProfileImageMiddleware, handleUploadError, uploadProfileImage);

const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    let imageUrl;
    
    // Upload to S3 if configured, otherwise use local path
    if (process.env.AWS_S3_BUCKET) {
      imageUrl = await uploadToS3(req.file, 'profiles');
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // Update user's profile image
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: imageUrl },
      { new: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Profile image uploaded successfully',
      data: { imageUrl, user: user.getPublicProfile() }
    });
  } catch (error) {
    next(error);
  }
};
```

### Multiple Images Upload
```javascript
// POST /api/upload/images
// Multiple profile images upload
router.post('/images', uploadMultiple, handleUploadError, uploadImages);

const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No image files provided'
      });
    }

    const imageUrls = [];

    // Upload each file
    for (const file of req.files) {
      let imageUrl;
      
      if (process.env.AWS_S3_BUCKET) {
        imageUrl = await uploadToS3(file, 'profiles');
      } else {
        imageUrl = `/uploads/${file.filename}`;
      }
      
      imageUrls.push(imageUrl);
    }

    // Update user's photos array
    const user = await User.findById(req.user._id);
    user.photos = [...user.photos, ...imageUrls];
    
    // Set first photo as profile image if none exists
    if (!user.profileImage && imageUrls.length > 0) {
      user.profileImage = imageUrls[0];
    }
    
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Images uploaded successfully',
      data: { imageUrls, user: user.getPublicProfile() }
    });
  } catch (error) {
    next(error);
  }
};
```

### Chat Image Upload
```javascript
// POST /api/upload/chat
// Chat image upload
router.post('/chat', uploadSingle, handleUploadError, uploadChatImage);

const uploadChatImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No image file provided'
      });
    }

    let imageUrl;

    if (process.env.AWS_S3_BUCKET) {
      imageUrl = await uploadToS3(req.file, 'chat');
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    res.status(200).json({
      status: 'success',
      message: 'Chat image uploaded successfully',
      data: { imageUrl }
    });
  } catch (error) {
    next(error);
  }
};
```

## 🗑️ File Management

### Delete Images
```javascript
// DELETE /api/upload/images/:imageUrl
// Delete image from user's profile
router.delete('/images/:imageUrl', deleteImage);

const deleteImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.params;
    const user = await User.findById(req.user._id);

    // Check if image exists in user's photos
    const imageIndex = user.photos.indexOf(imageUrl);
    if (imageIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Image not found in your profile'
      });
    }

    // Remove from photos array
    user.photos.splice(imageIndex, 1);

    // If this was the profile image, set a new one
    if (user.profileImage === imageUrl) {
      user.profileImage = user.photos.length > 0 ? user.photos[0] : '';
    }

    await user.save();

    // Delete from S3 if configured
    if (process.env.AWS_S3_BUCKET && imageUrl.includes('amazonaws.com')) {
      await deleteFromS3(imageUrl);
    }

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
      data: { user: user.getPublicProfile() }
    });
  } catch (error) {
    next(error);
  }
};
```

### S3 File Deletion
```javascript
// Delete from S3
const deleteFromS3 = async (url) => {
  try {
    const key = url.split('/').slice(-2).join('/'); // Get folder/filename from URL
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    return false;
  }
};
```

## 📊 File Metadata & Tracking

### Upload Logging
```javascript
// File upload logging
const logFileUpload = (userId, filename, size, details = {}) => {
  const uploadLog = {
    userId,
    filename,
    size,
    timestamp: new Date().toISOString(),
    details
  };
  
  logger.info(`UPLOAD: File uploaded`, uploadLog);
};
```

### File Statistics
- **Upload Count**: Per-user upload tracking
- **Storage Usage**: Total storage per user
- **File Types**: Distribution of file types
- **Upload Frequency**: Rate of uploads per user

## 🚀 Performance Optimization

### Image Processing (Future)
```javascript
// Image optimization with Sharp
const sharp = require('sharp');

const optimizeImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(outputPath);
};
```

### CDN Integration
- **CloudFront**: AWS CloudFront for global distribution
- **Cache Headers**: Proper cache control headers
- **Image Optimization**: Automatic format conversion
- **Lazy Loading**: Frontend lazy loading implementation

### Compression & Optimization
- **Image Compression**: Automatic quality optimization
- **Format Conversion**: WebP conversion for modern browsers
- **Thumbnail Generation**: Multiple size variants
- **Progressive Loading**: Progressive JPEG support

## 🔧 Configuration

### Environment Variables
```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=campus-connection-images

# Upload Limits
MAX_FILE_SIZE=5242880  # 5MB in bytes
MAX_FILES_PER_REQUEST=5
UPLOAD_RATE_LIMIT=20   # uploads per hour

# Storage Configuration
STORAGE_TYPE=local     # or 's3'
LOCAL_UPLOAD_PATH=./uploads
```

### Multer Configuration
```javascript
// Complete multer configuration
const uploadConfig = {
  storage: process.env.STORAGE_TYPE === 's3' ? s3Storage : localStorage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
    files: parseInt(process.env.MAX_FILES_PER_REQUEST) || 5,
    fieldSize: 10 * 1024 * 1024,
    fieldNameSize: 100,
    fields: 10
  },
  fileFilter: fileFilter,
  preservePath: false
};
```

## 🛡️ Error Handling

### Upload Error Handling
```javascript
// Comprehensive error handling
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          status: 'error',
          message: 'File too large. Maximum size is 5MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          status: 'error',
          message: 'Too many files. Maximum is 5 files.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          status: 'error',
          message: 'Unexpected file field.'
        });
      case 'LIMIT_PART_COUNT':
        return res.status(400).json({
          status: 'error',
          message: 'Too many parts in the request.'
        });
      default:
        return res.status(400).json({
          status: 'error',
          message: 'File upload error.'
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      status: 'error',
      message: 'Only image files are allowed.'
    });
  }
  
  next(error);
};
```

### Validation Errors
- **File Type Errors**: Clear error messages for invalid types
- **Size Limit Errors**: Specific size limit information
- **Security Errors**: Generic security violation messages
- **Storage Errors**: Storage-specific error handling

## 📈 Monitoring & Analytics

### Upload Metrics
- **Upload Success Rate**: Percentage of successful uploads
- **File Size Distribution**: Average and maximum file sizes
- **Storage Usage**: Total storage consumption
- **Error Rates**: Upload failure tracking

### Performance Monitoring
- **Upload Speed**: Time to upload files
- **Processing Time**: Image processing duration
- **Storage Latency**: S3 response times
- **Error Tracking**: Upload error analysis

## 🔮 Future Enhancements

### Advanced Features
- **Video Upload**: Support for video files
- **Document Upload**: PDF and document support
- **Bulk Upload**: Multiple file upload interface
- **Drag & Drop**: Enhanced upload interface

### AI Integration
- **Content Moderation**: AI-powered content filtering
- **Image Recognition**: Automatic tagging and categorization
- **Duplicate Detection**: Prevent duplicate uploads
- **Quality Assessment**: Automatic image quality scoring

### Advanced Security
- **Virus Scanning**: Real-time malware detection
- **Content Analysis**: Inappropriate content detection
- **Watermarking**: Automatic watermark application
- **EXIF Stripping**: Remove metadata for privacy

---

**Last Updated**: January 2025  
**Next Review**: March 2025  
**Storage Version**: S3 + Local Hybrid
