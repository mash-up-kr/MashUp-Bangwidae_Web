import { ReactNode } from 'react';
import Cancel from 'public/icons/cancel.svg';
import styled from 'styled-components';

interface LineChipProps {
  children: ReactNode;
  onClick?: () => void;
}

function LineChip({ children, onClick }: LineChipProps) {
  const handleClick = () => {
    onClick?.();
  };
  return (
    <Wrapper>
      {onClick && (
        <SvgWrapper onClick={handleClick}>
          <Cancel />
        </SvgWrapper>
      )}
      <StyledLineChip>{children}</StyledLineChip>
    </Wrapper>
  );
}

export default LineChip;

const Wrapper = styled.div`
  position: relative;
  margin-right: 10px;
`;

const SvgWrapper = styled.i`
  position: absolute;
  top: -6px;
  right: -6px;
`;

const StyledLineChip = styled.div`
  min-height: 34px;
  padding: 7px 12px;
  color: ${({ theme }) => theme.color.basic.White};
  background: transparent;
  border: 1px solid;
  border-radius: 40px;
`;
