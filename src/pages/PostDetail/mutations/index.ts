import { COMMENTS, LIKE, POST, UNLIKE, COMMENT_LIKE, COMMENT_UNLIKE } from 'src/consts/query';
import api from 'src/api/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePostLikeCreator = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [LIKE],
    () =>
      api.post({
        url: `/api/posts/${postId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([[POST]]),
    },
  );
};

export const usePostUnlikeCreator = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [UNLIKE],
    () =>
      api.delete({
        url: `/api/posts/${postId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([POST]),
    },
  );
};

export const useCommentCreator = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    ['COMMENT_CREATE'],
    (data: { content: string; latitude: number; longitude: number }) =>
      api.post({
        url: `/api/posts/${postId}/comment`,
        data,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([COMMENTS]),
    },
  );
};

export const useCommentUpdater = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ['COMMENT_UPDATE'],
    (data: {
      commentId: string;
      content: string;
      latitude: number;
      longitude: number;
      anonymous?: boolean;
    }) =>
      api.patch({
        url: `/api/comments/${data.commentId}`,
        data,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([COMMENTS]),
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
      onSuccess: () => queryClient.invalidateQueries([COMMENTS]),
    },
  );
};

export const useCommentLikeCreator = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [COMMENT_LIKE],
    () =>
      api.post({
        url: `/api/comments/${commentId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([COMMENTS]),
    },
  );
};

export const useCommentUnlikeCreator = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [COMMENT_UNLIKE],
    () =>
      api.delete({
        url: `/api/comments/${commentId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([COMMENTS]),
    },
  );
};
