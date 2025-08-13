#!/bin/bash
set -e

echo "Starting TypeScript build..."

# Build TypeScript
echo "Building TypeScript..."
npx tsc

echo "TypeScript build completed successfully!"
