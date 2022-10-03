import api from 'src/api/core';
import { QueryKey } from '@tanstack/react-query';

export interface Answer {
  content: string;
  createdAt: string;
  id: string;
  likeCount: number;
  representativeAddress: string;
  user: {
    id: string;
    level: number;
    nickname: string;
    profileImageUrl: string;
    tags: string[];
  };
  userLiked: boolean;
}

export interface Question {
  anonymous: boolean;
  answer: Answer;
  content: string;
  createdAt: string;
  fromUser: {
    id: string;
    level: number;
    nickname: string;
    profileImageUrl: string;
    tags: string[];
  };
  id: string;
  representativeAddress: string;
  toUser: {
    id: string;
    level: number;
    nickname: string;
    profileImageUrl: string;
    tags: string[];
  };
}

// eslint-disable-next-line consistent-return,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export async function getQuestionDetail({
  queryKey,
}: {
  queryKey: QueryKey;
}): Promise<Question | null> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, questionId] = queryKey;
  if (questionId) {
    return api.get({
      url: `/questions/${questionId}`,
    });
  }
  return null;
}

export function getUserInfo() {
  return api.get({
    url: `/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
