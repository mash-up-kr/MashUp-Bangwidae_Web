import React, { MouseEvent } from 'react';
import { useQueryClient, useMutation } from 'react-query';
import api from 'src/api/core';
import styled, { useTheme } from 'styled-components';
import { COMMENTS, COMMENT_LIKE, COMMENT_UNLIKE } from 'src/consts/query';
import { typography } from '@/styles';
import { IconTextButton } from '@/src/components';
import { dateTime } from '@/src/utils/DateTime';

interface CommentItemProps {
  comment: Comment;
  onMenuClick: (event: MouseEvent, selectedId: string) => void;
}

export interface Comment {
  id: string;
  user: {
    id: string;
    tags: string[];
    nickname: string;
    profileImageUrl: string;
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

const useLikeCountCreator = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [COMMENT_LIKE],
    () =>
      api.post({
        url: `/api/comments/${commentId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(COMMENTS),
    },
  );
};

const useUnlikeCountCreator = (commentId: string) => {
  const queryClient = useQueryClient();
  return useMutation(
    [COMMENT_UNLIKE],
    () =>
      api.delete({
        url: `/api/comments/${commentId}/like`,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(COMMENTS),
    },
  );
};

function CommentItem({ comment, onMenuClick }: CommentItemProps) {
  const theme = useTheme();
  const { mutate: mutateLikeCount } = useLikeCountCreator(comment.id);
  const { mutate: mutateUnlikeCount } = useUnlikeCountCreator(comment.id);

  const handleLikeButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    comment.userLiked ? mutateUnlikeCount() : mutateLikeCount();
  };

  return (
    <Layout>
      <FlexRow gap={8}>
        <ProfileImage src="https://picsum.photos/200" />
        <FlexBetween>
          <FlexColumn gap={6}>
            <FlexRow gap={8}>
              <Nickname>{comment.user.nickname}</Nickname>
              <LevelTag>Lv.1</LevelTag>
            </FlexRow>
          </FlexColumn>
        </FlexBetween>
        <FlexRow gap={8}>
          <LocatedAt>{comment.representativeAddress}</LocatedAt>
          <CreatedAt>{dateTime.fromNow(comment.createdAt)}</CreatedAt>
          <IconPosition>
            <IconTextButton
              name="more"
              color="#767676"
              size={24}
              onClick={(event) => onMenuClick(event, comment.id)}
            />
          </IconPosition>
        </FlexRow>
      </FlexRow>
      <CommentContent>{comment.content}</CommentContent>
      <FlexBetween>
        <FlexRow gap={8}>
          <IconTextButton color={theme.color.gray.Gray500} size={24} onClick={() => {}}>
            답글 달기
          </IconTextButton>
          <VerticalDivider />
          <IconTextButton
            color={comment.userLiked ? theme.color.primary.Lime300 : theme.color.gray.Gray500}
            size={24}
            onClick={handleLikeButtonClick}
          >
            좋아요
          </IconTextButton>
        </FlexRow>
        <IconTextButton
          name="heart"
          color={theme.color.primary.Lime300}
          size={24}
          iconPosition="right"
          onClick={() => {}}
        >
          <IconText>{comment.likeCount}</IconText>
        </IconTextButton>
      </FlexBetween>
    </Layout>
  );
}

export default CommentItem;

const Layout = styled.div`
  padding: 17px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

const FlexRow = styled.div<{
  gap: number;
}>`
  display: flex;
  align-items: center;
  column-gap: ${({ gap }) => `${gap}px`};
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid #3a3a3a;
  border-radius: 50%;
`;

const FlexBetween = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
`;

const FlexColumn = styled.div<{
  gap: number;
}>`
  display: flex;
  flex-direction: column;
  row-gap: ${({ gap }) => `${gap}px`};
`;

const Nickname = styled.div`
  ${typography.Body_Medium_14}
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
  ::after {
    height: 10px;
    margin-left: 10px;
    border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
    content: '';
  }
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}
`;

const IconPosition = styled.div`
  padding-top: 4px;
`;

const IconText = styled.span`
  color: white;
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
  border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;
