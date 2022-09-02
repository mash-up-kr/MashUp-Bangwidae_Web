import api from 'src/api/core';
import { QueryKey } from 'react-query';

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
export function getQuestionDetail({ queryKey }: { queryKey: QueryKey }): Promise<Question> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, questionId] = queryKey;
  if (questionId) {
    return api.get({
      url: `/api/questions/${questionId}`,
    });
  }
}

export function getUserInfo() {
  return api.get({
    url: `/api/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
