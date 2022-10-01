import { useMutation } from '@tanstack/react-query';
import api from 'src/api/core';
import { SET_NOTIFICATION_INFO } from '@/src/consts/query';

// eslint-disable-next-line import/prefer-default-export
export const useNotificationUpdater = (data: {
  notification: boolean;
  nightNotification: boolean;
  locationInfo: boolean;
}) =>
  useMutation(
    [SET_NOTIFICATION_INFO],
    () =>
      api.put({
        url: `/user/settings`,
        data,
      }),
    {
      onSuccess: () => {},
    },
  );
