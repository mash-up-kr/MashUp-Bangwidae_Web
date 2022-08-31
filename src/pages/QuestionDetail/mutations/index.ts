import api from 'src/api/core';
import { useMutation, useQueryClient } from 'react-query';
import { GET_QUESTION, POST_ANSWER } from 'src/consts/query';

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
