# MM CryptoTracker Frontend

A modern Next.js application for tracking cryptocurrency prices with detailed analysis and historical data. Built with React 19, Next.js 15, and Tailwind CSS.

> 📖 **This is part of the MM CryptoTracker monorepo.** For complete project information, setup instructions, and overall architecture, see the **[main project README](../../README.md)**.

## 📋 Table of Contents

- [MM CryptoTracker Frontend](#mm-cryptotracker-frontend)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Features](#-features)
  - [⚠️ Current Limitations](#️-current-limitations)
  - [🛠 Tech Stack](#-tech-stack)
    - [Frontend-Specific Technologies](#frontend-specific-technologies)
      - [Core Framework](#core-framework)
      - [UI \& Styling](#ui--styling)
      - [Data \& State Management](#data--state-management)
      - [Charts \& Visualization](#charts--visualization)
      - [Development Tools](#development-tools)
  - [📁 Project Structure](#-project-structure)
  - [🚦 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Available Scripts](#available-scripts)
  - [🔧 Configuration](#-configuration)
    - [Next.js Configuration](#nextjs-configuration)
    - [TypeScript Configuration](#typescript-configuration)
    - [Shadcn/ui Configuration](#shadcnui-configuration)
  - [📊 GraphQL Integration](#-graphql-integration)
    - [GraphQL Query Files](#graphql-query-files)
    - [Server Actions](#server-actions)
    - [Section Components](#section-components)
      - [TradingPairsSection (`src/components/trading-pairs-section.tsx`)](#tradingpairssection-srccomponentstrading-pairs-sectiontsx)
      - [DataProvidersSection (`src/components/data-providers-section.tsx`)](#dataproviderssection-srccomponentsdata-providers-sectiontsx)
  - [🎨 Styling](#-styling)
    - [Tailwind CSS](#tailwind-css)
    - [Component Library](#component-library)
  - [🧪 Testing](#-testing)
    - [Jest Configuration](#jest-configuration)
    - [Running Tests](#running-tests)
  - [🔄 Data Flow](#-data-flow)
    - [Key Benefits of This Architecture:](#key-benefits-of-this-architecture)
  - [🌐 Environment Variables](#-environment-variables)
    - [Required Variables](#required-variables)
    - [Optional Variables](#optional-variables)
    - [Next.js System Variables](#nextjs-system-variables)
    - [Environment File Setup](#environment-file-setup)
  - [📦 Dependencies](#-dependencies)
    - [Production Dependencies](#production-dependencies)
    - [Development Dependencies](#development-dependencies)
  - [🚀 Deployment](#-deployment)
    - [Frontend-Only Deployment](#frontend-only-deployment)
    - [Full Stack Deployment](#full-stack-deployment)
  - [🤝 Contributing](#-contributing)
  - [📝 License](#-license)

## 🚀 Features

- **Real-time Cryptocurrency Tracking**: Monitor cryptocurrency prices with live updates
- **Detailed Trading Pair Analysis**: View comprehensive data for individual trading pairs
- **Interactive Price Charts**: Visualize price trends with responsive charts using Recharts
- **Methodology Documentation**: Transparent data sourcing and calculation methodology
- **Dark Mode Support**: Built-in dark theme with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **GraphQL Integration**: Efficient data fetching with GraphQL queries

## ⚠️ Current Limitations

- **Historical Chart Data**: Temporarily unavailable - feature not yet implemented
- **Market Statistics**: Temporarily unavailable - feature not yet implemented

## 🛠 Tech Stack

> 🔗 **For the complete technology stack** including backend, database, and DevOps technologies, see the **[main Tech Stack section](../../README.md#-technology-stack)**.

### Frontend-Specific Technologies

#### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience

#### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality accessible UI components
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Icon library
- **Geist Font** - Modern typography

#### Data & State Management
- **GraphQL** - API query language
- **graphql-request** - GraphQL client

#### Charts & Visualization
- **Recharts** - Chart library for React
- **Embla Carousel** - Carousel components

#### Development Tools
- **Jest** - Testing framework
- **ESLint** - Code linting
- **Nx** - Monorepo management

## 📁 Project Structure

```
apps/frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout component
│   │   ├── page.tsx           # Home page
│   │   ├── methodology/       # Data methodology page
│   │   └── pair/[slug]/       # Dynamic trading pair pages
│   ├── components/            # React components
│   │   ├── ui/                # Shadcn/ui components
│   │   ├── asset-price.tsx    # Price display components
│   │   ├── data-provider.tsx  # Data provider information
│   │   ├── data-providers-section.tsx # Data providers section with fetching logic
│   │   ├── header.tsx         # Site header
│   │   ├── pair-*.tsx         # Trading pair related components
│   │   ├── price-*.tsx        # Price related components
│   │   ├── theme-provider.tsx # Theme management
│   │   └── trading-pairs-section.tsx # Trading pairs section with fetching logic
│   ├── graphql/               # GraphQL queries and TypeScript definitions
│   │   ├── GetTradingPairs.gql      # Trading pairs pagination query
│   │   ├── GetTradingPair.gql       # Single trading pair query
│   │   ├── GetDataProviders.gql     # Data providers query
│   │   └── *.gql.d.ts              # Generated TypeScript definitions
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   │   ├── actions.ts         # Server actions
│   │   ├── types.ts           # TypeScript types
│   │   └── utils.ts           # Utility functions
│   ├── enums/                 # TypeScript enums
│   └── styles/                # Additional styling
├── public/                    # Static assets
├── jest.config.ts             # Jest configuration
├── next.config.ts             # Next.js configuration
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── components.json            # Shadcn/ui configuration
```

## 🚦 Getting Started

### Prerequisites

> 🔗 **For complete project setup** including database configuration and backend setup, follow the **[main Quick Start guide](../../README.md#-quick-start)**.

**Frontend-specific requirements:**
- Node.js 18+
- npm package manager
- Backend GraphQL API running (see [Backend Documentation](../backend/README.md))

### Installation

1. **Install dependencies**:
   ```bash
   # From the workspace root
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the frontend directory:
   ```env
   BACKEND_GRAPHQL_URL=http://localhost:4000/graphql
   ```
   See the [Environment Variables](#🌐-environment-variables) section for complete configuration options.

3. **Start the development server**:
   ```bash
   # From the workspace root
   nx dev frontend
   # or
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
nx dev frontend          # Start development server
nx build frontend        # Build for production
nx start frontend        # Start production server

# Quality Assurance
nx lint frontend         # Run ESLint
nx test frontend         # Run Jest tests

# Nx-specific commands
nx serve frontend        # Alternative to dev
nx build-deps frontend   # Build dependencies
nx watch-deps frontend   # Watch dependencies
```

## 🔧 Configuration

### Next.js Configuration

The app uses a custom Next.js configuration (`next.config.ts`) that includes:

- **Nx Integration**: Seamless monorepo support
- **GraphQL Loader**: Support for `.gql` files
- **Image Optimization**: Remote pattern support
- **Security Headers**: Disabled powered-by header

### TypeScript Configuration

- Extends workspace base configuration
- Path mapping with `@/*` alias
- Next.js plugin integration
- Strict type checking enabled

### Shadcn/ui Configuration

- **Style**: New York variant
- **Base Color**: Neutral
- **RSC**: React Server Components enabled
- **CSS Variables**: Enabled for theming

## 📊 GraphQL Integration

> 🔗 **For GraphQL schema details and shared types**, see the **[Shared GraphQL Library Documentation](../../libs/shared/graphql/README.md)**.

The frontend uses GraphQL for data fetching with these main queries:

- `GetTradingPairs` - Fetch paginated trading pairs with pagination support
- `GetTradingPair` - Fetch single trading pair by slug with detailed asset information  
- `GetDataProviders` - Fetch data provider information

### GraphQL Query Files

Located in `src/graphql/`, the application uses `.gql` files for GraphQL queries with corresponding TypeScript definitions:

```
src/graphql/
├── GetTradingPairs.gql          # Trading pairs pagination query
├── GetTradingPairs.gql.d.ts     # TypeScript definitions
├── GetTradingPair.gql           # Single trading pair query
├── GetTradingPair.gql.d.ts      # TypeScript definitions  
├── GetDataProviders.gql         # Data providers query
└── GetDataProviders.gql.d.ts    # TypeScript definitions
```

**Key Features:**
- **Type Safety**: Generated TypeScript definitions provide full type safety
- **Code Completion**: IDE support with auto-completion for queries and variables
- **Webpack Integration**: `.gql` files are loaded via `graphql-tag/loader`
- **Shared Types**: Uses types from `@mm-cryptotracker/shared-graphql` library

### Server Actions

Located in `src/lib/actions.ts`, these provide server-side data fetching:

- `getTradingPairs()` - Fetches trading pairs with pagination
- `getTradingPair(slug)` - Fetches individual trading pair
- `getDataProviders()` - Fetches data provider information

### Section Components

The application uses specialized section components that encapsulate data fetching and presentation:

#### TradingPairsSection (`src/components/trading-pairs-section.tsx`)
- **Purpose**: Handles trading pairs data fetching and display
- **Features**:
  - Configurable pagination (`page`, `limit`, `isVisible` props)
  - Built-in error handling with user-friendly error messages
  - Renders `PriceTable` component when data loads successfully
  - Fallback UI for empty states and loading errors

#### DataProvidersSection (`src/components/data-providers-section.tsx`)
- **Purpose**: Manages data provider information display
- **Features**:
  - Fetches data provider information independently
  - Displays external data providers with status badges
  - Shows data collection methodology and update frequency
  - Graceful error handling that doesn't break page rendering

**Benefits of Section Components:**
- **Encapsulation**: Each component manages its own data lifecycle
- **Error Boundaries**: Failures are isolated to individual sections
- **Reusability**: Components can be easily reused across different pages
- **Maintainability**: Data fetching logic lives close to the UI that consumes it

## 🎨 Styling

### Tailwind CSS

- **Version**: 4.1.13 with PostCSS plugin
- **Theme**: Custom dark theme with CSS variables
- **Components**: Utility-first approach with component composition

### Component Library

Uses Shadcn/ui components built on Radix UI primitives:

- Fully accessible components
- Customizable with CSS variables
- Dark mode support
- TypeScript integration

## 🧪 Testing

### Jest Configuration

- **Framework**: Jest with Next.js integration
- **Environment**: jsdom for browser simulation
- **Coverage**: Configured for coverage reporting
- **Transform**: Handles TypeScript, JSX, and GraphQL files

### Running Tests

```bash
nx test frontend           # Run all tests
nx test frontend --watch   # Run tests in watch mode
nx test frontend --coverage # Run with coverage report
```

## 🔄 Data Flow

> 🔗 **For backend API details and data architecture**, see the **[Backend Documentation](../backend/README.md)**, **[Crypto Module Documentation](../backend/src/app/crypto/README.md)**, and **[Price Fetching Documentation](../backend/src/app/price-fetching/README.md)**.

The application follows a component-based data fetching architecture:

1. **Section Components** (`TradingPairsSection`, `DataProvidersSection`) handle their own data fetching
2. **Server Actions** in `lib/actions.ts` make GraphQL requests to the backend
3. **Section Components** manage error states and render appropriate UI components
4. **Pages** compose multiple section components without handling data fetching directly
5. **UI Components** receive processed data as props and render with Tailwind styling

### Key Benefits of This Architecture:
- **Separation of Concerns**: Each component handles its own data and error states
- **Reusability**: Section components can be used across different pages
- **Error Isolation**: Failures in one section don't affect others
- **Maintainability**: Data fetching logic is co-located with the components that use it

## 🌐 Environment Variables

### Required Variables

| Variable              | Description          | Required | Default | Example                         |
| --------------------- | -------------------- | -------- | ------- | ------------------------------- |
| `BACKEND_GRAPHQL_URL` | GraphQL API endpoint | Yes      | -       | `http://localhost:4000/graphql` |

### Optional Variables

| Variable                  | Description                              | Required | Default       | Example      |
| ------------------------- | ---------------------------------------- | -------- | ------------- | ------------ |
| `USE_LOGGER`              | Enable logging with pino and next-logger | No       | `false`       | `true`       |
| `NODE_ENV`                | Node.js environment                      | No       | `development` | `production` |
| `PORT`                    | Server port                              | No       | `3000`        | `3000`       |
| `HOSTNAME`                | Server hostname                          | No       | `localhost`   | `0.0.0.0`    |
| `NEXT_TELEMETRY_DISABLED` | Disable Next.js telemetry                | No       | `false`       | `1`          |

### Next.js System Variables

| Variable       | Description                 | Set By  | Usage                                 |
| -------------- | --------------------------- | ------- | ------------------------------------- |
| `NEXT_RUNTIME` | Next.js runtime environment | Next.js | Used internally for runtime detection |

### Environment File Setup

Create a `.env.local` file in the frontend directory for development:

```env
# Required
BACKEND_GRAPHQL_URL=http://localhost:4000/graphql

# Optional - Enable logging
USE_LOGGER=true

# Optional - Custom port
PORT=3000
```

For production deployment, ensure all required environment variables are set in your deployment platform or Docker configuration.

## 📦 Dependencies

### Production Dependencies

- **UI Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS, Radix UI components
- **Data Fetching**: GraphQL, graphql-request
- **Charts**: Recharts, date-fns

### Development Dependencies

- **Build Tools**: TypeScript, Tailwind PostCSS
- **Testing**: Jest, Testing Library
- **Code Quality**: ESLint configuration

## 🚀 Deployment

> 🔗 **For complete production deployment** including Docker setup, database configuration, and infrastructure, see the **[Production Setup Guide](../../PRODUCTION_SETUP.md)** and **[Docker & Deployment section](../../README.md#-docker--deployment)**.

### Frontend-Only Deployment

The frontend is configured for deployment on Vercel or any Node.js hosting platform:

1. **Build the application**:
   ```bash
   nx build frontend
   ```

2. **Start production server**:
   ```bash
   nx start frontend
   ```

3. **Static Export** (if needed):
   Add `output: 'export'` to `next.config.ts` for static deployment

### Full Stack Deployment

For deploying the entire application with Docker:
```bash
# From the workspace root
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🤝 Contributing

> 🔗 **For general contribution guidelines and project standards**, see the **[main Contributing section](../../README.md#-contributing)**.

**Frontend-specific guidelines:**
1. Follow the established code style and patterns
2. Use TypeScript for all new code
3. Write tests for new functionality
4. Follow the component structure conventions
5. Update documentation as needed

## 📝 License

This project is part of the MM CryptoTracker monorepo. See the **[main README](../../README.md)** for license information.
