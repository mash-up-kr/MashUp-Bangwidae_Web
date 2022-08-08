import Image from 'next/image';

import thumbNail from '@/src/asset/image/thumbNail.png';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';
import getUserInfo from './remote/getUserInfo';
import {
  Description,
  Footer,
  Header,
  QuestionButton,
  Section,
  StyledSpan,
  Title,
} from './components/styledComponent';
import QuestionContainer from './components/QuestionContainer';
import TendencyContainer from './components/TendencyContainer';
import TwoLayerContainer from './components/TwoLayerComponent';

function OpenInquiry() {
  const { nickname, level, profileDescription, representativeWardName, tags, questions } =
    getUserInfo();

  return (
    <>
      <Header>
        <span>{nickname}님은,</span>
        <br />
        <span style={{ fontWeight: 700 }}>
          <StyledSpan>{representativeWardName}</StyledSpan>에서 도리도리 중!
        </span>
      </Header>

      <Section>
        <Image src={thumbNail} alt="유저 이미지" width={250} height={250} />
        <Flex direction="column" align="center" style={{ marginTop: 20, width: '200px' }}>
          <TwoLayerContainer
            top={
              <Flex justify="center" align="center">
                <Title>{nickname}</Title>
                <Tag style={{ marginLeft: 8 }}>Lv.{level}</Tag>
              </Flex>
            }
            bottom={<Description>{profileDescription}</Description>}
          />
        </Flex>
      </Section>

      <Footer>
        <QuestionButton onClick={() => {}}>질문하기</QuestionButton>
        <TendencyContainer title="성향" tags={tags} />
        {questions.map(({ questionId, questionContent, answerContent }) => (
          <QuestionContainer
            key={questionId}
            id={questionId}
            title={questionContent}
            content={answerContent}
          />
        ))}
      </Footer>
    </>
  );
}

export default OpenInquiry;
