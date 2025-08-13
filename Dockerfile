FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy all source files
COPY . .

# Build the application (includes Prisma generation)
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
