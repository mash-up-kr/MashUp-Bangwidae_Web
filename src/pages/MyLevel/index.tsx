import styled, { css } from 'styled-components';
// import dynamic from 'next/dynamic';
import MessageIcon from 'public/icons/message.svg';
import CheckIcon from 'public/icons/check.svg';
import LevelIcon from 'public/icons/level.svg';
import RockIcon from 'public/icons/rock.svg';
import { useCallback, useState } from 'react';
import Spline from '@splinetool/react-spline';
import levelMessage from './message';
import { typography } from '@/styles';

function MyLevel() {
  // TODO: dynamic을 사용하면 호출이 더 많이 일어남. 확인 필요
  // const Spline = dynamic(() => import('@splinetool/react-spline'), {
  //   ssr: false,
  // });

  // FIXME: 임시 값
  const myLevel = 3;

  const [showSpline, setShowSpline] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(myLevel);

  const handleClick = useCallback(
    (currentLevel: number) => () => {
      setSelectedLevel(currentLevel);
    },
    [setSelectedLevel],
  );

  const getLevelBoxIcon = (currentLevel: number) => {
    if (myLevel === currentLevel) {
      return <LevelIcon />;
    }
    if (myLevel < currentLevel) {
      return <RockIcon />;
    }
    return <CheckIcon />;
  };

  return (
    <>
      <LevelBoxWrapper>
        {[...Array(20)].map((_, index) => {
          const currentLevel = index + 1;
          return (
            <LevelBox onClick={handleClick(currentLevel)}>
              <Level isSelected={selectedLevel === currentLevel}>Lv. {currentLevel}</Level>
              <IconWrapper isSelected={selectedLevel === currentLevel}>
                {getLevelBoxIcon(currentLevel)}
              </IconWrapper>
            </LevelBox>
          );
        })}
      </LevelBoxWrapper>
      <Wrapper>
        <SplineWrapper>
          {!showSpline && (
            <StyledImg
              alt="level"
              src="https://kr.object.ncloudstorage.com/dori-dori-bucket/LEVEL/1.png"
            />
          )}
          <Spline
            onLoad={() => {
              setShowSpline(true);
            }}
            scene="https://prod.spline.design/mHPQGrOzHhcb4YmF/scene.splinecode"
          />
        </SplineWrapper>
        {levelMessage[1]}
        {['질문', '답변'].map((i) => (
          <MissionWrapper disabled={myLevel !== selectedLevel}>
            <IconWrapper hasBorder>
              <MessageIcon />
            </IconWrapper>
            <ProgressBarWrapper>
              <ProgressBarMessage>
                {i} 5개 작성하기
                <span>5/5</span>
              </ProgressBarMessage>
              <ProgressBar>
                <Percent percent={50} />
              </ProgressBar>
            </ProgressBarWrapper>
          </MissionWrapper>
        ))}
      </Wrapper>
    </>
  );
}

export default MyLevel;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 104.2px);
  padding: 28px 30px 20px;
`;

const LevelBox = styled.div`
  width: 50px;
  margin-right: 20px;
`;

const LevelBoxWrapper = styled.div`
  display: flex;
  padding: 28px 0px 0px 30px;
  overflow: scroll; /* TODO: 스크롤 안보이게 처리 필요 */
  ${LevelBox}:last-child {
    margin-right: 30px;
  }
`;

const Level = styled.div<{ isSelected?: boolean }>`
  width: 50px;
  margin-bottom: 8px;
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.color.primary.Lime300 : theme.color.gray.Gray600};
  text-align: center;
  ${typography.Caption1_Bold_13}
`;

const SplineWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const MissionWrapper = styled.div<{ disabled: boolean }>`
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
`;

const StyledImg = styled.img`
  width: 185px;
  height: 205px;
`;
