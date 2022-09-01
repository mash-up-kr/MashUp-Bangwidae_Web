/* eslint-disable react/no-unused-prop-types */
import { useQuery } from 'react-query';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';
import {
  Description,
  Footer,
  Header,
  QuestionButton,
  Section,
  StyledSpan,
  Title,
  StyledCarousel,
  ProfileImageWrapper,
  ProfileImage,
  Shadow,
  Wing,
} from './components/styledComponent';
import QuestionContainer from './components/QuestionContainer';
import TendencyContainer from './components/TendencyContainer';
import TwoLayerContainer from './components/TwoLayerComponent';
import { getAnsweredQuestion, getMyInfo } from '@/pages/open-inquiry';
import { sendPostMessage } from '@/src/utils/sendPostMessage';

function OpenInquiry() {
  const { data: userData } = useQuery(['openInquiry/getMyInfo'], getMyInfo);
  const { data: questionData } = useQuery(['openInquiry/getAnsweredQuestion'], getAnsweredQuestion);

  const handleDeepLinkClick = (page: 'mypage_other' | 'question') => () => {
    sendPostMessage({
      value: `doridori://main/${page}?userId=${userData?.userId}`,
    });
  };

  return (
    <>
      {userData && (
        <>
          <Header>
            <span>{userData.nickname}님은,</span>
            <br />
            <span style={{ fontWeight: 700 }}>
              <StyledSpan>어디선가</StyledSpan>에서 도리도리 중!
            </span>
          </Header>

          <Section>
            <ProfileImageWrapper>
              <ProfileImage
                src={userData.profileImageUrl}
                alt="유저 이미지"
                width={250}
                height={250}
              />
              <Shadow />
              <Wing isLeft />
              <Wing />
            </ProfileImageWrapper>
            <Flex direction="column" align="center" style={{ marginTop: 20, width: '200px' }}>
              <TwoLayerContainer
                top={
                  <Flex justify="center" align="center">
                    <Title>{userData.nickname}</Title>
                    <Tag style={{ marginLeft: 8 }}>Lv.{userData.level}</Tag>
                  </Flex>
                }
                bottom={<Description>{userData.profileDescription}</Description>}
              />
            </Flex>
          </Section>
        </>
      )}

      {questionData && (
        <Footer>
          <QuestionButton onClick={() => handleDeepLinkClick('question')}>질문하기</QuestionButton>
          <StyledCarousel>
            <TendencyContainer title="성향" tags={userData.tags} />
            {questionData.questions.map(
              ({ id, content, answer }: { id: string; content: string; answer: any }) => (
                <QuestionContainer key={id} id={id} title={content} content={answer.content} />
              ),
            )}
          </StyledCarousel>
        </Footer>
      )}
    </>
  );
}

export default OpenInquiry;
