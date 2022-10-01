import { useMutation, useQueryClient } from 'react-query';
import api from 'src/api/core';
import { QUERY_KEYS } from '@/pages/setting/my-profile';

export const useProfileInfoUpdater = (
  data: { description: string; tags: string[]; representativeWardId: string | null },
  onComplete?: () => void,
) =>
  useMutation(
    [QUERY_KEYS.UPDATE_PROFILE],
    () =>
      api.post({
        url: `/user/profile`,
        data,
      }),
    {
      onSuccess: () => {
        onComplete?.();
      },
    },
  );

// export const useProfileImageUpdater = (formData: FormData) => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     [QUERY_KEYS.UPDATE_PROFILE_IMAGE],
//     () =>
//       api.post({
//         url: `/user/profile/image`,
//         data: formData,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//         // transformRequest: () => ({
//         //   data: formData,
//         //   headers: {
//         //     'Content-Type': 'multipart/form-data',
//         //   },
//         // }),
//       }),
//     {
//       onSuccess: () => {
//         console.log('queryClient', queryClient);
//       },
//     },
//   );
// };

export const useProfileImageResetter = (onComplete: () => void) => {
  const queryClient = useQueryClient();
  return useMutation(
    [QUERY_KEYS.RESET_PROFILE_IMAGE],
    () =>
      api.post({
        url: `/user/profile/image/default`,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(QUERY_KEYS.MY_PROFILE);
        onComplete();
      },
    },
  );
};
