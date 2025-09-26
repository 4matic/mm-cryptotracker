import 'whatwg-fetch';

// Setup fetch polyfill for Node.js test environment
if (typeof global.fetch === 'undefined') {
  global.fetch = fetch;
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock Next.js link
jest.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ children, href, ...props }: any) => {
      const React = require('react');
      return React.createElement('a', { href, ...props }, children);
    },
  };
});
