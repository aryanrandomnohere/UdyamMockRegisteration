FROM node:18

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci

# Copy all source files
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
