// import { dehydrate, QueryClient } from '@tanstack/react-query';
import api from 'src/api/core';
// import { LEVEL_POLICY, MY_LEVEL } from '@/src/consts/query';

export { default } from 'pages/MyLevel';

// export async function getServerSideProps() {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery([MY_LEVEL], getMyLevel);
//   await queryClient.prefetchQuery([LEVEL_POLICY], getLevelPolicy(0));

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export function getMyLevel() {
  return api.get({
    url: `/api/level-policy/achievement`,
  });
}

export const getLevelPolicy = (level: number) => () =>
  api.get({
    url: `/api/level-policy/${level}`,
  });
