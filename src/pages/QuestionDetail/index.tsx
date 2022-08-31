import { useState, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/router';
import styled, { useTheme } from 'styled-components';
import { useQuery } from 'react-query';
import { GET_QUESTION, USER_INFO } from 'src/consts/query';
import { dateTime } from 'src/utils/DateTime';
import api from 'src/api/core';
import { v4 } from 'uuid';
import ConfirmModal from 'components/Modal/ConfirmModal';
import InPreparationModal from 'components/Modal/InPreparationModal';
import { LargeLineButton, IconTextButton } from '@/src/components';
import Flex from '@/src/components/Flex';
import { typography } from '@/styles';
import { AnswerItem } from './components';
import { getQuestionDetail, getUserInfo, Question } from '@/pages/question-detail';
import { useAnswerCreator } from './mutations';
import { sendPostMessage } from '@/src/utils/sendPostMessage';

function QuestionDetail() {
  const theme = useTheme();
  const [answerInput, setAnswerInput] = useState('');
  const [selectedAnswerId, setSelectedAnswerId] = useState('');
  const answerInputElement = useRef<HTMLInputElement>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPreparationModal, setShowPreparationModal] = useState(false);
  const router = useRouter();
  const questionId = router.query?.questionId as string;

  const {
    data: question,
    isError: isQuestionError,
    isLoading: isQuestionLoading,
  } = useQuery<Question>([GET_QUESTION, questionId], getQuestionDetail);

  const { data: userInfo } = useQuery([USER_INFO], getUserInfo);
  const { mutate: mutateAnswerCreate } = useAnswerCreator(questionId);

  if (!question || isQuestionLoading || isQuestionError) return <div />;

  const handleCommentInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(e.target.value);
  };

  const handleCommentInputSubmit = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude } = position.coords;
      const { longitude } = position.coords;

      const answerDataToCreate = {
        content: answerInput,
        latitude,
        longitude,
      };

      mutateAnswerCreate(answerDataToCreate);
      setAnswerInput('');
    });
  };

  const handleDeepLinkClick = (page: 'mypage_other' | 'question') => () => {
    sendPostMessage({
      value: `doridori://main/${page}?userId=${question.fromUser.id}`,
    });
  };

  const handleShareButtonClick = () => {
    setShowPreparationModal(true);
  };

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
        <CommentList>
          <AnswerItem key={question.answer.id} answer={question.answer} />
        </CommentList>
        {userInfo?.userId === question.toUser.id && (
          <CommentInputWrapper>
            <Flex direction="row" align="center">
              <CommentInput
                type="text"
                placeholder="답변을 남겨주세요."
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
      {showReportModal && (
        <ConfirmModal
          title={
            <TitleWrapper
              style={{ marginTop: 14, marginBottom: 8, textAlign: 'center', fontSize: 18 }}
            >
              <p style={{ marginBottom: 6 }}>
                <span>답변을 </span>
                <span style={{ color: theme.color.primary.Lime300 }}>신고</span>하시겠어요?
              </p>
            </TitleWrapper>
          }
          subTitle="신고된 답변은 블라인드 처리됩니다."
          confirmButtonTxt="신고하기"
          cancelButtonTxt="취소하기"
          onConfirm={async () => {
            setShowReportModal(false);

            await api.post({
              url: `/api/report/comment/${selectedAnswerId}`,
            });

            setSelectedAnswerId('');
          }}
          onCancel={() => {
            setShowReportModal(false);
          }}
        />
      )}
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
