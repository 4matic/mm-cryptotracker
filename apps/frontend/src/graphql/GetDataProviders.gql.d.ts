import { DocumentNode } from 'graphql';
import type { DataProviderModel } from '@mm-cryptotracker/shared-graphql';

// GraphQL Query Response
export interface GetDataProvidersResponse {
  dataProviders: DataProviderModel[];
}

// GraphQL Document
declare const GetDataProvidersDocument: DocumentNode;
export default GetDataProvidersDocument;
