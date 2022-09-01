import styled, { css } from 'styled-components';
import { useMemo } from 'react';
import { typography } from '@/styles';

interface MissionProps {
  myLevel?: number;
  currentLevel?: number;
  policyText?: string;
  totalCount?: number;
  currentCount?: number;
}

function Mission({
  myLevel = 0,
  currentLevel = 0,
  policyText,
  totalCount,
  currentCount,
}: MissionProps) {
  const iconName = useMemo(() => {
    switch (currentLevel) {
      case 1:
        return 'gift';
      case 2:
        return 'level';
      default:
        return 'message';
    }
  }, [currentLevel]);

  const missionText = useMemo(() => {
    switch (currentLevel) {
      case 1:
        return '도리도리 가입을 환영해요!';
      case 2:
        return '와드를 지정해보세요.';
      case 3:
        return '질문 1개 작성하기';
      default:
        return `${policyText} ${totalCount ?? '-'}개 작성하기`;
    }
  }, [currentLevel, totalCount, policyText]);

  const calcPercent = () => {
    if (myLevel > currentLevel) {
      return 100;
    }
    if (!totalCount || !currentCount) {
      return 0;
    }
    return totalCount <= currentCount ? 100 : (currentCount / totalCount) * 100;
  };

  return (
    <Wrapper disabled={myLevel < currentLevel}>
      <IconWrapper hasBorder>
        <img src={`/icons/${iconName}.svg`} alt="미션 아이콘" />
      </IconWrapper>
      <ProgressBarWrapper>
        <ProgressBarMessage>
          {missionText}
          {totalCount && (
            <span>
              {currentCount}/{totalCount}
            </span>
          )}
        </ProgressBarMessage>
        <ProgressBar>
          <Percent percent={calcPercent()} />
        </ProgressBar>
      </ProgressBarWrapper>
    </Wrapper>
  );
}

export default Mission;

const Wrapper = styled.div<{ disabled: boolean }>`
  display: flex;
  margin-top: 30px;
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
    `}
`;

const IconWrapper = styled.div<{ hasBorder?: boolean; isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: ${({ theme }) => theme.color.gray.Gray900};
  border-radius: 4px;
  ${({ hasBorder }) =>
    hasBorder &&
    css`
      margin-right: 16px;
      border: 1px solid ${({ theme }) => theme.color.gray.Gray700};
      border-radius: 8px;
    `}
  ${({ isSelected }) =>
    isSelected &&
    css`
      border: 1px solid ${({ theme }) => theme.color.primary.Lime300};
    `}
`;
const ProgressBarWrapper = styled.div`
  flex: 1;
`;

const ProgressBarMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  ${typography.Title2_Bold_16}
  span {
    color: ${({ theme }) => theme.color.gray.Gray600};
    ${typography.Caption1_Regular_13}
  }
`;

const ProgressBar = styled.div`
  position: relative;
  height: 4px;
  background-color: ${({ theme }) => theme.color.gray.Gray800};
  border-radius: 10px;
`;

const Percent = styled.div<{ percent: number }>`
  position: absolute;
  width: ${({ percent }) => percent ?? 0}%;
  height: 4px;
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.color.primary.Lime300}  0%, ${theme.color.secondary01.Blue300} 100%)`};
  border-radius: 10px;
  transition: width 0.5s;
`;
