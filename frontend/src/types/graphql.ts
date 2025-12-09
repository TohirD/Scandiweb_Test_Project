// Generic GraphQL helper types

export interface GraphQLErrorLocation {
  line: number;
  column: number;
}

export interface GraphQLError {
  message: string;
  locations?: GraphQLErrorLocation[];
  path?: (string | number)[];
}

export interface GraphQLResponse<TData> {
  data?: TData;
  errors?: GraphQLError[];
}

export interface GraphQLRequestOptions<TVariables = Record<string, unknown>> {
  query: string;
  variables?: TVariables;
}
