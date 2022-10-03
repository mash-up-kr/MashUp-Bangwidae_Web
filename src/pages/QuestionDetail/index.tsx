import { useState, ChangeEvent, useRef, MouseEvent } from 'react';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { GET_QUESTION, USER_INFO } from 'src/consts/query';
import { dateTime } from 'src/utils/DateTime';
import { useTranslateAnimation } from 'src/hooks';
import { v4 } from 'uuid';
import InPreparationModal from 'components/Modal/InPreparationModal';
import { PopupMenu } from 'pages/PostDetail/components';
import ConfirmModal from 'components/Modal/ConfirmModal';
import api from 'src/api/core';
import BlockCompleteModal from 'components/Modal/BlockCompleteModal';
import { LargeLineButton, IconTextButton } from '@/src/components';
import Flex from '@/src/components/Flex';
import { typography } from '@/styles';
import { AnswerItem } from './components';
import { getQuestionDetail, getUserInfo, Question } from '@/pages/question-detail';
import { useAnswerCreator, useAnswerUpdater, useAnswerDeleter } from './mutations';
import { sendPostMessage } from '@/src/utils/sendPostMessage';

function QuestionDetail() {
  const theme = useTheme();
  const [answerInput, setAnswerInput] = useState('');
  const [selectedAnswerId, setSelectedAnswerId] = useState('');
  const answerInputElement = useRef<HTMLInputElement>(null);
  const { isTargetOpen, changeTargetOpenState, isBeforeTargetClose } = useTranslateAnimation(0.2);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPreparationModal, setShowPreparationModal] = useState(false);
  const [showBlockCompleteModal, setShowBlockCompleteModal] = useState(false);
  const queryClient = useQueryClient();

  const router = useRouter();
  const questionId = router.query?.questionId as string;

  const {
    data: question,
    isError: isQuestionError,
    isLoading: isQuestionLoading,
  } = useQuery<Question>([GET_QUESTION, questionId], getQuestionDetail);

  const { data: userInfo } = useQuery([USER_INFO], getUserInfo);
  const { mutate: mutateAnswerCreate } = useAnswerCreator(questionId);
  const { mutate: mutateAnswerUpdate } = useAnswerUpdater();
  const { mutate: mutateAnswerDelete } = useAnswerDeleter();

  if (!question || isQuestionLoading || isQuestionError) return <div />;

  const handleCommentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
  };

  const handleCommentInputSubmit = () => {
    const isCreating = !question.answer?.id;
    const isUpdating = !isCreating;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const answerDataToCreate = {
        content: answerInput,
        latitude,
        longitude,
      };
      const commentDataToUpdate = {
        answerId: question.answer.id,
        content: answerInput,
        latitude,
        longitude,
      };

      if (isCreating) mutateAnswerCreate(answerDataToCreate);
      if (isUpdating) mutateAnswerUpdate(commentDataToUpdate);
      setAnswerInput('');
    });
  };

  const handleDeepLinkClick = (page: 'mypage_other' | 'question') => () => {
    sendPostMessage({
      value: `doridori://main/${page}?userId=${question.fromUser.id}`,
    });
  };

  const handleCommentKebabMenuClick = (event: MouseEvent, answerId: string) => {
    setAnswerInput('');
    setSelectedAnswerId(answerId);
    togglePopupMenu();
  };

  const togglePopupMenu = () => {
    if (isTargetOpen) changeTargetOpenState(false);
    else changeTargetOpenState(true);
  };

  const handleCommentReplyButtonClick = () => {
    togglePopupMenu();
    setShowPreparationModal(true);
  };

  const handleShareButtonClick = () => {
    setShowPreparationModal(true);
  };

  const handleAnswerEditButtonClick = () => {
    togglePopupMenu();
    if (!answerInputElement.current) return;
    answerInputElement.current.focus();
    const selectedComment = question.answer;
    if (selectedComment) setAnswerInput(selectedComment.content);
  };

  const handleAnswerDeleteButtonClick = () => {
    togglePopupMenu();
    mutateAnswerDelete({ answerId: question.answer?.id });
  };

  const handleCommentReportButtonClick = () => {
    togglePopupMenu();
    setShowReportModal(true);
  };

  const handleUserBlockButtonClick = () => {
    togglePopupMenu();
    setShowBlockCompleteModal(true);
  };

  const isMyQuestion = userInfo?.userId === question.toUser.id;

  return (
    <Layout>
      {/* Top Section */}
      <TopSection>
        {/* Header */}
        <Flex direction="row" align="center">
          <ProfileImage
            src={question.fromUser.profileImageUrl}
            onClick={handleDeepLinkClick('mypage_other')}
          />
          <Flex direction="row" justify="space-between" style={{ flexGrow: 1 }}>
            <Flex direction="column">
              <Flex direction="row" style={{ marginBottom: '6px' }}>
                <Nickname onClick={handleDeepLinkClick('mypage_other')}>
                  {question.fromUser.nickname}
                </Nickname>
                <LevelTag>Lv.{question.fromUser.level}</LevelTag>
              </Flex>
              <Flex direction="row" style={{ minWidth: '130px' }}>
                {question.fromUser?.tags.map((tag: string) => (
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
        <Content>{question.content}</Content>
        <Flex direction="row" align="center">
          <LocatedAt>{question.representativeAddress || ''}</LocatedAt>
          {question.representativeAddress && <VerticalDivider />}
          <CreatedAt>{dateTime.fromNow(question.createdAt)}</CreatedAt>
        </Flex>
        {/* Menu Group */}
        <MenuGroupPosition>
          <MenuGroup>
            <CenterIcon name="chat" color={theme.color.gray.Gray500} size={20} onClick={() => {}}>
              {question.answer ? '1' : '0'}
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
        {/* 답변 목록 */}
        <CommentList>
          <AnswerItem
            key={question.answer.id}
            answer={question.answer}
            onMenuClick={handleCommentKebabMenuClick}
            onReplyClick={() => {
              handleCommentReplyButtonClick();
            }}
          />
        </CommentList>
        {/* 댓글 입력 */}
        {isMyQuestion && (
          <CommentInputWrapper>
            <Flex direction="row" align="center">
              <CommentInput
                type="text"
                placeholder={`${
                  question.answer?.id ? '답변을 수정해주세요.' : '답변을 남겨주세요.'
                }`}
                value={answerInput}
                onChange={handleCommentInputChange}
                ref={answerInputElement}
              />
              <CommentSubmitButton onClick={handleCommentInputSubmit}>
                <LargeLineButton buttonType="primary" onClick={() => {}}>
                  등록
                </LargeLineButton>
              </CommentSubmitButton>
            </Flex>
          </CommentInputWrapper>
        )}
      </BottomSection>
      {/* 댓글 팝업 메뉴 */}
      {isTargetOpen && (
        <PopupMenu onClose={togglePopupMenu} isBeforeClose={isBeforeTargetClose}>
          {isMyQuestion
            ? [
                <div key={v4()} onClick={handleAnswerEditButtonClick}>
                  수정하기
                </div>,
                <div key={v4()} onClick={handleAnswerDeleteButtonClick}>
                  삭제하기
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
              url: `/report/comment/${selectedAnswerId}`,
            });

            await queryClient.invalidateQueries([GET_QUESTION]);
            setSelectedAnswerId('');
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
            const targetUserId = question.answer.user.id;

            if (!targetUserId) return;

            await api.post({
              url: `/user/block/${targetUserId}`,
            });

            await queryClient.invalidateQueries([GET_QUESTION]);

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
          onConfirm={() => {
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
  overflow: hidden;
  white-space: nowrap;
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

const CenterIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 50%;
  height: 24px;
  border-right: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  border-left: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  pointer-events: none;
`;

const RightIcon = styled(IconTextButton)`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  max-width: 50%;
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

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

const VerticalDivider = styled.div`
  height: 10px;
  margin: 0 10px 0 10px;
  border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

export default QuestionDetail;
