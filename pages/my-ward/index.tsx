import { dehydrate, QueryClient } from 'react-query';
import api from '@/src/api/core';

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/MyWard';

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['myWard/getMyWard'], getMyWard);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export function getMyWard() {
  return api.get({ url: '/api/ward' });
}
