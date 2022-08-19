/* eslint-disable import/prefer-default-export */
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

export function getRealAddress({ latitude, longitude }: { latitude: number; longitude: number }) {
  return api.get({
    url: '/api/place/reverse/geocode',
    data: { latitude, longitude },
  }) as Promise<AddressResponse>;
}
