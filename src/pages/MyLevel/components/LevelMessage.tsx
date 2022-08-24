import styled, { css } from 'styled-components';
import { typography } from '@/styles';

interface LevelMessageProps {
  userLevel: number;
  selectedLevel: number;
  maxWardCount?: number;
}

function LevelMessage({ userLevel, selectedLevel, maxWardCount }: LevelMessageProps) {
  if (userLevel === selectedLevel) {
    return (
      <Message>
        현재 {selectedLevel}개의 와드 보유중!
        <br />
        미션을 달성하고 <StyledSpan>와드를 받으세요!</StyledSpan>
      </Message>
    );
  }
  if (userLevel > selectedLevel) {
    return (
      <Message hasColor>
        레벨 {selectedLevel} 달성 완료!
        <br />
        새로운 레벨에 도전해보세요
      </Message>
    );
  }
  return (
    <Message>
      레벨 {selectedLevel}를 달성하면
      <br />
      와드를 {maxWardCount ?? '-'}개 보유할 수 있어요!
    </Message>
  );
}

export default LevelMessage;

const Message = styled.div<{ hasColor?: boolean }>`
  color: ${({ theme }) => theme.color.basic.White};
  ${typography.Giant2_Bold_20}
  ${({ hasColor }) =>
    hasColor &&
    css`
      color: ${({ theme }) => theme.color.primary.Lime500};
    `}
`;

const StyledSpan = styled.span`
  color: ${({ theme }) => theme.color.primary.Lime300};
`;
