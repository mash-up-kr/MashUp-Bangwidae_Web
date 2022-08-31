import { ReactNode } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Flex from '@/src/components/Flex';
import answered from '@/src/asset/image/answered.png';
import recevied from '@/src/asset/image/recevied.png';
import levelup from '@/src/asset/image/levelup.png';
import expired from '@/src/asset/image/expired.png';

interface Props {
  title: ReactNode;
  type: 'QUESTION_RECEIVED' | 'QUESTION_ANSWERED' | 'LEVEL_UP';
  content: ReactNode;
  createdAt: string;
}

const IMAGE_TYPE = {
  QUESTION_RECEIVED: answered,
  QUESTION_ANSWERED: recevied,
  LEVEL_UP: levelup,
  EXPIRED: expired,
};

function AlarmListRow({ type, title, content, createdAt }: Props) {
  const [month, day] = createdAt.split('.');

  return (
    <Flex direction="row" style={{ width: '100%', padding: '8px 16px', margin: '15px 0' }}>
      <ImageWrapper>
        <Image src={IMAGE_TYPE[type]} width={22} height={22} />
      </ImageWrapper>
      <Flex direction="column" style={{ width: '100%' }}>
        <Flex direction="row" justify="space-between" style={{ width: '100%' }}>
          <QuestionWrapper>{title}</QuestionWrapper>
          <CreatedDaysWrapper>
            {month}월 {day}일
          </CreatedDaysWrapper>
        </Flex>
        <div style={{ maxWidth: 200, fontSize: 17 }}>{content}</div>
      </Flex>
    </Flex>
  );
}

export default AlarmListRow;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 55px;
  height: 45px;

  margin: 14px 12px 0 0;
  background: ${({ theme }) => theme.color.gray.Gray900};
  border: 1px solid #252525;
  border-radius: 50%;

  & > image {
    object-fit: cover;
  }
`;

const QuestionWrapper = styled.div`
  max-width: 145;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.color.gray.Gray200};
  font-size: 12px;
`;

const CreatedDaysWrapper = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray500};
  font-size: 12px;
`;
