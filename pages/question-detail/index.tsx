import api from 'src/api/core';
import { dehydrate, QueryClient } from 'react-query';
import { POST, COMMENT } from 'src/consts/query';

const { NEXT_PUBLIC_ORIGIN } = process.env;
const FETCHING_COMMENT_SIZE = 10;

export async function getServerSideProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery([POST], getPostDetail);
  await queryClient.prefetchQuery([COMMENT], getCommentList);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export function getPostDetail() {
  return api.get({
    url: `${NEXT_PUBLIC_ORIGIN}/api/posts/${TEST_ID}`,
  });
}

export function getCommentList() {
  return api.get({
    url: `${NEXT_PUBLIC_ORIGIN}/api/posts/${TEST_ID}/comment?size=${FETCHING_COMMENT_SIZE}`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
export const TEST_ID = '62e5417127d0d407aaeedb39';
