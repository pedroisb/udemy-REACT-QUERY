// here createStandaloneToast is being used because useToast is a hook, and, by the rule of hooks, it can only be used on other hooks or functional components, and this is neither
import { createStandaloneToast } from '@chakra-ui/react';
import { QueryClient } from 'react-query';

import { theme } from '../theme';

const toast = createStandaloneToast({ theme });

let i = 0;

function queryErrorHandler(error: unknown): void {
  // error is type unknown because in js, anything can be an error (e.g. throw(5))
  // PS.: this hardcoded id leads to "Warning: Encountered two children with the same key, `react-query-error`" error when multiple errors occur -> implemented solution seen in lecture comments
  const id = `react-query-error${(i -= 1)}`;
  const title =
    error instanceof Error ? error.message : 'error connecting to server';

  // prevent duplicate toasts
  toast.closeAll();
  // needed to add options because cant use customToast here
  toast({ id, title, status: 'error', variant: 'subtle', isClosable: true });
}

// here we are centralizing error handling through QueryClient custom options
// we can still define errorHandler for each useQuery if we want to overwrite the default
// https://react-query.tanstack.com/reference/QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: queryErrorHandler,
    },
  },
});

// Alternatively, we can use React Error Boundary through the usage of defaultOptions' useErrorBoundary
// if set to true, it will propagate errors to the nearest React Error Boundary instead of handling them from within React Query
// https://reactjs.org/docs/error-boundaries.html
