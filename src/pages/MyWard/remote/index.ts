/* eslint-disable no-alert */
/* eslint-disable import/prefer-default-export */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/src/api/core';

interface AddressResponse {
  국가: string;
  도?: string;
  시: string;
  군구?: string;
  읍면동?: string;
  리?: string;
  representativeAddress: string;
}

const QUERY_KEYS = {
  EXPAND_WARD_PERIOD: 'EXPAND_WARD_PERIOD',
  DELETE_WARD: 'DELETE_WARD',
};

const COMMON_ERROR_MESSAGE = '에러가 발생했습니다. 다시 시도해주세요.';

export function getRealAddress({ latitude, longitude }: { latitude: number; longitude: number }) {
  if (latitude == null || longitude == null) return null;

  return api.get({
    url: `/place/reverse/geocode?latitude=${latitude}&longitude=${longitude}`,
  }) as Promise<AddressResponse>;
}

export const usePlantWard = ({
  latitude,
  longitude,
}: {
  latitude?: number;
  longitude?: number;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    [QUERY_KEYS.EXPAND_WARD_PERIOD],
    (wardName?: string) =>
      api.post({
        url: '/ward',
        data: { name: wardName, latitude, longitude },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myWard/getMyWard']);
      },
      onError: () => {
        alert(COMMON_ERROR_MESSAGE);
      },
    },
  );
};

export const useExpandWardPeriod = (targetId?: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    [QUERY_KEYS.EXPAND_WARD_PERIOD],
    () =>
      api.post({
        url: `/ward/${targetId}/extend-period`,
        data: { period: 10 },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myWard/getMyWard']);
      },
      onError: () => {
        alert(COMMON_ERROR_MESSAGE);
      },
    },
  );
};

export const useDeleteWard = (targetId?: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    [QUERY_KEYS.DELETE_WARD],
    () =>
      api.delete({
        url: `/ward/${targetId}`,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['myWard/getMyWard']);
      },
      onError: () => {
        alert(COMMON_ERROR_MESSAGE);
      },
    },
  );
};
