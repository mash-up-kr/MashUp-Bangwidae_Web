import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';
import typography from '@/styles/typography';

interface Props {
  top: ReactNode;
  bottom?: ReactNode;
  withBackground?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

function TwoLayerContainer({ top, bottom, onClick, withBackground = false, style }: Props) {
  return (
    <Container onClick={onClick} withBackground={withBackground} style={{ ...style }}>
      <div style={{ flexShrink: 0 }}>{top}</div>
      <div style={{ flexShrink: 0 }}>{bottom}</div>
    </Container>
  );
}

export default TwoLayerContainer;

export const Container = styled.div<{ withBackground: boolean; style?: CSSProperties }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  min-height: 90px;
  background: ${({ withBackground, theme }) =>
    withBackground ? theme.color.gray.Gray900 : 'transparent'};
  border-radius: 8px;
`;

export const Title = styled.div`
  padding-bottom: 10px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.gray.Gray500};
  white-space: nowrap;
  text-overflow: ellipsis;

  ${typography.Body_Medium_14}
`;
