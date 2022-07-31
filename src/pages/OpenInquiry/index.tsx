import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';

import thumbNail from '@/src/asset/image/thumbNail.png';
import { typography } from '@/styles';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';
import getUserInfo from './remote/getUserInfo';

function OpenInquiry() {
  const { nickname, profileDescription, representativeWardName, tags, questions } = getUserInfo();

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
          <Flex justify="center" align="center">
            <Title>{nickname}</Title>
            <Tag style={{ marginLeft: 8 }}>Lv.1</Tag>
          </Flex>
          <Description>{profileDescription}</Description>
        </Flex>
      </Section>

      <Footer>
        <QuestionButton onClick={() => {}}>질문하기</QuestionButton>
        <Container>
          <TagTitle>성향</TagTitle>
          <Flex>
            {tags.slice(0, 3).map((tag) => (
              <TendencyTag key={tag}>{tag}</TendencyTag>
            ))}
            <TendencyTag>+{tags.length - 3}</TendencyTag>
          </Flex>
        </Container>
        {questions.slice(0, 2).map((question) => (
          <Link href={`/question-detail?id=${question.questionId}`}>
            <Container>
              <TagTitle style={{ paddingBottom: 10 }}>Q. {question.questionContent}</TagTitle>
              <p>{question.answerContent}</p>
            </Container>
          </Link>
        ))}
      </Footer>
    </>
  );
}

export default OpenInquiry;

const Header = styled.div`
  margin-top: 32px;
  margin-left: 30px;
  font-weight: 400;
  font-size: 24px;
  white-space: pre-line;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 68vh;
`;

const Footer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  width: 100vw;

  margin-bottom: 3vh;
  padding-left: 24px;

  overflow: scroll;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  width: 228px;
  margin-left: 8px;
  padding: 0 16px;
  background: ${({ theme }) => theme.color.gray.Gray900};
  border-radius: 8px;
`;

const TagTitle = styled.div`
  max-width: 196px;
  padding-bottom: 10px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.gray.Gray500};
  white-space: nowrap;
  text-overflow: ellipsis;

  ${typography.Body_Medium_14}
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.color.primary.Lime300};
  ${typography.Giant1_Bold_24}
`;

const Title = styled.p`
  ${typography.Title1_Bold_18}
`;

const Description = styled.p`
  margin-top: 8px;
  color: #767676;

  ${typography.Body_Regular_14}
`;

const TendencyTag = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin-right: 8px;
  padding: 2px 8px;
  color: ${({ theme }) => theme.color.gray.Gray100};
  font-weight: 700;
  font-size: 14px;
  background: ${({ theme }) => theme.color.gray.Gray700};
  border-radius: 4px;
`;

const QuestionButton = styled.button`
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  color: ${({ theme }) => theme.color.primary.Lime300};
  font-size: ${typography.Body_Bold_14};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 10px;
`;
