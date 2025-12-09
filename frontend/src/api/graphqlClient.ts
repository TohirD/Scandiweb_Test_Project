// import type {
//   GraphQLRequestOptions,
//   GraphQLResponse,
// } from '../types/graphql';

// /**
//  * GraphQL endpoint – you can override via Vite env:
//  * VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
//  */
// const GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql';


// export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
//   options: GraphQLRequestOptions<TVariables>
// ): Promise<TData> {
//   const response = await fetch(GRAPHQL_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       query: options.query,
//       variables: options.variables ?? undefined,
//     }),
//   });

//   if (!response.ok) {
//     const text = await response.text().catch(() => '');
//     throw new Error(
//       `Network error: ${response.status} ${response.statusText} ${text}`
//     );
//   }

//   const json = (await response.json()) as GraphQLResponse<TData>;

//   if (json.errors && json.errors.length > 0) {
//     // You can log more details if needed
//     const message = json.errors.map((e) => e.message).join('; ');
//     throw new Error(`GraphQL error: ${message}`);
//   }

//   if (!json.data) {
//     throw new Error('GraphQL response has no data');
//   }

//   return json.data;
// }



import type {
  GraphQLRequestOptions,
  GraphQLResponse,
} from '../types/graphql';

const GRAPHQL_ENDPOINT = 'http://localhost:8000/graphql';

export async function graphqlRequest<TData, TVariables = Record<string, unknown>>(
  options: GraphQLRequestOptions<TVariables>
): Promise<TData> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: options.query,
      variables: options.variables ?? undefined,
    }),
  });

  // Always read the raw text first so we can debug
  const text = await response.text();

  let parsed: GraphQLResponse<TData> | null = null;

  if (text.trim().length > 0) {
    try {
      parsed = JSON.parse(text) as GraphQLResponse<TData>;
    } catch {
      // Backend returned *something* but it is not valid JSON
      throw new Error(
        `Invalid JSON from backend (status ${response.status}): ${text}`
      );
    }
  }

  // If HTTP is not OK, prefer GraphQL errors, otherwise show HTTP status
  if (!response.ok) {
    const msg =
      parsed?.errors?.map((e) => e.message).join(', ') ||
      `GraphQL request failed with status ${response.status}`;
    throw new Error(msg);
  }

  if (!parsed) {
    throw new Error(
      `Empty response from backend (status ${response.status})`
    );
  }

  if (parsed.errors && parsed.errors.length) {
    throw new Error(parsed.errors.map((e) => e.message).join(', '));
  }

  if (!parsed.data) {
    throw new Error('GraphQL response contained no data');
  }

  return parsed.data;
}
