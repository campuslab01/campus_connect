// Frontend validation utilities
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface UserFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  age: string;
  gender: string;
  college: string;
  department: string;
  year?: string;
  bio?: string;
  profileImage?: string;
  photos?: string[];
}

// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (!/(?=.*[a-z])/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/(?=.*[A-Z])/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number';
  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  if (!name) return 'Name is required';
  if (name.length < 2) return 'Name must be at least 2 characters long';
  if (name.length > 50) return 'Name cannot be more than 50 characters';
  if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
  return null;
};

// Age validation
export const validateAge = (age: string): string | null => {
  if (!age) return 'Age is required';
  const ageNum = parseInt(age);
  if (isNaN(ageNum)) return 'Age must be a valid number';
  if (ageNum < 18) return 'Age must be at least 18';
  if (ageNum > 30) return 'Age must be at most 30';
  return null;
};

// Gender validation
export const validateGender = (gender: string): string | null => {
  if (!gender) return 'Gender is required';
  const validGenders = ['male', 'female', 'other'];
  if (!validGenders.includes(gender.toLowerCase())) {
    return 'Please select a valid gender';
  }
  return null;
};

// College validation
export const validateCollege = (college: string): string | null => {
  if (!college) return 'College is required';
  if (college.length < 2) return 'College name must be at least 2 characters long';
  if (college.length > 100) return 'College name cannot be more than 100 characters';
  return null;
};

// Department validation
export const validateDepartment = (department: string): string | null => {
  if (!department) return 'Department is required';
  if (department.length < 2) return 'Department must be at least 2 characters long';
  if (department.length > 50) return 'Department cannot be more than 50 characters';
  return null;
};

// Profile image validation
export const validateProfileImage = (image: string | null): string | null => {
  if (!image) return 'Profile image is required';
  if (!image.startsWith('data:image/') && !image.startsWith('http')) {
    return 'Please select a valid image file';
  }
  return null;
};

// Photos validation
export const validatePhotos = (photos: string[]): string | null => {
  if (!photos || photos.length === 0) return 'At least one profile photo is required';
  if (photos.length > 6) return 'Maximum 6 photos allowed';
  
  for (let i = 0; i < photos.length; i++) {
    const photo = photos[i];
    if (!photo.startsWith('data:image/') && !photo.startsWith('http')) {
      return `Photo ${i + 1} is not a valid image`;
    }
  }
  return null;
};

// Bio validation
export const validateBio = (bio: string): string | null => {
  if (bio && bio.length > 500) return 'Bio cannot be more than 500 characters';
  return null;
};

// Complete form validation for registration
export const validateRegistrationForm = (formData: UserFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Required fields
  const nameError = validateName(formData.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;

  const ageError = validateAge(formData.age);
  if (ageError) errors.age = ageError;

  const genderError = validateGender(formData.gender);
  if (genderError) errors.gender = genderError;

  const collegeError = validateCollege(formData.college);
  if (collegeError) errors.college = collegeError;

  const departmentError = validateDepartment(formData.department);
  if (departmentError) errors.department = departmentError;

  // Optional fields
  if (formData.bio) {
    const bioError = validateBio(formData.bio);
    if (bioError) errors.bio = bioError;
  }

  // Profile image validation
  if (formData.profileImage) {
    const profileImageError = validateProfileImage(formData.profileImage);
    if (profileImageError) errors.profileImage = profileImageError;
  }

  // Photos validation
  if (formData.photos) {
    const photosError = validatePhotos(formData.photos);
    if (photosError) errors.photos = photosError;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Login form validation
export const validateLoginForm = (email: string, password: string): ValidationResult => {
  const errors: Record<string, string> = {};

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};
