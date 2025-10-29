// API Connection Test Component
import React, { useEffect } from 'react';
import api from './config/axios';

const APITest = () => {
  useEffect(() => {
    console.log('🧪 Testing API connection...');
    
    // Test the health endpoint
    api.get('/health')
      .then(response => {
        console.log('✅ Health check successful:', response.data);
      })
      .catch(error => {
        console.error('❌ Health check failed:', error);
      });
  }, []);

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '10px' }}>
      <h3>API Connection Test</h3>
      <p>Check the browser console for API connection logs</p>
    </div>
  );
};

export default APITest;
