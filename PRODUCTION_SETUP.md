# Production Setup Guide

This guide explains how to run the cryptotracker application in production using Docker Compose.

## Quick Start

1. **Set up environment variables:**
   Create a `.env` file in the project root with the following content:
   ```bash
   # Required: Get your API key from https://coinmarketcap.com/api/
   DATA_PROVIDER_COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
   ```

2. **Build and run the application:**
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```

3. **Access the application:**
   - **Frontend (Web App):** http://localhost:3000
   - **Backend API:** http://localhost:4000
   - **Database Admin (Adminer):** http://localhost:8080

## Services

The production setup includes:

- **PostgreSQL Database** (port 5432)
  - Persistent data storage with named volume
  - Pre-configured with cryptotracker database

- **Backend API** (port 4000)
  - NestJS application with GraphQL endpoint
  - Connects to PostgreSQL database
  - Includes health checks and built-in health endpoint
  - Fetches crypto data from CoinMarketCap API
  - Uses optimized production Dockerfile (Dockerfile.prod)

- **Frontend** (port 3000)
  - Next.js application with standalone output
  - Optimized multi-stage Docker build
  - Connects to backend GraphQL API

- **Adminer** (port 8080)
  - Database administration interface
  - Dracula theme configured

## Environment Variables

### Required
- `DATA_PROVIDER_COINMARKETCAP_API_KEY`: Your CoinMarketCap API key

### Optional
- `DATA_PROVIDER_FETCH_INTERVAL_MS`: How often to fetch crypto data (default: 60000ms)

## Database Setup

The backend will automatically run database migrations on startup. No manual database setup is required.

## Stopping the Application

```bash
docker-compose -f docker-compose.prod.yml down
```

To also remove the database volume (⚠️ this will delete all data):
```bash
docker-compose -f docker-compose.prod.yml down -v
```

## Monitoring

- Backend health check is available at: http://localhost:4000/health
- All services have restart policies configured
- Services will automatically restart unless explicitly stopped

## Files Created

This production setup includes:
- `docker-compose.prod.yml` - Production Docker Compose configuration
- `apps/backend/Dockerfile.prod` - Optimized backend build dockerfile
- `.dockerignore` - Excludes unnecessary files from Docker build context
- `PRODUCTION_SETUP.md` - This documentation

## Troubleshooting

1. **Build issues:** Make sure you're running the command from the project root directory
2. **API key errors:** Verify your CoinMarketCap API key is valid and properly set in `.env`
3. **Port conflicts:** Ensure ports 3000, 4000, 5432, and 8080 are available
4. **Docker build context:** The `.dockerignore` file optimizes builds by excluding unnecessary files

## Development vs Production

This production setup differs from the development docker-compose.yml by:
- Building applications from source using optimized multi-stage Dockerfiles
- Including optimized frontend build with standalone output  
- Using production-specific backend Dockerfile (`Dockerfile.prod`)
- Adding health checks and proper service dependencies with conditions
- Using production environment variables and API endpoints
- Including restart policies for reliability
- Optimized Docker build context with `.dockerignore`
- Named volumes for persistent data storage
