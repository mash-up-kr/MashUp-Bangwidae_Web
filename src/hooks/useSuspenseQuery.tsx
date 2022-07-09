import { QueryFunction, QueryKey, useQuery, UseQueryOptions } from 'react-query';

export interface QueryResult<TData> {
  data: TData;
  status: 'success' | 'idle';
}

export function useSuspenseQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  queryKey: TQueryKey,
  queryFn: QueryFunction<TQueryFnData, TQueryKey>,
  options?: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
) {
  return useQuery(queryKey, queryFn, {
    ...options,
    suspense: true,
  }) as QueryResult<TData>;
}
