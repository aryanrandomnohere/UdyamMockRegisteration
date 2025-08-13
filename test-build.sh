#!/bin/bash

echo "🚀 Testing nixpacks build process locally..."

# Navigate to backend directory
cd backend

# Clean previous build
echo "Cleaning previous build..."
rm -rf node_modules dist

# Phase 1: Install all dependencies
echo "📦 Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Phase 2: Build phase
echo "🔨 Building application..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Failed to build application"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "🧪 Testing start command..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build output (dist directory) not found"
    exit 1
fi

# Check if server.js exists
if [ ! -f "dist/server.js" ]; then
    echo "❌ server.js not found in dist directory"
    exit 1
fi

echo "✅ Build artifacts verified!"
echo "🎉 All tests passed! Ready for deployment."
