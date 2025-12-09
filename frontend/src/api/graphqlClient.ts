
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

  const text = await response.text();

  let parsed: GraphQLResponse<TData> | null = null;

  if (text.trim().length > 0) {
    try {
      parsed = JSON.parse(text) as GraphQLResponse<TData>;
    } catch {
      throw new Error(
        `Invalid JSON from backend (status ${response.status}): ${text}`
      );
    }
  }

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
