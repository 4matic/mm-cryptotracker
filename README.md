# MM CryptoTracker

A comprehensive cryptocurrency tracking application built with modern web technologies, featuring real-time price monitoring, historical data analysis, and advanced price calculation algorithms.

## 📸 Screenshots

| Home Page                                      | Trading Pair Details                           | Data Methodology                                             |
| ---------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------ |
| ![Home Page](assets/screenshots/home-page.png) | ![Pair Page](assets/screenshots/pair-page.png) | ![Methodology Page](assets/screenshots/methodology-page.png) |

## 📋 Table of Contents

- [Screenshots](#-screenshots)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Quick Start](#-quick-start)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
  - [Running the Project](#running-the-project)
- [Documentation](#-documentation)
- [Development](#-development)
- [Docker & Deployment](#-docker--deployment)
- [Testing](#-testing)
- [What Can Be Improved](#-what-can-be-improved)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **Real-time Cryptocurrency Tracking**: Monitor live cryptocurrency prices from multiple data providers
- **Advanced Price Calculations**: Multi-hop indirect price calculation with confidence scoring
- **Historical Data Analysis**: Complete OHLCV data storage and visualization
- **Interactive Price Charts**: Responsive charts using Recharts with detailed market data
- **Data Provider Management**: Extensible system supporting multiple external APIs (CoinMarketCap, etc.)
- **GraphQL & REST APIs**: Dual API interfaces for flexible data access
- **Dark Mode Support**: Modern UI with dark theme and responsive design
- **Database Management**: Complete migration and seeding system
- **Real-time Updates**: Automated price fetching with configurable intervals
- **TypeScript**: Full type safety across the entire monorepo
- **Docker Support**: Complete containerization for development and production

## 🛠 Technology Stack

### Core Framework & Monorepo
- **[Nx 21.5.3](https://nx.dev)** - Smart monorepo tools with powerful caching and task orchestration
- **[Node.js 20+](https://nodejs.org)** - Runtime environment (npm package manager recommended)
- **[TypeScript 5.9+](https://www.typescriptlang.org)** - Type safety and modern JavaScript features

### Backend Technologies
- **[NestJS 11](https://nestjs.com)** - Enterprise-grade Node.js framework
- **[Fastify](https://www.fastify.io)** - High-performance web framework (via `@nestjs/platform-fastify`)
- **[GraphQL](https://graphql.org)** - Query language with Apollo Server integration
- **[MikroORM 6.5](https://mikro-orm.io)** - TypeScript ORM with PostgreSQL support
- **[PostgreSQL 17](https://www.postgresql.org)** - Primary database with Alpine Docker image
- **[Swagger/OpenAPI](https://swagger.io)** - API documentation and testing interface
- **[Pino](https://github.com/pinojs/pino)** - High-performance JSON logger
- **[Zod](https://zod.dev)** - Schema validation for configuration and DTOs

### Frontend Technologies
- **[Next.js 15.2](https://nextjs.org)** - React framework with App Router and Server Components
- **[React 19](https://react.dev)** - UI library with latest features
- **[Tailwind CSS 4](https://tailwindcss.com)** - Utility-first CSS framework
- **[Shadcn/ui](https://ui.shadcn.com)** - High-quality accessible UI components
- **[Radix UI](https://www.radix-ui.com)** - Low-level UI primitives
- **[Recharts](https://recharts.org)** - Chart library for data visualization
- **[Lucide React](https://lucide.dev)** - Beautiful icon library

### Development & Quality Tools
- **[Jest 30](https://jestjs.io)** - Testing framework with coverage reporting
- **[Playwright](https://playwright.dev)** - End-to-end testing
- **[ESLint 9](https://eslint.org)** - Code linting with TypeScript support
- **[Prettier 2.6](https://prettier.io)** - Code formatting
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipeline

### DevOps & Deployment
- **[Docker](https://docker.com)** - Containerization with multi-stage builds
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[Adminer](https://www.adminer.org)** - Database administration interface

### External APIs & Services
- **[CoinMarketCap API](https://coinmarketcap.com/api/)** - Primary cryptocurrency data provider
- **Extensible Provider System** - Support for multiple data sources with fallback

## 🏗 Project Architecture

This is an **Nx monorepo** with the following structure:

```
mm-cryptotracker/
├── apps/
│   ├── backend/                 # NestJS API server
│   ├── backend-e2e/            # Backend E2E tests
│   ├── frontend/               # Next.js web application
│   └── frontend-e2e/           # Frontend E2E tests
├── libs/
│   └── shared/
│       └── graphql/            # Shared GraphQL schema definitions
├── assets/
│   └── screenshots/            # Application screenshots
├── runtime/                    # Runtime data (Docker volumes, etc.)
├── docker-compose.yml          # Development containers
├── docker-compose.prod.yml     # Production containers
└── .github/workflows/          # CI/CD pipeline
```

### Key Architecture Principles
- **Clean Architecture**: Layered design with clear separation of concerns
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Modular Design**: Feature-based modules with dependency injection
- **API-First**: GraphQL and REST APIs with comprehensive documentation
- **Extensible Data Providers**: Plugin architecture for multiple price data sources
- **Container-Ready**: Full Docker support for development and production


## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/node?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Running the Project

**Option 1: Two Terminal Setup** (Recommended)
```bash
# Terminal 1: Backend API server
npx nx serve backend

# Terminal 2: Frontend application
npx nx serve frontend
```

**Option 2: Individual Services**
```bash
# Backend only
npx nx serve backend      # API: http://localhost:4000

# Frontend only  
npx nx serve frontend     # Web: http://localhost:3000
```

**Access the application**:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **GraphQL Playground**: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- **Swagger Documentation**: [http://localhost:4000/api](http://localhost:4000/api)
- **Database Admin**: [http://localhost:8080](http://localhost:8080)

## 📚 Documentation

### Application Documentation
- **[Production Setup Guide](PRODUCTION_SETUP.md)** - Complete production deployment instructions
- **[Backend API Documentation](apps/backend/README.md)** - NestJS backend with detailed architecture
- **[Frontend Application](apps/frontend/README.md)** - Next.js frontend with modern React patterns

### Backend Module Documentation
- **[Crypto Module](apps/backend/src/app/crypto/README.md)** - Core cryptocurrency functionality and services
- **[Price Fetching Module](apps/backend/src/app/price-fetching/README.md)** - External API integration and automation
- **[GraphQL API](apps/backend/src/app/crypto/graphql/README.md)** - GraphQL schema and resolver documentation

### Shared Libraries
- **[Shared GraphQL Types](libs/shared/graphql/README.md)** - Common GraphQL schema definitions

### API References
- **GraphQL Playground**: Available at `/graphql` in development
- **OpenAPI/Swagger**: Available at `/api` in development
- **REST API Endpoints**: Comprehensive CRUD operations for all entities

## 🔧 Development

### Common Development Commands

```bash
# Development servers
nx serve backend          # Start backend in watch mode
nx serve frontend         # Start frontend in dev mode

# Building
nx build backend          # Build backend for production
nx build frontend         # Build frontend for production
nx run-many -t build      # Build all projects

# Testing
nx test backend           # Run backend unit tests
nx test frontend          # Run frontend tests
nx e2e backend-e2e        # Run backend E2E tests
nx e2e frontend-e2e       # Run frontend E2E tests
nx run-many -t test       # Run all tests

# Code quality
nx lint backend           # Lint backend code
nx lint frontend          # Lint frontend code
nx run-many -t lint       # Lint all projects

# Database operations
nx run @mm-cryptotracker/backend:migration:create    # Create migration
nx run @mm-cryptotracker/backend:migration:up        # Run migrations
nx run @mm-cryptotracker/backend:seeder:run          # Run seeders
```

### Project Graph Visualization
```bash
npx nx graph              # Visual project dependency graph
```

## 🐳 Docker & Deployment

### Development with Docker
```bash
# Start all services (PostgreSQL + Adminer)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Deployment
```bash
# Production deployment (includes apps)
docker-compose -f docker-compose.prod.yml up --build -d

# Access production services
# Frontend: http://localhost:3000
# Backend: http://localhost:4000
# Database: http://localhost:8080
```

**📖 [Complete Production Setup Guide](PRODUCTION_SETUP.md)**

### Docker Configuration
- **Backend**: Optimized multi-stage build with `Dockerfile.prod`
- **Frontend**: Next.js standalone output for minimal container size
- **Database**: PostgreSQL 17 Alpine with persistent volumes
- **Admin**: Adminer with Dracula theme for database management

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Jest for services and components
- **Integration Tests**: Database and API integration testing
- **E2E Tests**: Playwright for full user journey testing
- **Type Checking**: TypeScript strict mode validation

### Running Tests
```bash
# All tests
nx run-many -t test

# Backend tests
nx test backend --coverage

# Frontend tests  
nx test frontend --watch

# E2E tests
nx e2e frontend-e2e
nx e2e backend-e2e

# CI pipeline tests
nx run-many -t lint test build typecheck
```

### Continuous Integration
GitHub Actions pipeline includes:
- Code quality checks (lint, typecheck)
- Unit and integration tests
- E2E tests with Playwright
- Build verification for all projects

## 🔮 What Can Be Improved

### Backend Enhancements
- **HTTP Authentication for Swagger**: Move from `/api` route to `/swagger`, `/api` should serve OpenAPI JSON schema
- **API Security**: Implement proper authentication and rate limiting
- **Advanced Analytics**: Historical trend analysis and technical indicators
- **WebSocket Support**: Real-time price updates via WebSocket connections
- **Caching Layer**: Redis integration for high-frequency data caching

### Frontend Improvements
- **Historical Data Visualization**: Show historical price data and market statistics on the trading pair page
- **Advanced Charting**: Multiple timeframes, technical indicators, and comparison tools
- **Portfolio Tracking**: User portfolio management and P&L tracking
- **Mobile App**: React Native or PWA for mobile experience
- **Notifications**: Price alerts and portfolio notifications

### Development Experience
- **GraphQL Code Generation**: Add `.d.ts` files generator for `.gql` files in `apps/frontend/src/graphql/`
- **API Testing**: Comprehensive API test suite with fixtures
- **Monitoring**: Application performance monitoring and error tracking
- **Documentation**: Interactive API documentation with examples

### DevOps & Infrastructure
- **Kubernetes**: Production-ready Kubernetes manifests
- **Monitoring**: Prometheus metrics and Grafana dashboards  
- **Logging**: Centralized logging with ELK stack
- **Security**: Security scanning and vulnerability management

## 🤝 Contributing

This is a personal project, so external contributions are not expected. However, the codebase follows best practices:

### Code Quality Standards
- **TypeScript**: Strict mode enabled for all code
- **Testing**: >80% coverage target for critical paths
- **Linting**: ESLint with TypeScript and Prettier integration
- **Documentation**: JSDoc for public APIs and comprehensive READMEs

### Development Guidelines
- Follow **Clean Architecture** principles
- Use **Dependency Injection** for service management
- Implement **Repository Pattern** for data access
- Write **comprehensive tests** for new features
- Update **documentation** for API changes

## 📄 License

**Personal License**

This is a personal project created for learning and demonstration purposes. All rights reserved.

The code is provided as-is for educational reference. Feel free to study the architecture and implementation patterns, but please respect that this is personal work.

**Technologies Used**: All third-party libraries and frameworks maintain their respective licenses.

---

<div align="center">
  <p><strong>Built with ❤️ using modern web technologies</strong></p>
  <p><em>Nx • NestJS • Next.js • TypeScript • GraphQL • PostgreSQL</em></p>
</div>
