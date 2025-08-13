#!/bin/bash
set -e

echo "Starting build process..."

# Generate Prisma client using config file
echo "Generating Prisma client..."
npx prisma generate

# Build TypeScript
echo "Building TypeScript..."
npx tsc

echo "Build completed successfully!"
