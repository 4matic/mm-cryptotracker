import { DocumentNode } from 'graphql';
import type { DataProviderModel } from '@mm-cryptotracker/shared-graphql';

// GraphQL Query Response
export interface GetDataProvidersResponse {
  dataProviders: Pick<DataProviderModel, 'name' | 'description'>[];
}

// GraphQL Document
declare const GetDataProvidersDocument: DocumentNode;
export default GetDataProvidersDocument;
