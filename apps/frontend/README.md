# MM CryptoTracker Frontend

A modern Next.js application for tracking cryptocurrency prices with detailed analysis and historical data. Built with React 19, Next.js 15, and Tailwind CSS.

## 🚀 Features

- **Real-time Cryptocurrency Tracking**: Monitor cryptocurrency prices with live updates
- **Detailed Trading Pair Analysis**: View comprehensive data for individual trading pairs
- **Interactive Price Charts**: Visualize price trends with responsive charts using Recharts
- **Methodology Documentation**: Transparent data sourcing and calculation methodology
- **Dark Mode Support**: Built-in dark theme with next-themes
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **GraphQL Integration**: Efficient data fetching with GraphQL queries

## 🛠 Tech Stack

### Core Framework
- **Next.js 15.5.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **Shadcn/ui** - High-quality accessible UI components
- **Radix UI** - Low-level UI primitives
- **Lucide React** - Icon library
- **Geist Font** - Modern typography

### Data & State Management
- **GraphQL** - API query language
- **graphql-request** - GraphQL client
- **React Hook Form** - Forms with validation
- **Zod** - Schema validation

### Charts & Visualization
- **Recharts** - Chart library for React
- **Embla Carousel** - Carousel components

### Development Tools
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
│   │   ├── header.tsx         # Site header
│   │   ├── pair-*.tsx         # Trading pair related components
│   │   ├── price-*.tsx        # Price related components
│   │   └── theme-provider.tsx # Theme management
│   ├── graphql/               # GraphQL queries and types
│   │   ├── *.gql             # GraphQL query files
│   │   └── *.gql.d.ts        # Generated TypeScript types
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

- Node.js 18+
- npm package manager
- Backend GraphQL API running

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

The frontend uses GraphQL for data fetching with these main queries:

- `GetTradingPairs` - Fetch paginated trading pairs
- `GetTradingPair` - Fetch single trading pair by slug
- `GetDataProviders` - Fetch data provider information

### Server Actions

Located in `src/lib/actions.ts`, these provide server-side data fetching:

- `getTradingPairs()` - Fetches trading pairs with pagination
- `getTradingPair(slug)` - Fetches individual trading pair
- `getDataProviders()` - Fetches data provider information

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

1. **Pages** use Server Actions to fetch data
2. **Server Actions** make GraphQL requests to the backend
3. **Components** receive data as props from pages
4. **UI Components** render the data with Tailwind styling

## 🌐 Environment Variables

| Variable              | Description          | Required | Default |
| --------------------- | -------------------- | -------- | ------- |
| `BACKEND_GRAPHQL_URL` | GraphQL API endpoint | Yes      | -       |

## 📦 Dependencies

### Production Dependencies

- **UI Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS, Radix UI components
- **Data Fetching**: GraphQL, graphql-request
- **Charts**: Recharts, date-fns
- **Forms**: React Hook Form, Zod validation
- **Analytics**: Vercel Analytics

### Development Dependencies

- **Build Tools**: TypeScript, Tailwind PostCSS
- **Testing**: Jest, Testing Library
- **Code Quality**: ESLint configuration

## 🚀 Deployment

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

## 🤝 Contributing

1. Follow the established code style and patterns
2. Use TypeScript for all new code
3. Write tests for new functionality
4. Follow the component structure conventions
5. Update documentation as needed

## 📝 License

This project is part of the MM CryptoTracker monorepo. See the main README for license information.
