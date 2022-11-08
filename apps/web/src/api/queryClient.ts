import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry(failureCount, error) {
        // TODO add global custom retry logic here
        // based off event typings
        // For now just disable automatic retrying
        // https://tanstack.com/query/v4/docs/guides/query-retries
        return false;
      },
    },
  },
});
