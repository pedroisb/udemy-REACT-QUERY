import { useQuery } from 'react-query';

import type { Treatment } from '../../../../../shared/types';
import { axiosInstance } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
// import { useCustomToast } from '../../app/hooks/useCustomToast';

// for when we need a query function for useQuery
async function getTreatments(): Promise<Treatment[]> {
  const { data } = await axiosInstance.get('/treatments');
  return data;
}

export function useTreatments(): Treatment[] {
  // search Chakra UI's useToast for better understanding
  // const toast = useCustomToast();

  // here we established [] as a default value to be shown while the promise is still pending
  const fallback = [];
  const { data = fallback } = useQuery(queryKeys.treatments, getTreatments);

  // this excerpt was removed from options (along with all toast logic), for it was not needed once we centralized error handling throught QueryClient default options (queries: {onError})
  // , {
  //   onError: (error) => {
  //     // setting error title conditionally - if error is an instance of javascript's Error class
  //     const title =
  //       error instanceof Error
  //         ? error.message
  //         : 'error connecting to the server';
  //     toast({ title, status: 'error' });
  //   },
  // }

  return data;
}
