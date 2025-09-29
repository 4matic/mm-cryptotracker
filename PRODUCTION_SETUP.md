# Production Deployment Guide

This comprehensive guide provides step-by-step instructions for deploying the CryptoTracker application in production using Docker Compose. For development setup, refer to the [main project README](README.md).

## Table of Contents

- [Production Deployment Guide](#production-deployment-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
    - [System Requirements](#system-requirements)
    - [External Services](#external-services)
    - [Network Requirements](#network-requirements)
  - [Environment Configuration](#environment-configuration)
  - [Production Deployment](#production-deployment)
    - [Standard Deployment Process](#standard-deployment-process)
    - [Deployment with Image Rebuilding](#deployment-with-image-rebuilding)
    - [Alternative: Automated Build Script](#alternative-automated-build-script)
    - [Service Access Points](#service-access-points)
  - [Architecture Overview](#architecture-overview)
    - [Core Services](#core-services)
    - [CLI Service](#cli-service)
  - [Database Management](#database-management)
    - [Migration Management](#migration-management)
    - [Data Seeding](#data-seeding)
  - [Configuration Management](#configuration-management)
    - [Environment Variables Reference](#environment-variables-reference)
      - [Required Configuration](#required-configuration)
      - [Optional Configuration](#optional-configuration)
    - [External API Integration](#external-api-integration)
  - [Operations Management](#operations-management)
    - [Service Control](#service-control)
    - [Health Monitoring](#health-monitoring)
    - [Log Management](#log-management)
  - [Troubleshooting Guide](#troubleshooting-guide)
    - [Common Issues and Solutions](#common-issues-and-solutions)
      - [1. Build and Deployment Issues](#1-build-and-deployment-issues)
      - [2. API and Configuration Issues](#2-api-and-configuration-issues)
      - [3. Performance and Resource Issues](#3-performance-and-resource-issues)
    - [Debug Mode](#debug-mode)
  - [Production Infrastructure Files](#production-infrastructure-files)
  - [Development vs Production Differences](#development-vs-production-differences)
    - [Build Optimizations](#build-optimizations)
    - [Runtime Configuration](#runtime-configuration)
    - [Monitoring and Maintenance](#monitoring-and-maintenance)
  - [Related Documentation](#related-documentation)
    - [Core Documentation](#core-documentation)
    - [Module-Specific Documentation](#module-specific-documentation)
    - [Additional Resources](#additional-resources)

## Prerequisites

Before proceeding with the production deployment, ensure the following requirements are met:

### System Requirements
- **[Node.js 20+](https://nodejs.org)** - JavaScript runtime (for local development)
- **[Docker Engine](https://docker.com)** (v24.0+ recommended) - Container runtime
- **[Docker Compose](https://docs.docker.com/compose/)** (v2.0+ recommended) - Multi-container orchestration

### External Services
- **CoinMarketCap API Key** - [Register here](https://coinmarketcap.com/api/) for free tier access

### Network Requirements
- **Available Ports**: 3000 (frontend), 4000 (backend), 5432 (database), 8080 (admin)

## Environment Configuration

1. **Create environment file:**
   Copy the template and configure your production variables:
   ```bash
   cp env.example .env
   ```

2. **Configure required variables:**
   Edit the `.env` file with your production settings. Refer to [`env.example`](env.example) for all available options:
   ```bash
   # Database Configuration
   DATABASE_NAME=cryptotracker
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_secure_password_here
   
   # External API Configuration
   DATA_PROVIDER_COINMARKETCAP_API_KEY=your_coinmarketcap_api_key_here
   
   # Optional: Data fetching interval (default: 60000ms)
   DATA_PROVIDER_FETCH_INTERVAL_MS=60000
   ```

   **⚠️ Security Note**: Ensure your `.env` file contains secure passwords and is never committed to version control.

## Production Deployment

### Standard Deployment Process

Execute the following commands in sequence for a complete production deployment:

```bash
# 1. Start database service
docker-compose -f docker-compose.prod.yml up -d database

# 2. Initialize database schema (fresh migration)
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli migration:fresh

# 3. Seed initial cryptocurrency data
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli seeder:run

# 4. Start all production services
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify deployment status
docker-compose -f docker-compose.prod.yml ps

# 6. Monitor application logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Deployment with Image Rebuilding

When you have made code changes and need to ensure the latest version is deployed, use the `--build` flag to rebuild images before starting services:

```bash
# Rebuild images and start all services (with fresh code changes)
docker-compose -f docker-compose.prod.yml up --build -d

# Alternative: Rebuild specific service images
docker-compose -f docker-compose.prod.yml build backend frontend
docker-compose -f docker-compose.prod.yml up -d
```

**When to use `--build`:**
- After code changes in the application source
- When Dockerfile or dependencies have been modified
- For deploying the latest version from your development environment
- When troubleshooting image-related issues

**Note**: The `--build` flag will rebuild all service images, which may take additional time depending on your system performance and the scope of changes.

### Alternative: Automated Build Script

For convenience, you can use the provided build script:

```bash
# Execute automated production build
bash scripts/build-prod.sh
```

**⚠️ Important Warning**: The [`build-prod.sh`](scripts/build-prod.sh) script includes a Docker system purge command (`docker system prune -f`) that removes unused Docker images, containers, and build cache. This will free up disk space but may require rebuilding other Docker images on your system.

### Service Access Points

Once deployed, access the application through these endpoints:

- **🌐 Frontend Application**: [http://localhost:3000](http://localhost:3000)
- **🔧 Backend API**: [http://localhost:4000](http://localhost:4000)
- **📊 GraphQL Playground**: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- **📚 API Documentation**: [http://localhost:4000/api](http://localhost:4000/api)
- **🗄️ Database Admin (Adminer)**: [http://localhost:8080](http://localhost:8080)

## Architecture Overview

The production environment consists of multiple containerized services managed via Docker Compose:

### Core Services

- **🐘 PostgreSQL Database** (port 5432)
  - PostgreSQL 17 Alpine image for optimal performance
  - Persistent data storage using named Docker volumes
  - Pre-configured database schema and initial data
  - Automatic backup-friendly volume management

- **🚀 Backend API Server** (port 4000)
  - NestJS 11 application with Fastify adapter for high performance
  - GraphQL API with Apollo Server integration
  - REST API endpoints with OpenAPI/Swagger documentation
  - MikroORM 6.5 with PostgreSQL 17 integration
  - Health monitoring with `/api/healthcheck` endpoint
  - Production-optimized multi-stage Docker build ([`Dockerfile.prod`](apps/backend/Dockerfile.prod))
  - See [Backend Documentation](apps/backend/README.md) for detailed architecture

- **🌐 Frontend Application** (port 3000)
  - Next.js 15.2 with React 19 Server Components
  - Tailwind CSS 4 with Shadcn/ui components
  - Standalone output for minimal container footprint
  - Optimized multi-stage Docker build with static asset optimization
  - Production-ready error boundaries and monitoring
  - See [Frontend Documentation](apps/frontend/README.md) for component architecture

- **🗄️ Database Administration** (port 8080)
  - Adminer interface with Dracula theme
  - Direct PostgreSQL database access and management
  - Query execution and data visualization tools

### CLI Service

The production setup includes a specialized CLI service for database operations:

- **Database Migrations**: Schema version control and automated deployment
- **Data Seeding**: Initial cryptocurrency data and reference tables
- **Maintenance Tasks**: Database maintenance and administrative operations

For detailed information about available CLI commands, refer to the [Backend Documentation](apps/backend/README.md#database-management).

## Database Management

### Migration Management

The application uses MikroORM for database schema management with automated migration support:

```bash
# Fresh database setup (drops and recreates all tables)
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli migration:fresh

# Standard migration (incremental updates)
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli migration:up

# List migration status
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli migration:list
```

### Data Seeding

Initialize the database with cryptocurrency data and reference tables:

```bash
# Run all seeders (assets, trading pairs, data providers, price history)
docker-compose -f docker-compose.prod.yml --profile cli run --rm cli seeder:run
```

**Note**: Seeding requires a valid CoinMarketCap API key configured in your `.env` file. The seeding process will populate the database with current market data and establish trading pair relationships.

## Configuration Management

### Environment Variables Reference

All configuration is managed through environment variables defined in `.env`. Reference the [`env.example`](env.example) template for complete variable descriptions:

#### Required Configuration
| Variable                              | Description                          | Example               |
| ------------------------------------- | ------------------------------------ | --------------------- |
| `DATA_PROVIDER_COINMARKETCAP_API_KEY` | CoinMarketCap API authentication key | `your_api_key_here`   |
| `DATABASE_PASSWORD`                   | PostgreSQL database password         | `secure_password_123` |

#### Optional Configuration  
| Variable                          | Default         | Description                                |
| --------------------------------- | --------------- | ------------------------------------------ |
| `DATA_PROVIDER_FETCH_INTERVAL_MS` | `60000`         | Price data update frequency (milliseconds) |
| `DATABASE_NAME`                   | `cryptotracker` | PostgreSQL database name                   |
| `DATABASE_USER`                   | `postgres`      | PostgreSQL username                        |

### External API Integration

The application integrates with external cryptocurrency data providers:

- **CoinMarketCap API**: Primary data source for real-time pricing and market data
- **Extensible Provider System**: Architecture supports multiple data sources with automatic failover

For detailed information about data provider configuration, see the [Price Fetching Module Documentation](apps/backend/src/app/price-fetching/README.md).

## Operations Management

### Service Control

**Standard shutdown:**
```bash
# Gracefully stop all services
docker-compose -f docker-compose.prod.yml down
```

**Complete cleanup (⚠️ Data Loss Warning):**
```bash
# Stop services and remove all data volumes
docker-compose -f docker-compose.prod.yml down -v
```

**Selective service management:**
```bash
# Restart specific service
docker-compose -f docker-compose.prod.yml restart backend

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Scale services (if configured for horizontal scaling)
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

### Health Monitoring

The production deployment includes comprehensive health monitoring:

- **Backend Health Endpoint**: [http://localhost:4000/api/healthcheck](http://localhost:4000/api/healthcheck)
- **Service Dependencies**: Health checks ensure proper startup order
- **Automatic Restart**: Services automatically restart on failure unless explicitly stopped
- **Container Status**: Monitor with `docker-compose -f docker-compose.prod.yml ps`

### Log Management

```bash
# View all service logs
docker-compose -f docker-compose.prod.yml logs -f

# View specific service logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Tail logs with timestamp
docker-compose -f docker-compose.prod.yml logs -f --timestamps
```

## Troubleshooting Guide

### Common Issues and Solutions

#### 1. Build and Deployment Issues

**Problem**: Docker build failures or context issues
```bash
# Solution: Clear Docker build cache
docker system prune -f
docker-compose -f docker-compose.prod.yml build --no-cache
```

**Problem**: Port conflicts during startup
```bash
# Solution: Check port availability
netstat -tulpn | grep -E ':(3000|4000|5432|8080)'
# Stop conflicting services or modify port mappings in docker-compose.prod.yml
```

#### 2. API and Configuration Issues

**Problem**: CoinMarketCap API errors
```bash
# Verify API key configuration
docker-compose -f docker-compose.prod.yml logs backend | grep -i "coinmarketcap\|api"

# Test API key validity
curl -H "X-CMC_PRO_API_KEY: your_api_key" \
     "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=1"
```

**Problem**: Database connection issues
```bash
# Check database service health
docker-compose -f docker-compose.prod.yml exec database pg_isready -U postgres

# Verify environment variables
docker-compose -f docker-compose.prod.yml config
```

#### 3. Performance and Resource Issues

**Problem**: High memory usage or slow response times
```bash
# Monitor resource usage
docker stats

# Check service health and response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:4000/api/healthcheck
```

### Debug Mode

For detailed troubleshooting, enable debug logging:

```bash
# Set debug environment and restart services
echo "LOG_LEVEL=debug" >> .env
docker-compose -f docker-compose.prod.yml restart backend
```

## Production Infrastructure Files

This production deployment utilizes the following configuration files:

| File                                                             | Purpose                                | Documentation                           |
| ---------------------------------------------------------------- | -------------------------------------- | --------------------------------------- |
| [`docker-compose.prod.yml`](docker-compose.prod.yml)             | Production orchestration configuration | Multi-service container definition      |
| [`apps/backend/Dockerfile.prod`](apps/backend/Dockerfile.prod)   | Backend production container build     | Multi-stage optimized Docker build      |
| [`apps/frontend/Dockerfile.prod`](apps/frontend/Dockerfile.prod) | Frontend production container build    | Next.js standalone output configuration |
| [`.env`](#environment-configuration)                             | Environment variable configuration     | Production settings and secrets         |
| [`scripts/build-prod.sh`](scripts/build-prod.sh)                 | Automated deployment script            | One-command production deployment       |

## Development vs Production Differences

This production configuration provides several optimizations over the development setup:

### Build Optimizations
- **Multi-stage Docker builds** for minimal container size and improved security
- **Next.js standalone output** for frontend with static asset optimization
- **Production-specific Dockerfiles** with optimized base images and dependencies
- **Build cache optimization** with proper `.dockerignore` configuration

### Runtime Configuration  
- **Health checks** with automatic restart policies for high availability
- **Service dependency management** with proper startup order and health conditions  
- **Named volumes** for persistent data storage and backup compatibility
- **Production environment variables** for optimal performance and security

### Monitoring and Maintenance
- **Automated CLI tools** for database migrations and seeding operations
- **Comprehensive logging** with structured output for monitoring systems
- **Health monitoring endpoints** for integration with monitoring platforms
- **Graceful shutdown** handling for zero-downtime deployments

## Related Documentation

For comprehensive understanding of the application architecture and development workflow:

### Core Documentation
- **[Main Project README](README.md)** - Complete project overview and development setup
- **[Backend API Documentation](apps/backend/README.md)** - NestJS architecture and API reference
- **[Frontend Application Guide](apps/frontend/README.md)** - Next.js components and routing

### Module-Specific Documentation
- **[Crypto Module](apps/backend/src/app/crypto/README.md)** - Core cryptocurrency functionality
- **[Price Fetching Module](apps/backend/src/app/price-fetching/README.md)** - External API integration
- **[GraphQL Schema](libs/shared/graphql/README.md)** - Shared type definitions and API contracts

### Additional Resources
- **[License Information](LICENSE.md)** - Legal terms and usage permissions
- **Environment Template**: [`env.example`](env.example) - Configuration reference
