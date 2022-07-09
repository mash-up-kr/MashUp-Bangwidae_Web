import styled from 'styled-components';
import Image from 'next/image';
import thumbNail from '@/src/asset/image/thumbNail.png';
import { typography } from '@/styles';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';

function openInquiry() {
  const TAGS = ['ENFP', '맛집', '쇼핑', '재미'];

  return (
    <div>
      <Header>
        <span>도리를 찾아서님은,</span>
        <br />
        <span style={{ fontWeight: 700 }}>
          <StyledSpan>강남구</StyledSpan>에서 도리도리 중!
        </span>
      </Header>

      <Section>
        <Image src={thumbNail} alt="유저 이미지" width={250} height={250} />
        <Flex direction="column" align="center" style={{ marginTop: 20, width: '200px' }}>
          <Flex justify="center" align="center">
            <Title style={{ paddingTop: 4 }}>도리를 찾아서</Title>
            <Tag style={{ marginLeft: 8 }}>Lv.1</Tag>
          </Flex>
          <Description>{` 안녕하세요 {userName}입니다 모든 질문 환영해요`}</Description>
        </Flex>
      </Section>

      <Footer>
        <button type="button" style={{ width: 90, height: 90 }} />
        <Container>
          <h3 style={{ paddingBottom: 10 }}>성향</h3>
          <Flex>
            {TAGS.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Flex>
        </Container>
      </Footer>
    </div>
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

  margin-bottom: 3vh;
  padding-left: 24px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  padding-top: 18px;
  padding-left: 16px;
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
