/**
 * Test Helper Utilities
 * 
 * These utilities help with testing various features of the application.
 * Can be used in browser console or automated testing scripts.
 */

/**
 * Test Socket.io Connection
 */
export const testSocketConnection = () => {
  console.group('🧪 Testing Socket.io Connection');
  
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No authentication token found');
    console.groupEnd();
    return false;
  }
  
  console.log('✅ Token found:', token.substring(0, 20) + '...');
  
  // Check if socket is connected
  const socketCheck = setInterval(() => {
    const socketConnected = (window as any).__SOCKET_CONNECTED__ || false;
    if (socketConnected) {
      console.log('✅ Socket.io connected');
      clearInterval(socketCheck);
      console.groupEnd();
      return true;
    }
  }, 1000);
  
  setTimeout(() => {
    clearInterval(socketCheck);
    console.error('❌ Socket.io connection timeout');
    console.groupEnd();
    return false;
  }, 5000);
  
  return true;
};

/**
 * Test API Connectivity
 */
export const testAPIConnectivity = async () => {
  console.group('🧪 Testing API Connectivity');
  
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';
    const response = await fetch(`${apiUrl.replace('/api', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ API server is reachable');
      console.groupEnd();
      return true;
    } else {
      console.error('❌ API server returned error:', response.status);
      console.groupEnd();
      return false;
    }
  } catch (error) {
    console.error('❌ API connectivity test failed:', error);
    console.groupEnd();
    return false;
  }
};

/**
 * Test Authentication Status
 */
export const testAuthStatus = () => {
  console.group('🧪 Testing Authentication Status');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token) {
    console.log('✅ Authentication token exists');
    
    // Decode JWT payload (basic check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = new Date(payload.exp * 1000);
      const now = new Date();
      
      if (expiry > now) {
        console.log('✅ Token is valid (expires:', expiry.toLocaleString(), ')');
      } else {
        console.warn('⚠️ Token has expired');
      }
    } catch {
      console.warn('⚠️ Could not decode token');
    }
  } else {
    console.error('❌ No authentication token found');
  }
  
  if (user) {
    console.log('✅ User data exists in localStorage');
    try {
      const userData = JSON.parse(user);
      console.log('   User:', userData.name || userData.email);
    } catch {
      console.warn('⚠️ Could not parse user data');
    }
  } else {
    console.warn('⚠️ No user data in localStorage');
  }
  
  console.groupEnd();
  return !!token;
};

/**
 * Test React Query Cache
 */
export const testQueryCache = () => {
  console.group('🧪 Testing React Query Cache');
  
  // This would need access to QueryClient
  // For now, just log instructions
  console.log('To test query cache:');
  console.log('1. Open React DevTools');
  console.log('2. Check React Query DevTools');
  console.log('3. Verify queries are cached correctly');
  
  console.groupEnd();
};

/**
 * Test Image Loading
 */
export const testImageLoading = async (imageUrl: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      console.log('✅ Image loaded:', imageUrl);
      resolve(true);
    };
    img.onerror = () => {
      console.error('❌ Image failed to load:', imageUrl);
      resolve(false);
    };
    img.src = imageUrl;
  });
};

/**
 * Test All Images on Page
 */
export const testAllImages = () => {
  console.group('🧪 Testing All Images on Page');
  
  const images = document.querySelectorAll('img');
  const promises: Promise<boolean>[] = [];
  
  images.forEach((img) => {
    const src = (img as HTMLImageElement).src;
    if (src && !src.includes('data:')) {
      promises.push(testImageLoading(src));
    }
  });
  
  Promise.all(promises).then((results) => {
    const successCount = results.filter(Boolean).length;
    const totalCount = results.length;
    console.log(`✅ ${successCount}/${totalCount} images loaded successfully`);
    console.groupEnd();
  });
};

/**
 * Test Toast Notifications
 */
export const testToastSystem = () => {
  console.group('🧪 Testing Toast System');
  
  // This would need access to toast context
  console.log('To test toast system:');
  console.log('1. Trigger various actions (like, message, etc.)');
  console.log('2. Verify toast notifications appear');
  console.log('3. Verify toast auto-dismisses');
  console.log('4. Verify toast styling matches theme');
  
  console.groupEnd();
};

/**
 * Test Form Validation
 */
export const testFormValidation = (formId: string) => {
  console.group('🧪 Testing Form Validation');
  
  const form = document.getElementById(formId);
  if (!form) {
    console.error('❌ Form not found:', formId);
    console.groupEnd();
    return false;
  }
  
  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;
  
  inputs.forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    if (htmlInput.required && !htmlInput.value) {
      console.error('❌ Required field empty:', htmlInput.name || htmlInput.id);
      isValid = false;
    }
  });
  
  if (isValid) {
    console.log('✅ All required fields filled');
  }
  
  console.groupEnd();
  return isValid;
};

/**
 * Test LocalStorage
 */
export const testLocalStorage = () => {
  console.group('🧪 Testing LocalStorage');
  
  const keys = ['token', 'user', 'theme', 'notifications'];
  const results: { [key: string]: boolean } = {};
  
  keys.forEach((key) => {
    const value = localStorage.getItem(key);
    results[key] = !!value;
    if (value) {
      console.log(`✅ ${key}: exists (${value.length} chars)`);
    } else {
      console.warn(`⚠️ ${key}: not found`);
    }
  });
  
  console.groupEnd();
  return results;
};

/**
 * Test Environment Variables
 */
export const testEnvVariables = () => {
  console.group('🧪 Testing Environment Variables');
  
  const requiredVars = [
    'VITE_API_URL',
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
  ];
  
  const results: { [key: string]: boolean } = {};
  
  requiredVars.forEach((varName) => {
    const value = import.meta.env[varName];
    results[varName] = !!value;
    if (value) {
      console.log(`✅ ${varName}: set`);
    } else {
      console.error(`❌ ${varName}: not set`);
    }
  });
  
  console.groupEnd();
  return results;
};

/**
 * Run All Tests
 */
export const runAllTests = async () => {
  console.log('🚀 Running All Tests...\n');
  
  await testAPIConnectivity();
  testAuthStatus();
  testLocalStorage();
  testEnvVariables();
  testSocketConnection();
  testAllImages();
  
  console.log('\n✅ Test suite completed!');
  console.log('Check results above for any issues.');
};

// Make functions available in browser console
if (typeof window !== 'undefined') {
  (window as any).testHelpers = {
    testSocketConnection,
    testAPIConnectivity,
    testAuthStatus,
    testQueryCache,
    testImageLoading,
    testAllImages,
    testToastSystem,
    testFormValidation,
    testLocalStorage,
    testEnvVariables,
    runAllTests,
  };
  
  console.log('🧪 Test helpers loaded! Use window.testHelpers.* to run tests');
  console.log('Example: window.testHelpers.runAllTests()');
}

