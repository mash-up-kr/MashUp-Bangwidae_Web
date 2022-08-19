/* eslint-disable react/button-has-type */
import Image from 'next/image';
import styled from 'styled-components';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';
import thumbNail from '@/src/asset/image/thumbNail.png';
import colorTheme from '@/styles/theme';

interface Props {
  type: 'new' | 'existing';
  remainDays: string;
  location: string; // 별명 또는 현재 위치를 해당 인자로 넘깁니다.
}

function WardInfoContainer({ type, location, remainDays }: Props) {
  const titlePrefix = type === 'new' ? '지금 여기는' : '와드를 심어놓은';
  const locationName = type === 'new' ? `${location}!` : location;

  return (
    <Wrapper>
      <Flex style={{ height: 150 }}>
        <Flex direction="column">
          <Flex style={{ marginBottom: 16, flexShrink: 0 }}>
            <Tag type="outline" color={colorTheme.color.primary.Lime300}>
              {remainDays}
            </Tag>
            <Tag type="outline" color="white" style={{ marginLeft: 8 }}>
              현위치
            </Tag>
          </Flex>
          <Flex direction="column" style={{ width: 140 }}>
            <p style={{ fontWeight: 400, marginBottom: 8, fontSize: 16 }}>{titlePrefix}</p>
            <p style={{ fontSize: 24, fontWeight: 700 }}>{locationName}</p>
          </Flex>
        </Flex>
        <Flex align="center" style={{ height: '100%', flexShrink: 0 }}>
          <Image src={thumbNail} width={94} height={94} />
        </Flex>
      </Flex>

      {type === 'new' ? (
        <Button withBackground style={{ marginTop: 8 }}>
          와드로 설정
        </Button>
      ) : (
        <Flex justify="space-between" style={{ width: '100%', marginTop: 8 }}>
          <Button withBackground={false} style={{ marginRight: 8 }}>
            삭제
          </Button>
          <Button withBackground>기간 연장</Button>
        </Flex>
      )}
    </Wrapper>
  );
}
export default WardInfoContainer;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 280px;
  height: 194px;
  margin-right: 16px;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.gray.Gray800};
  border-radius: 16px;
`;

const Button = styled.button<{ withBackground: boolean }>`
  width: 100%;
  height: 48px;
  margin-top: 8;
  color: ${({ withBackground }) => (withBackground ? 'black' : 'white')};
  font-weight: 700;
  font-size: 14;
  background-color: ${({ withBackground, theme }) =>
    withBackground ? theme.color.primary.Lime300 : 'transparent'};

  border: ${({ withBackground, theme }) =>
    withBackground ? 'none' : `1px solid ${theme.color.gray.Gray500}`};
  border-radius: 8px;
`;
