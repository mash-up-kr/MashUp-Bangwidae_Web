import styled from 'styled-components';
import Image from 'next/image';
import thumbNail from '@/src/asset/image/thumbNail.png';
import { typography } from '@/styles';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';

function openInquiry() {
  const TAGS = ['ENFP', '맛집', '쇼핑'];

  return (
    <>
      <Header>
        <span>도리를 찾아서님은,</span>
        <br />
        <span style={{ fontWeight: 700 }}>
          <StyledSpan>강남구</StyledSpan>에서 도리도리 중!
        </span>
      </Header>

      <Section>
        <Image src={thumbNail} alt="유저 이미지" width={200} height={200} />
        <Flex direction="column" align="center" style={{ marginTop: 20, width: '200px' }}>
          <Flex justify="center" align="center">
            <Title style={{ paddingTop: 4 }}>도리를 찾아서</Title>
            <Tag style={{ marginLeft: 8 }}>Lv.1</Tag>
          </Flex>
          <Description
            style={{ color: '#767676', whiteSpace: 'pre-line' }}
          >{` 안녕하세요 도리를 찾아서입니다.\n모든 질문 환영해요`}</Description>
        </Flex>
      </Section>

      <Footer>
        <QuestionButton onClick={() => {}}>질문하기</QuestionButton>
        <Container>
          <TagTitle style={{ paddingBottom: 10 }}>성향</TagTitle>
          <Flex>
            {TAGS.map((tag) => (
              <TendencyTag key={tag}>{tag}</TendencyTag>
            ))}
          </Flex>
        </Container>
      </Footer>
    </>
  );
}

export default openInquiry;

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

  margin-top: 9vh;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;

  width: 100vw;

  margin-bottom: 3vh;
  padding-left: 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 8px;

  padding: 0 16px;
  background: ${({ theme }) => theme.color.gray.Gray900};
  border-radius: 8px;
`;

const TagTitle = styled.h3`
  color: ${({ theme }) => theme.color.gray.Gray500};
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
  ${typography.Body_Regular_14}
  color: ${({ theme }) => theme.color};
`;

const TendencyTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 42px;
  margin-right: 8px;

  padding: 2px 8px;
  color: ${({ theme }) => theme.color.gray.Gray100};

  font-weight: 700;
  font-size: 14px;
  background: ${({ theme }) => theme.color.gray.Gray700};

  border-radius: 4px;
`;

const QuestionButton = styled.button`
  width: 22vw;
  height: 13vh;
  color: ${({ theme }) => theme.color.primary.Lime300};
  font-size: ${typography.Body_Bold_14};
  background: transparent;

  border: 1px solid ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 10px;
`;
