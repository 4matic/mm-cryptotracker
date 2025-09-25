/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;
  export = Schema;
  export default Schema;
}

// TypeScript definitions for GraphQL files are available in corresponding .gql.d.ts files
// Example usage:
// import GetTradingPairDocument from './GetTradingPair.gql'
// import type { GetTradingPairResponse, GetTradingPairVariables } from './GetTradingPair.gql.d.ts'

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const Schema: DocumentNode;
  export = Schema;
  export default Schema;
}
