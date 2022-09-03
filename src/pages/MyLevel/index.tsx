import styled, { css } from 'styled-components';
// import dynamic from 'next/dynamic';
import CheckIcon from 'public/icons/check.svg';
import LevelIcon from 'public/icons/level.svg';
import RockIcon from 'public/icons/rock.svg';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
// import Spline from '@splinetool/react-spline';
import { useQuery } from 'react-query';
import { typography } from '@/styles';
import { getLevelPolicy, getMyLevel } from '@/pages/my-level';
import Mission from './components/Mission';
import LevelMessage from './components/LevelMessage';
import { LEVEL_POLICY, MY_LEVEL } from '@/src/consts/query';

const MISSION_TITLE_ARR = ['질문', '답변'];
const STANDARD_LEVEL = 3;

function MyLevel() {
  // TODO: dynamic을 사용하면 호출이 더 많이 일어남. 확인 필요
  // const Spline = dynamic(() => import('@splinetool/react-spline'), {
  //   ssr: false,
  // });

  // const [showSpline, setShowSpline] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [policyArr, setPlicyArr] = useState<Array<string>>();
  const levelListRef = useRef<HTMLDivElement>(null);

  // 현재 선택된 값이 이전 레벨인지 앞으로의 레벨인지 판단하는 값 필요 -> 따라서 메세지 표출

  const { data: myLevelInfo, isLoading: isLoadingMyLevelInfo } = useQuery(MY_LEVEL, getMyLevel);
  const { data: levelpolicy } = useQuery(
    [LEVEL_POLICY, selectedLevel],
    getLevelPolicy(selectedLevel),
  );

  const myLevel = useMemo(() => (myLevelInfo?.userLevel ?? 0) + 1, [myLevelInfo]);

  useEffect(() => {
    const level = (myLevelInfo?.userLevel ?? 0) + 1;
    setSelectedLevel(level);
    setPlicyArr(myLevelInfo?.userLevel > STANDARD_LEVEL ? MISSION_TITLE_ARR : undefined);
    levelListRef.current?.scrollTo({
      left: 70 * (level - 1),
      behavior: 'smooth',
    });
  }, [myLevelInfo]);

  const handleClick = useCallback(
    (currentLevel: number) => () => {
      setSelectedLevel(currentLevel);
      setPlicyArr(currentLevel > STANDARD_LEVEL ? MISSION_TITLE_ARR : undefined);
    },
    [],
  );

  const getLevelBoxIcon = (currentLevel: number) => {
    if (myLevel === currentLevel) {
      return <LevelIcon />;
    }
    if (myLevelInfo?.userLevel < currentLevel) {
      return <RockIcon />;
    }
    return <CheckIcon />;
  };

  if (isLoadingMyLevelInfo) {
    return null;
  }

  return (
    <>
      <LevelBoxWrapper ref={levelListRef}>
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
          {levelpolicy?.imageUrl ? <StyledImg alt="level" src={levelpolicy?.imageUrl} /> : <div />}
          {/* {!showSpline && levelpolicy?.imageUrl && (
            <StyledImg alt="level" src={levelpolicy?.imageUrl} />
          )} */}
          {/* <Spline
            onLoad={() => {
              setShowSpline(true);
            }}
            scene="https://prod.spline.design/mHPQGrOzHhcb4YmF/scene.splinecode"
          /> */}
        </SplineWrapper>
        <LevelMessage
          userLevel={myLevelInfo?.userLevel}
          selectedLevel={selectedLevel}
          maxWardCount={levelpolicy?.maxWardCount}
        />
        <MissionWrapper>
          {policyArr ? (
            policyArr.map((policy, index) => {
              const isAnswer = index === 0;
              return (
                <Mission
                  key={policy}
                  myLevel={myLevel}
                  currentLevel={selectedLevel}
                  policyText={policy}
                  totalCount={
                    isAnswer
                      ? levelpolicy?.answerCountCondition
                      : levelpolicy?.questionCountCondition
                  }
                  currentCount={
                    isAnswer ? myLevelInfo?.userAnswerCount : myLevelInfo?.userQuestionCount
                  }
                />
              );
            })
          ) : (
            <Mission
              myLevel={myLevel}
              currentLevel={selectedLevel}
              currentCount={myLevelInfo?.userAnswerCount}
            />
          )}
        </MissionWrapper>
      </Wrapper>
    </>
  );
}

export default MyLevel;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 156.2px);
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
    min-width: 80px;
    margin-right: 0px;
  }
  ::-webkit-scrollbar {
    display: none;
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

const MissionWrapper = styled.div`
  height: 160px;
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

const StyledImg = styled.img`
  height: 205px;
`;
