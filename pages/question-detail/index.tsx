import api from 'src/api/core';
// import { dehydrate, QueryClient } from 'react-query';
// import { POST, COMMENTS } from 'src/consts/query';

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

export function getPostDetail() {
  return api.get({
    url: `/api/posts/${TEST_ID}`,
  });
}

export function getCommentList() {
  return api.get({
    url: `/api/posts/${TEST_ID}/comment?size=${FETCHING_COMMENT_SIZE}`,
  });
}

export function getUserInfo() {
  return api.get({
    url: `/api/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
export const TEST_ID = '62e5417127d0d407aaeedb39';
