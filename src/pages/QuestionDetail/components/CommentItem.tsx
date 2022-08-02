import styled from 'styled-components';
import { IconTextButton } from '@/src/components';
import { typography } from '@/styles';

function QuestionDetail() {
  return (
    <Layout>
      <FlexRow gap={8}>
        <ProfileImage src="https://picsum.photos/200" />
        <FlexBetween>
          <FlexColumn gap={6}>
            <FlexRow gap={8}>
              <Nickname>도리를 찾아서</Nickname>
              <LevelTag>Lv.1</LevelTag>
            </FlexRow>
          </FlexColumn>
        </FlexBetween>
        <FlexRow gap={8}>
          <LocatedAt>강남구</LocatedAt>
          <CreatedAt>1분 전</CreatedAt>
          <IconPosition>
            <IconTextButton name="more" color="#767676" size={24} onClick={() => {}} />
          </IconPosition>
        </FlexRow>
      </FlexRow>
      <CommentContent>니모의 절친 도리를 모른다고??</CommentContent>
      <FlexBetween>
        <FlexRow gap={8}>
          <IconTextButton color="#767676" size={24} onClick={() => {}}>
            답글 달기
          </IconTextButton>
          <VerticalDivider />
          <IconTextButton color="#DBF87A" size={24} onClick={() => {}}>
            좋아요
          </IconTextButton>
        </FlexRow>
        <IconTextButton
          name="heart"
          color="#DBF87A"
          size={24}
          textPosition="left"
          onClick={() => {}}
        >
          <IconText>1</IconText>
        </IconTextButton>
      </FlexBetween>
    </Layout>
  );
}

export default QuestionDetail;

const Layout = styled.div`
  padding: 17px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

const FlexRow = styled.div<{
  gap: number;
}>`
  display: flex;
  align-items: center;
  column-gap: ${({ gap }) => `${gap}px`};
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border: 1px solid #3a3a3a;
  border-radius: 50%;
`;

const FlexBetween = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: space-between;
`;

const FlexColumn = styled.div<{
  gap: number;
}>`
  display: flex;
  flex-direction: column;
  row-gap: ${({ gap }) => `${gap}px`};
`;

const Nickname = styled.div`
  ${typography.Body_Medium_14}
`;

const LevelTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 18px;
  color: ${({ theme }) => theme.color.gray.Gray800};
  font-weight: 700;
  font-size: 12px;
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 40px;
`;

const LocatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}

  ::after {
    height: 10px;
    margin-left: 10px;
    border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
    content: '';
  }
`;

const CreatedAt = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray600};
  font-weight: 400;
  ${typography.Caption2_Regular_12}
`;

const IconPosition = styled.div`
  padding-top: 4px;
`;

const IconText = styled.span`
  color: white;
`;

const CommentContent = styled.div`
  margin: 10px 0;
  padding: 10px 0;
  color: white;
  font-size: 14px;
`;

const VerticalDivider = styled.div`
  height: 10px;
  border-right: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;
