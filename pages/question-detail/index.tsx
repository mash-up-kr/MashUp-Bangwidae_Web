import api from 'src/api/core';
import { QueryKey } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const initialData = await api.get({
    url: `/questions/${context.query.questionId}`,
  });
  return { props: { initialData } };
};

// eslint-disable-next-line consistent-return,@typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line consistent-return
export function getQuestionDetail({ queryKey }: { queryKey: QueryKey }): Promise<Question> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [, questionId] = queryKey;
  if (questionId) {
    return api.get({
      url: `/questions/${questionId}`,
      baseURL: `https://doridori.ga/api/v1`,
    });
  }
}

export function getUserInfo() {
  return api.get({
    url: `/user/me`,
  });
}

// eslint-disable-next-line no-restricted-exports
export { default } from 'pages/QuestionDetail';
