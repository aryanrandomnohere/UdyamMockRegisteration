# OpenBiz

A TypeScript/Express.js backend application with Prisma ORM.

## Project Structure

```
openbiz/
├── backend/          # Main application code
│   ├── src/         # TypeScript source files
│   ├── prisma/      # Prisma schema and migrations
│   └── package.json # Backend dependencies
├── package.json     # Root package.json for workspace management
└── nixpacks.toml    # Nixpacks configuration for Railway deployment
```

## Local Development

```bash
# Install dependencies
cd backend && npm install

# Start development server
npm start
```

## Railway Deployment

This repository is now fully configured to deploy on Railway using Nixpacks. 

### What was configured:

1. **Root-level files added:**
   - `nixpacks.toml` - Nixpacks build configuration
   - `package.json` - Root package.json for project detection
   - `.dockerignore` - Optimized build exclusions
   - `.gitignore` - Git exclusions

2. **Backend optimizations:**
   - Updated `server.ts` to use `PORT` environment variable
   - Added flexible CORS configuration for production
   - Added `/health` endpoint for monitoring
   - Fixed TypeScript build to exclude test files
   - Updated npm scripts for production deployment

3. **Build process:**
   - Node.js 20 runtime
   - Prisma client generation
   - TypeScript compilation to `dist/` folder
   - Production dependencies installation

### Environment Variables

Set these environment variables in Railway:

**Required:**
- `DATABASE_URL` - PostgreSQL database connection string
- `NODE_ENV=production`

**Optional:**
- `FRONTEND_URL` - Your frontend domain for CORS (if needed)
- `PORT` - Port number (Railway sets this automatically)

### Deployment Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Railway deployment"
   git push origin main
   ```

2. **Deploy on Railway:**
   - Connect your GitHub repository to Railway
   - Railway will automatically detect the `nixpacks.toml` configuration
   - Add a PostgreSQL database service
   - Set the required environment variables
   - Deploy!

3. **Verify deployment:**
   - Check the health endpoint: `https://your-app.up.railway.app/health`
   - Test your API endpoints: `https://your-app.up.railway.app/api/v1/udyam/...`

## Scripts

- `npm start` - Start the production server
- `npm run build` - Build TypeScript code
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage
