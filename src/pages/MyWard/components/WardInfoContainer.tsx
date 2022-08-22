/* eslint-disable react/button-has-type */
import Image from 'next/image';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import Flex from '@/src/components/Flex';
import Tag from '@/src/components/Tag';
import thumbNail from '@/src/asset/image/thumbNail.png';
import existingWard from '@/src/asset/image/existingWard.png';
import colorTheme from '@/styles/theme';

interface Props {
  type: 'new' | 'existing';
  remainDays?: string;
  location: string; // 별명 또는 현재 위치를 해당 인자로 넘깁니다.
  isLoading?: boolean;
  onAdd?: () => void;
  onExpand?: () => void;
  onDelete?: () => void;
}

function WardInfoContainer({
  type,
  location,
  remainDays,
  onAdd,
  onExpand,
  onDelete,
  isLoading,
}: Props) {
  const titlePrefix = type === 'new' ? '지금 여기는' : '와드를 심어놓은';
  const locationName = type === 'new' ? `${location}!` : location;
  const isExist = remainDays != null;

  return (
    <Wrapper>
      <Flex>
        <Flex direction="column">
          <Flex style={{ marginBottom: 16, flexShrink: 0 }}>
            {remainDays && (
              <Tag type="outline" color={colorTheme.color.primary.Lime300}>
                {remainDays}
              </Tag>
            )}
            <Tag
              type="outline"
              color={isExist ? 'white' : colorTheme.color.primary.Lime300}
              style={{ marginLeft: isExist ? 8 : 0 }}
            >
              현위치
            </Tag>
          </Flex>
          <Flex direction="column" style={{ width: 140 }}>
            <p style={{ fontWeight: 400, marginBottom: 8, fontSize: 16 }}>{titlePrefix}</p>
            <p style={{ fontSize: 24, fontWeight: 700 }}>{locationName}</p>
          </Flex>
        </Flex>
        <Flex align="center" style={{ height: '100%', flexShrink: 0 }}>
          <Image src={isExist ? existingWard : thumbNail} width={94} height={94} />
        </Flex>
      </Flex>

      {type === 'new' ? (
        <Button
          withBackground
          style={{ marginTop: 16, flexShrink: 0 }}
          onClick={onAdd}
          disabled={isLoading}
        >
          <Flex justify="center" align="center">
            <ClipLoader color={colorTheme.color.primary.Lime300} loading size={18} />
            <span style={{ marginLeft: 8 }}>와드로 설정하기</span>
          </Flex>
        </Button>
      ) : (
        <Flex justify="space-between" style={{ width: '100%', marginTop: 8 }}>
          <Button withBackground={false} onClick={onDelete} style={{ marginRight: 8 }}>
            삭제
          </Button>
          <Button withBackground onClick={onExpand} disabled={isLoading}>
            기간 연장
          </Button>
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
  margin-top: 8px;
  color: ${({ withBackground }) => (withBackground ? 'black' : 'white')};
  font-weight: 700;
  font-size: 14px;
  background-color: ${({ withBackground, theme }) =>
    withBackground ? theme.color.primary.Lime300 : 'transparent'};

  border: ${({ withBackground, theme }) =>
    withBackground ? 'none' : `1px solid ${theme.color.gray.Gray500}`};
  border-radius: 8px;

  :disabled {
    color: white;
    background-color: ${({ theme }) => theme.color.gray.Gray400};
  }
`;
