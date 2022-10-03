import { useState, ChangeEvent, MouseEvent, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { POST, COMMENTS, USER_INFO } from 'src/consts/query';
import { dateTime } from 'src/utils/DateTime';
import { useTranslateAnimation } from 'src/hooks';
import api from 'src/api/core';
import { v4 } from 'uuid';
import ConfirmModal from 'components/Modal/ConfirmModal';
import InPreparationModal from 'components/Modal/InPreparationModal';
import BlockCompleteModal from 'components/Modal/BlockCompleteModal';
import type { Post, Comment } from '@/pages/post-detail';
import { LargeLineButton, IconTextButton } from '@/src/components';
import Flex from '@/src/components/Flex';
import { typography } from '@/styles';
import { CommentItem, PopupMenu } from './components';
import { getPostDetail, getCommentList, getUserInfo } from '@/pages/post-detail';
import {
  usePostLikeCreator,
  usePostUnlikeCreator,
  useCommentCreator,
  useCommentUpdater,
  useCommentDeleter,
} from './mutations';
import { sendPostMessage } from '@/src/utils/sendPostMessage';

const REPORTED_POST = '신고된 글입니다';
const BLOCKED_USER = '차단된 사용자의 글입니다';

interface PostDetailProps {
  initialPostData: Post;
  initialCommentData: Comment[];
}

function PostDetail({ initialPostData, initialCommentData }: PostDetailProps) {
  const theme = useTheme();
  const [commentInput, setCommentInput] = useState('');
  const [selectedCommentId, setSelectedCommentId] = useState('');
  const commentInputElement = useRef<HTMLInputElement>(null);
  const { isTargetOpen, changeTargetOpenState, isBeforeTargetClose } = useTranslateAnimation(0.2);
  const [isMyComment, setIsMyComment] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPreparationModal, setShowPreparationModal] = useState(false);
  const [showBlockCompleteModal, setShowBlockCompleteModal] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const postId = (router.query?.postId as string) || '';
  const commentListElement = useRef<HTMLUListElement>(null);

  const {
    data: post,
    isError: isPostError,
    isLoading: isPostLoading,
  } = useQuery<Post | null>([POST, postId], getPostDetail, { initialData: initialPostData });

  const {
    data: comments,
    isError: isCommentError,
    isLoading: isCommentLoading,
  } = useQuery<Comment[] | null>([COMMENTS, postId], getCommentList, {
    initialData: initialCommentData,
  });

  const { data: userInfo } = useQuery([USER_INFO], getUserInfo);

  const { mutate: mutateUnlikeCount } = usePostUnlikeCreator(postId);
  const { mutate: mutateLikeCount } = usePostLikeCreator(postId);
  const { mutate: mutateCommentCreate } = useCommentCreator(postId);
  const { mutate: mutateCommentUpdate } = useCommentUpdater();
  const { mutate: mutateCommentDelete } = useCommentDeleter();

  const [hydrated, setHydrated] = useState(false);

  /* ------ Fix: Text content does not match server-rendered HTML ------- */
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;
  /* -------------------------------------------------------------------- */

  if (!post || isPostLoading || isCommentLoading) return <div />;
  if (isPostError || isCommentError) return <div />;

  const isReportedPost = post.content === REPORTED_POST;
  const isBlockedUser = post.content === BLOCKED_USER;

  const handleLikeButtonClick = () => {
    if (post?.userLiked) mutateUnlikeCount();
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
    scrollToTopComment();
  };

  const scrollToTopComment = () => {
    if (!commentListElement.current) return;
    commentListElement.current.scroll({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleCommentKebabMenuClick = (event: MouseEvent, commentId: string) => {
    setCommentInput('');
    togglePopupMenu();
    setSelectedCommentId(commentId);
    const selectedComment = comments?.find(({ id }: { id: string }) => id === commentId);
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
    const selectedComment = comments?.find(({ id }: { id: string }) => id === selectedCommentId);
    if (selectedComment) setCommentInput(selectedComment.content);
  };

  const handleCommentDeleteButtonClick = () => {
    togglePopupMenu();
    mutateCommentDelete({ commentId: selectedCommentId });
    setSelectedCommentId('');
  };

  const handleCommentAnonymousButtonClick = () => {
    togglePopupMenu();

    const { latitude, longitude } = post;
    const selectedComment = comments?.find(({ id }: { id: string }) => id === selectedCommentId);

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

  const handleDeepLinkClick = (page: 'mypage_other' | 'question') => () => {
    sendPostMessage({
      value: `doridori://main/${page}?userId=${post.user?.id}`,
    });
  };

  const handleCommentReportButtonClick = () => {
    togglePopupMenu();
    setShowReportModal(true);
  };

  const handleCommentReplyButtonClick = () => {
    changeTargetOpenState(false);
    setShowPreparationModal(true);
  };

  const handleShareButtonClick = () => {
    setShowPreparationModal(true);
  };

  const handleUserBlockButtonClick = () => {
    togglePopupMenu();
    setShowBlockCompleteModal(true);
  };

  return (
    <Layout>
      {/* Top Section */}
      <TopSection>
        {/* Header */}
        <Flex direction="row" align="center">
          <ProfileImage
            src={post.user?.profileImageUrl}
            onClick={handleDeepLinkClick('mypage_other')}
          />
          <Flex direction="row" justify="space-between" style={{ flexGrow: 1 }}>
            <Flex direction="column">
              <Flex direction="row" style={{ marginBottom: '6px' }}>
                <Nickname onClick={handleDeepLinkClick('mypage_other')}>
                  {post.user?.nickname}
                </Nickname>
                <LevelTag>Lv.{post.user.level}</LevelTag>
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
              disabled={isReportedPost || isBlockedUser}
            >
              {post.likeCount === 0 ? '궁금해요' : post.likeCount}
            </LeftIcon>
            <CenterIcon name="chat" color={theme.color.gray.Gray500} size={20} onClick={() => {}}>
              {post.commentCount || '댓글'}
            </CenterIcon>
            <RightIcon
              name="share"
              color={theme.color.gray.Gray500}
              size={20}
              onClick={handleShareButtonClick}
            >
              공유
            </RightIcon>
          </MenuGroup>
        </MenuGroupPosition>
      </TopSection>
      {/* Bottom Section */}
      <BottomSection>
        {/* 댓글 목록 */}
        <CommentList ref={commentListElement}>
          {comments?.map((commentItem: Comment) => (
            <CommentItem
              key={commentItem.id}
              comment={commentItem}
              onMenuClick={handleCommentKebabMenuClick}
              onReplyClick={() => {
                handleCommentReplyButtonClick();
              }}
            />
          ))}
        </CommentList>
        {/* 댓글 입력 */}
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
      {/* 댓글 팝업 메뉴 */}
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
                <div key={v4()} onClick={handleCommentReplyButtonClick}>
                  공유하기
                </div>,
                <div key={v4()} onClick={handleCommentReportButtonClick}>
                  신고하기
                </div>,
                <div key={v4()} onClick={handleUserBlockButtonClick}>
                  글쓴이 차단하기
                </div>,
              ]}
        </PopupMenu>
      )}
      {/* 신고 모달 */}
      {showReportModal && (
        <ConfirmModal
          title={
            <TitleWrapper
              style={{ marginTop: 14, marginBottom: 8, textAlign: 'center', fontSize: 18 }}
            >
              <p style={{ marginBottom: 6 }}>
                <span>댓글을 </span>
                <span style={{ color: theme.color.primary.Lime300 }}>신고</span>하시겠어요?
              </p>
            </TitleWrapper>
          }
          subTitle="신고된 댓글은 블라인드 처리됩니다."
          confirmButtonTxt="신고하기"
          cancelButtonTxt="취소하기"
          onConfirm={async () => {
            setShowReportModal(false);

            await api.post({
              url: `/report/comment/${selectedCommentId}`,
            });

            await queryClient.invalidateQueries([COMMENTS]);

            setSelectedCommentId('');
          }}
          onCancel={() => {
            setShowReportModal(false);
          }}
        />
      )}
      {/* 차단 완료 모달 */}
      {showBlockCompleteModal && (
        <BlockCompleteModal
          title={<div style={{ marginTop: 6, marginBottom: 12 }}>해당 글쓴이를 차단했습니다.</div>}
          confirmButtonTxt="도리도리 계속 이용하기"
          onConfirm={async () => {
            const targetUserId = comments?.find(({ id }) => id === selectedCommentId)?.user?.id;

            if (!targetUserId) return;

            await api.post({
              url: `/user/block/${targetUserId}`,
            });

            await queryClient.invalidateQueries([POST, COMMENTS]);

            setShowBlockCompleteModal(false);
          }}
        />
      )}
      {/* 준비중 모달 */}
      {showPreparationModal && (
        <InPreparationModal
          title={
            <TitleWrapper
              style={{ marginTop: 14, marginBottom: 8, textAlign: 'center', fontSize: 16 }}
            >
              <div style={{ marginBottom: 12 }}>아직 준비 중인 기능입니다.</div>
              <div>새로운 기능을 기대해주세요!</div>
            </TitleWrapper>
          }
          confirmButtonTxt="도리도리 계속 이용하기"
          onConfirm={async () => {
            setShowPreparationModal(false);
          }}
        />
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
  max-width: 32%;
  height: 24px;
`;

const CenterIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 32%;
  height: 24px;
  border-right: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  border-left: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  pointer-events: none;
`;

const RightIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 32%;
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

const CommentList = styled.ul`
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

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

export default PostDetail;
