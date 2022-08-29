import { useState, ChangeEvent, MouseEvent, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { useQuery } from 'react-query';
import type { Comment } from 'pages/QuestionDetail/components/CommentItem';
import { POST, COMMENTS, USER_INFO } from 'src/consts/query';
import { dateTime } from 'src/utils/DateTime';
import { useTranslateAnimation } from 'src/hooks';
import { v4 } from 'uuid';
import { LargeLineButton, IconTextButton } from '@/src/components';
import Flex from '@/src/components/Flex';
import { typography } from '@/styles';
import { CommentItem, PopupMenu } from './components';
import { getPostDetail, getCommentList, getUserInfo } from '@/pages/question-detail';
import {
  usePostLikeCreator,
  usePostUnlikeCreator,
  useCommentCreator,
  useCommentUpdater,
  useCommentDeleter,
} from './mutations';
import { sendPostMessage } from '@/src/utils/sendPostMessage';

function QuestionDetail() {
  const theme = useTheme();
  const [commentInput, setCommentInput] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const commentInputElement = useRef<HTMLInputElement>(null);
  const { isTargetOpen, changeTargetOpenState, isBeforeTargetClose } = useTranslateAnimation(0.2);
  const [isMyComment, setIsMyComment] = useState(false);

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

  const { data: userInfo } = useQuery([USER_INFO], getUserInfo);

  const { mutate: mutateUnlikeCount } = usePostUnlikeCreator();
  const { mutate: mutateLikeCount } = usePostLikeCreator();
  const { mutate: mutateCommentCreate } = useCommentCreator();
  const { mutate: mutateCommentUpdate } = useCommentUpdater();
  const { mutate: mutateCommentDelete } = useCommentDeleter();

  const handleLikeButtonClick = () => {
    if (post.userLiked) mutateUnlikeCount();
    else mutateLikeCount();
  };

  const handleCommentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCommentInput(e.target.value);
  };

  const handleCommentInputSubmit = () => {
    const isCreating = !selectedCommentId;
    const isUpdating = !isCreating;
    const { latitude, longitude } = post;

    const commentDataToCreate = {
      content: commentInput,
      latitude,
      longitude,
    };
    const commentDataToUpdate = {
      commentId: selectedCommentId,
      content: commentInput,
      latitude,
      longitude,
    };

    if (isCreating) mutateCommentCreate(commentDataToCreate);
    if (isUpdating) mutateCommentUpdate(commentDataToUpdate);
    setCommentInput('');
  };

  const handleCommentKebabMenuClick = (event: MouseEvent, commentId: string) => {
    setCommentInput('');
    togglePopupMenu();
    setSelectedCommentId(commentId);
    const selectedComment = comments.values.find(({ id }: { id: string }) => id === commentId);
    setIsMyComment(userInfo?.userId === selectedComment?.user?.id);
  };

  const togglePopupMenu = () => {
    if (isTargetOpen) changeTargetOpenState(false);
    else changeTargetOpenState(true);
  };

  const handleCommentEditButtonClick = () => {
    togglePopupMenu();
    if (!commentInputElement.current) return;
    commentInputElement.current.focus();
    const selectedComment = comments.values.find(
      ({ id }: { id: string }) => id === selectedCommentId,
    );
    setCommentInput(selectedComment.content);
    setSelectedCommentId('');
  };

  const handleCommentDeleteButtonClick = () => {
    togglePopupMenu();
    mutateCommentDelete({ commentId: selectedCommentId });
    setSelectedCommentId('');
  };

  const handleCommentAnonymousButtonClick = () => {
    togglePopupMenu();

    const { latitude, longitude } = post;
    const selectedComment = comments.values.find(
      ({ id }: { id: string }) => id === selectedCommentId,
    );

    const commentDataToUpdate = {
      commentId: selectedCommentId,
      content: selectedComment?.content ?? '',
      latitude,
      longitude,
      anonymous: true,
    };

    mutateCommentUpdate(commentDataToUpdate);
    setSelectedCommentId('');
  };

  if (isPostLoading || isCommentLoading) return <div>Loading</div>;
  if (isPostError || isCommentError) return <div>Error</div>;

  const handleDeepLinkClick = (page: 'mypage_other' | 'question') => () => {
    sendPostMessage({
      value: `doridori://main/${page}?userId=${post.user?.id}`,
    });
  };

  return (
    <Layout>
      {/* Top Section */}
      <TopSection>
        {/* Header */}
        <Flex direction="row" align="center">
          <ProfileImage src={post.user?.profileImageUrl} />
          <Flex direction="row" justify="space-between" style={{ flexGrow: 1 }}>
            <Flex direction="column">
              <Flex direction="row" style={{ marginBottom: '6px' }}>
                <Nickname onClick={handleDeepLinkClick('mypage_other')}>
                  {post.user?.nickname}
                </Nickname>
                <LevelTag>Lv.1</LevelTag>
              </Flex>
              <Flex direction="row" style={{ minWidth: '130px' }}>
                {post.user?.tags.map((tag: string) => (
                  <InterestTag key={v4()}>{tag}</InterestTag>
                ))}
              </Flex>
            </Flex>
            <LargeLineButton buttonType="default" onClick={handleDeepLinkClick('question')}>
              질문하기
            </LargeLineButton>
          </Flex>
        </Flex>
        <Divider />
        {/* Content */}
        <Content>{post.content}</Content>
        <Flex direction="row">
          <LocatedAt>{post.representativeAddress}</LocatedAt>
          <CreatedAt>{dateTime.fromNow(post.createdAt)}</CreatedAt>
        </Flex>
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
        <CommentList>
          {comments?.values.map((commentItem: Comment) => (
            <CommentItem
              key={commentItem.id}
              comment={commentItem}
              onMenuClick={handleCommentKebabMenuClick}
            />
          ))}
        </CommentList>
        <CommentInputWrapper>
          <Flex direction="row" align="center">
            <CommentInput
              type="text"
              placeholder="댓글을 남겨주세요."
              value={commentInput}
              onChange={handleCommentInputChange}
              ref={commentInputElement}
            />
            <CommentSubmitButton onClick={handleCommentInputSubmit}>
              <LargeLineButton buttonType="primary" onClick={() => {}}>
                등록
              </LargeLineButton>
            </CommentSubmitButton>
          </Flex>
        </CommentInputWrapper>
      </BottomSection>
      {isTargetOpen && (
        <PopupMenu onClose={togglePopupMenu} isBeforeClose={isBeforeTargetClose}>
          {isMyComment
            ? [
                <div key={v4()} onClick={handleCommentEditButtonClick}>
                  수정하기
                </div>,
                <div key={v4()} onClick={handleCommentDeleteButtonClick}>
                  삭제하기
                </div>,
                <div key={v4()} onClick={handleCommentAnonymousButtonClick}>
                  익명으로 변경
                </div>,
              ]
            : [
                <div key={v4()} onClick={() => {}}>
                  신고하기
                </div>,
                <div key={v4()} onClick={() => {}}>
                  대댓글 쓰기
                </div>,
              ]}
        </PopupMenu>
      )}
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

const ProfileImage = styled.img`
  width: 52px;
  height: 52px;
  margin-right: 8px;
  border: 1px solid #3a3a3a;
  border-radius: 50%;
`;

const Nickname = styled.div`
  ${typography.Body_Medium_14}
  margin-right: 8px;
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
  margin-right: 6px;
  padding: 1px 6px;
  color: ${({ theme }) => theme.color.gray.Gray400};
  font-weight: 400;
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
    margin: 0 10px;
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

const CommentList = styled.div`
  height: 100%;
  padding-bottom: 128px;
  overflow-y: scroll;
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
  margin-right: 30px;
`;

export default QuestionDetail;
