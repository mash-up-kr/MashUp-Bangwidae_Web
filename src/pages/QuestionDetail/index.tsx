import type { Comment } from 'pages/QuestionDetail/components/CommentItem';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState, ChangeEvent } from 'react';
import styled, { useTheme } from 'styled-components';
import { POST, COMMENTS, LIKE, UNLIKE } from 'src/consts/query';
import { dateTime } from 'src/utils/DateTime';
import api from 'src/api/core';
import { LargeLineButton, IconTextButton } from '@/src/components';
import { typography } from '@/styles';
import { CommentItem, PopupMenu } from './components';
import { getPostDetail, getCommentList, TEST_ID } from '@/pages/question-detail';

const useLikeCountCreator = () => {
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

const useUnlikeCountCreator = () => {
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

const useCommentCreator = () => {
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

function QuestionDetail() {
  const theme = useTheme();
  const [commentInput, setCommentInput] = useState('');

  const {
    data: post,
    isError: isPostError,
    isLoading: isPostLoading,
  } = useQuery([POST], getPostDetail);

  const {
    data: comments,
    isError: isCommentError,
    isLoading: isCommentLoading,
  } = useQuery([COMMENTS], getCommentList);

  const { mutate: mutateUnlikeCount } = useUnlikeCountCreator();
  const { mutate: mutateLikeCount } = useLikeCountCreator();
  const { mutate: mutateCommentCreate } = useCommentCreator();

  const handleLikeButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    post.userLiked ? mutateUnlikeCount() : mutateLikeCount();
  };

  const handleCommentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleCommentInputSubmit = () => {
    const { latitude, longitude } = post;
    mutateCommentCreate({ content: commentInput, latitude, longitude });
    setCommentInput('');
  };

  if (isPostLoading || isCommentLoading) return <div>Loading</div>;
  if (isPostError || isCommentError) return <div>Error</div>;

  return (
    <Layout>
      {/* Top Section */}
      <TopSection>
        {/* Header */}
        <FlexRow gap={8}>
          <ProfileImage src={post.user.profileImageUrl} />
          <FlexBetween>
            <FlexColumn gap={6}>
              <FlexRow gap={8}>
                <Nickname>{post.user.nickname}</Nickname>
                <LevelTag>Lv.1</LevelTag>
              </FlexRow>
              <FlexRow gap={6}>
                {post.user.tags.map((tag: string) => (
                  <InterestTag key={tag}>{tag}</InterestTag>
                ))}
              </FlexRow>
            </FlexColumn>
            <LargeLineButton buttonType="default" onClick={() => {}}>
              질문하기
            </LargeLineButton>
          </FlexBetween>
        </FlexRow>
        <Divider />
        {/* Content */}
        <Content>{post.content}</Content>
        <FlexRow gap={8}>
          <LocatedAt>{post.representativeAddress}</LocatedAt>
          <CreatedAt>{dateTime.fromNow(post.createdAt)}</CreatedAt>
        </FlexRow>
        {/* Menu Group */}
        <MenuGroupPosition>
          <MenuGroup>
            <LeftIcon
              name="hand"
              color={post.userLiked ? theme.color.primary.Lime300 : theme.color.gray.Gray500}
              size={20}
              onClick={handleLikeButtonClick}
            >
              {post.likeCount === 0 ? '궁금해요' : post.likeCount}
            </LeftIcon>
            <CenterIcon name="chat" color={theme.color.gray.Gray500} size={20} onClick={() => {}}>
              {post.commentCount || '댓글'}
            </CenterIcon>
            <RightIcon name="share" color={theme.color.gray.Gray500} size={20} onClick={() => {}}>
              공유
            </RightIcon>
          </MenuGroup>
        </MenuGroupPosition>
      </TopSection>
      {/* Bottom Section */}
      <BottomSection>
        {comments?.values.map((comment: Comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
        <CommentInputWrapper>
          <CommentInput
            type="text"
            placeholder="댓글을 남겨주세요."
            value={commentInput}
            onChange={handleCommentInputChange}
          />
          <CommentSubmitButton onClick={handleCommentInputSubmit}>
            <LargeLineButton buttonType="primary" onClick={() => {}}>
              등록
            </LargeLineButton>
          </CommentSubmitButton>
        </CommentInputWrapper>
      </BottomSection>
      <PopupMenu />
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding-top: 24px;
`;

/* Top Section */

const TopSection = styled.div`
  padding: 0 30px;
`;

const FlexRow = styled.div<{
  gap: number;
}>`
  display: flex;
  align-items: center;
  column-gap: ${({ gap }) => `${gap}px`};
`;

const ProfileImage = styled.img`
  width: 52px;
  height: 52px;
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

const InterestTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 1px 6px;
  color: ${({ theme }) => theme.color.gray.Gray400};
  font-weight: 700;
  font-size: 12px;
  text-align: center;
  background-color: ${({ theme }) => theme.color.gray.Gray800};
  border-radius: 4px;
`;

const Divider = styled.hr`
  margin: 16px 0;
  color: ${({ theme }) => theme.color.gray.Gray800};
  border: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
`;

const Content = styled.div`
  margin: 16px 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 27.2px;
  word-break: break-word;
`;

const LocatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}

  ::after {
    height: 10px;
    margin-left: 10px;
    border-right: 1px solid ${({ theme }) => theme.color.gray.Gray700};
    content: '';
  }
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}
`;

/* Menu Group */

const MenuGroupPosition = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 64px;
`;

const MenuGroup = styled.div`
  position: absolute;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 27px;
  margin-bottom: 20px;
`;

const LeftIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  height: 24px;
`;

const CenterIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  height: 24px;
  border-right: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  border-left: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
`;

const RightIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  height: 24px;
`;

/* Bottom Section */

const BottomSection = styled.div`
  height: 100%;
  margin-top: 64px;
  padding: 0 30px;
  background-color: black;
  border-top: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

const CommentInputWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.color.basic.DarkGray};
`;

const CommentInput = styled.input`
  width: calc(100% - 120px);
  height: 58px;
  margin-left: 30px;
  color: white;
  background-color: transparent;
  border: none;
  ${typography.Title2_Regular_16}
  caret-color: ${({ theme }) => theme.color.primary.Lime300};
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.color.gray.Gray700};
  }
`;

const CommentSubmitButton = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 30px;
  transform: translateY(50%);
`;

export default QuestionDetail;
