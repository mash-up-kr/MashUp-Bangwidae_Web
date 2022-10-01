import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/api/core';

export const ALARM_QUERY_KEY = {
  ALRAM: 'alarm',
};

export function fetchAlarmList() {
  return api.get({
    url: `/notifications?size=20`,
  });
}

export const useUpdateReadState = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['postNotification'],
    () =>
      api.post({
        url: `/notifications/${id}/read`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([ALARM_QUERY_KEY.ALRAM]),
    },
  );
};
