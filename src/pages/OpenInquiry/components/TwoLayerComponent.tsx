import { ReactNode } from 'react';
import styled from 'styled-components';
import typography from '@/styles/typography';

interface Props {
  top: ReactNode;
  bottom?: ReactNode;
  withBackground?: boolean;
  onClick?: () => void;
}

function TwoLayerContainer({ top, bottom, onClick, withBackground = false }: Props) {
  return (
    <Container onClick={onClick} withBackground={withBackground}>
      <div>{top}</div>
      <div>{bottom}</div>
    </Container>
  );
}

export default TwoLayerContainer;

export const Container = styled.div<{ withBackground: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  justify-content: center;
  width: 228px;
  margin-left: 8px;
  padding: 0 16px;
  background: ${({ withBackground, theme }) =>
    withBackground ? theme.color.gray.Gray900 : 'transparent'};
  border-radius: 8px;
`;

export const Title = styled.div`
  max-width: 196px;
  padding-bottom: 10px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.gray.Gray500};
  white-space: nowrap;
  text-overflow: ellipsis;

  ${typography.Body_Medium_14}
`;
