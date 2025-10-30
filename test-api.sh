#!/bin/bash
# Test script for Campus Connection API

echo "🧪 Testing Campus Connection API..."

# Test health endpoint
echo "1. Testing health endpoint..."
curl -X GET "https://campus-connect-api-m4fg.onrender.com/api/health" \
  -H "Content-Type: application/json" \
  -H "Origin: https://campus-connect-swart-nine.vercel.app" \
  -v

echo -e "\n\n2. Testing login endpoint..."
curl -X POST "https://campus-connect-api-m4fg.onrender.com/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: https://campus-connect-swart-nine.vercel.app" \
  -d '{"email":"dev@campus.com","password":"CampusConnect123"}' \
  -v

echo -e "\n\n✅ API tests completed!"
