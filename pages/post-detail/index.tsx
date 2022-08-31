import api from 'src/api/core';
// import { dehydrate, QueryClient } from 'react-query';
// import { POST, COMMENTS } from 'src/consts/query';
import { QueryKey } from 'react-query';

const FETCHING_COMMENT_SIZE = 10;

export interface Post {
  anonymous: boolean;
  commentCount: number;
  content: string;
  createdAt: string;
  id: string;
  latitude: number;
  likeCount: number;
  longitude: number;
  representativeAddress: string;
  updatedAt: string;
  user: {
    id: string;
    level: number;
    nickname: string;
    profileImageUrl: string;
    tags: string[];
  };
  userLiked: boolean;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    tags: string[];
    nickname: string;
    profileImageUrl: string;
  };
  content: string;
  likeCount: number;
  commentCount: number;
  userLiked: boolean;
  representativeAddress: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// eslint-disable-next-line consistent-return,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export function getQuestionDetail({ queryKey }: { queryKey: QueryKey }): Promise<Post> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return api.get({
      url: `/api/posts/${postId}`,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export async function getCommentList({ queryKey }: { queryKey: QueryKey }): Promise<Comment[]> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return (
      await api.get({
        url: `/api/posts/${postId}/comment?size=${FETCHING_COMMENT_SIZE}`,
      })
    ).values;
  }
}

export function getUserInfo() {
  return api.get({
    url: `/api/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/PostDetail';
export const TEST_ID = '62e5417127d0d407aaeedb39';
