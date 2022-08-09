import { COMMENTS, LIKE, POST, UNLIKE } from 'src/consts/query';
import api from 'src/api/core';
import { useMutation, useQueryClient } from 'react-query';
import { TEST_ID } from '@/pages/question-detail';

export const useLikeCountCreator = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [LIKE],
    () =>
      api.post({
        url: `/api/posts/${TEST_ID}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(POST),
    },
  );
};

export const useUnlikeCountCreator = () => {
  const queryClient = useQueryClient();
  return useMutation(
    [UNLIKE],
    () =>
      api.delete({
        url: `/api/posts/${TEST_ID}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(POST),
    },
  );
};

export const useCommentCreator = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ['COMMENT_CREATE'],
    (data: { content: string; latitude: number; longitude: number }) =>
      api.post({
        url: `/api/posts/${TEST_ID}/comment`,
        data,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(COMMENTS),
    },
  );
};

export const useCommentUpdater = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ['COMMENT_UPDATE'],
    (data: { commentId: string; content: string; latitude: number; longitude: number }) =>
      api.patch({
        url: `/api/comments/${data.commentId}`,
        data: {
          content: data.content,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(COMMENTS),
    },
  );
};

export const useCommentDeleter = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ['COMMENT_DELETE'],
    (data: { commentId: string }) =>
      api.delete({
        url: `/api/comments/${data.commentId}`,
        data,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(COMMENTS),
    },
  );
};
