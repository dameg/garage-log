import { infiniteQueryOptions } from '@tanstack/react-query';

import { type DocumentLogListCursor, getDocumentLogs } from '../api';

import { documentLogKeys } from './document-log.keys';

export const DOCUMENT_LOGS_PAGE_SIZE = 5;

export const documentLogQueries = {
  list: (vehicleId: string) =>
    infiniteQueryOptions({
      queryKey: documentLogKeys.list(vehicleId),
      initialPageParam: null as DocumentLogListCursor | null,
      queryFn: ({ pageParam }) =>
        getDocumentLogs(vehicleId, {
          limit: DOCUMENT_LOGS_PAGE_SIZE,
          createdAt: pageParam?.createdAt,
          id: pageParam?.id,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }),
};
