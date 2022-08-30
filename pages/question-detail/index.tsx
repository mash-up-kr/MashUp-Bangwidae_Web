import api from 'src/api/core';
// import { dehydrate, QueryClient } from 'react-query';
// import { POST, COMMENTS } from 'src/consts/query';
import { QueryKey } from 'react-query';

const FETCHING_COMMENT_SIZE = 10;

// export async function getServerSideProps() {
//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery([POST], getPostDetail);
//   await queryClient.prefetchQuery([COMMENTS], getCommentList);

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

export function getPostDetail({ queryKey }: { queryKey: QueryKey }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return api.get({
      url: `/api/posts/${postId}`,
    });
  }
  return {};
}

export function getCommentList({ queryKey }: { queryKey: QueryKey }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return api.get({
      url: `/api/posts/${postId}/comment?size=${FETCHING_COMMENT_SIZE}`,
    });
  }
  return { values: [] };
}

export function getUserInfo() {
  return api.get({
    url: `/api/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
export const TEST_ID = '62e5417127d0d407aaeedb39';
