import api from 'src/api/core';
import { useMutation, useQueryClient } from 'react-query';
import { LIKE_ANSWER, UNLIKE_ANSWER, GET_QUESTION, POST_ANSWER } from 'src/consts/query';

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
      onSuccess: () => queryClient.invalidateQueries(GET_QUESTION),
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
      onSuccess: () => queryClient.invalidateQueries(GET_QUESTION),
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
      onSuccess: () => queryClient.invalidateQueries(GET_QUESTION),
    },
  );
};
