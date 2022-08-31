import React from 'react';
import styled from 'styled-components';
import { sendPostMessage } from 'src/utils/sendPostMessage';
import { typography } from '@/styles';
import { dateTime } from '@/src/utils/DateTime';
import Flex from '@/src/components/Flex';
import type { Answer } from '@/pages/question-detail';

const DEFAULT_IMAGE_URL = process.env.NEXT_PUBLIC_DEFAULT_IMAGE;

interface AnswerItemProps {
  answer: Answer;
}

function AnswerItem({ answer }: AnswerItemProps) {
  const handleDeepLinkClick = () => {
    sendPostMessage({
      value: `doridori://main/mypage_other?userId=${answer.user?.id}`,
    });
  };

  return (
    <Layout>
      <Flex direction="row" align="center">
        <ProfileImage
          src={answer.user.profileImageUrl ?? DEFAULT_IMAGE_URL}
          onClick={handleDeepLinkClick}
        />
        <Flex direction="row" justify="space-between">
          <Flex direction="column">
            <Flex direction="row">
              <Nickname>{answer.user.nickname}</Nickname>
              <LevelTag>Lv.{answer.user.level}</LevelTag>
            </Flex>
          </Flex>
        </Flex>
        <Flex direction="row" justify="flex-end" align="center" style={{ flexGrow: 1 }}>
          <LocatedAt>{answer.representativeAddress}</LocatedAt>
          <VerticalDivider />
          <CreatedAt>{dateTime.fromNow(answer.createdAt)}</CreatedAt>
        </Flex>
      </Flex>
      <CommentContent>{answer.content}</CommentContent>
    </Layout>
  );
}

export default AnswerItem;

const Layout = styled.div`
  padding: 17px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid #3a3a3a;
  border-radius: 50%;
`;

const Nickname = styled.div`
  ${typography.Body_Medium_14}
  margin: 0 8px;
`;

const LevelTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 18px;
  color: ${({ theme }) => theme.color.gray.Gray800};
  font-weight: 700;
  font-size: 12px;
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 40px;
`;

const LocatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;

  ${typography.Caption2_Regular_12}
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}
`;

const CommentContent = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  color: white;
  font-size: 14px;
  word-break: break-word;
`;

const VerticalDivider = styled.div`
  height: 10px;
  margin: 0 10px 0 10px;
  border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;
