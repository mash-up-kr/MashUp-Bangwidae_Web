import api from 'src/api/core';
// import { dehydrate, QueryClient } from '@tanstack/react-query';
// import { POST, COMMENTS } from 'src/consts/query';
import { QueryKey } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

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
    level: number;
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { postId } = context.query;

  const initialPostData = await api.get({
    url: `/posts/${postId}`,
  });

  const initialCommentData = await api.get({
    url: `/posts/${postId}/comment?size=${FETCHING_COMMENT_SIZE}`,
  });

  return { props: { initialPostData, initialCommentData: initialCommentData.values } };
};

// eslint-disable-next-line consistent-return,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export async function getPostDetail({ queryKey }: { queryKey: QueryKey }): Promise<Post | null> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return api.get({
      url: `/posts/${postId}`,
    });
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export async function getCommentList({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<Comment[] | null> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, postId] = queryKey;
  if (postId) {
    return (
      await api.get({
        url: `/posts/${postId}/comment?size=${FETCHING_COMMENT_SIZE}`,
      })
    ).values;
  }
  return null;
}

export function getUserInfo() {
  return api.get({
    url: `/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/PostDetail';
export const TEST_ID = '62e5417127d0d407aaeedb39';
