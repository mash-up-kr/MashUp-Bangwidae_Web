// import { dehydrate, QueryClient } from 'react-query';
import api from '@/src/api/core';

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/OpenInquiry';

// export async function getServerSideProps() {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(['openInquiry/getMyInfo'], getMyInfo);
//   await queryClient.prefetchQuery(['openInquiry/getAnsweredQuestion'], getAnsweredQuestion);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export function getMyInfo() {
  return api.get({ url: '/user/me' });
}

export function getAnsweredQuestion() {
  return api.get({ url: '/user/answered-questions?size=3' });
}
