import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  displayName: '@mm-cryptotracker/frontend',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/frontend',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
};

// Create the Next.js Jest config first, then merge with our custom config
const nextJestConfig = createJestConfig(config);

// Extend the Next.js config to handle ES modules from graphql-request
export default async () => {
  const nextConfig = await nextJestConfig();
  return {
    ...nextConfig,
    transformIgnorePatterns: [
      // Keep Next.js defaults but allow graphql-request to be transformed
      ...((nextConfig.transformIgnorePatterns as string[]) || []).filter(
        (pattern) => !pattern.includes('node_modules')
      ),
      'node_modules/(?!(graphql-request|@graphql-tools/.*)/)',
    ],
  };
};
