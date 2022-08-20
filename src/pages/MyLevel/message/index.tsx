import { ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.color.primary.Lime300};
`;

const Message = styled.div`
  color: ${({ theme }) => theme.color.basic.White} ${typography.Giant2_Bold_20};
`;

const levelMessage: { [key: number]: ReactNode } = {
  1: (
    <Message>
      현재 3개의 와드 보유중!
      <br />
      미션을 달성하고 <StyledSpan>와드를 받으세요!</StyledSpan>
    </Message>
  ),
};

export default levelMessage;
