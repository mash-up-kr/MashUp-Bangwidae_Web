import api from 'src/api/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  LIKE_ANSWER,
  UNLIKE_ANSWER,
  GET_QUESTION,
  POST_ANSWER,
  PATCH_ANSWER,
  DELETE_ANSWER,
} from 'src/consts/query';

// eslint-disable-next-line import/prefer-default-export
export const useAnswerCreator = (questionId: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    [POST_ANSWER],
    (data: { content: string; latitude: number; longitude: number }) =>
      api.post({
        url: `/api/questions/${questionId}/answer`,
        data,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_QUESTION]),
    },
  );
};

export const useAnswerUpdater = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [PATCH_ANSWER],
    (data: { answerId: string; content: string }) =>
      api.patch({
        url: `/api/answers/${data.answerId}`,
        data: {
          content: data.content,
        },
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_QUESTION]),
    },
  );
};

export const useAnswerDeleter = () => {
  const queryClient = useQueryClient();

  return useMutation(
    [DELETE_ANSWER],
    (data: { answerId: string }) =>
      api.delete({
        url: `/api/answers/${data.answerId}`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_QUESTION]),
    },
  );
};

export const useAnswerLikeCreator = (answerId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [LIKE_ANSWER],
    () =>
      api.post({
        url: `/api/answers/${answerId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_QUESTION]),
    },
  );
};

export const useAnswerUnlikeCreator = (answerId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [UNLIKE_ANSWER],
    () =>
      api.delete({
        url: `/api/answers/${answerId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries([GET_QUESTION]),
    },
  );
};
