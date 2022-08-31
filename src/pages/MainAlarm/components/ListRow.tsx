import { ReactNode } from 'react';
import styled from 'styled-components';
import Flex from '@/src/components/Flex';
import TwoLayerContainer from '../../OpenInquiry/components/TwoLayerComponent';

interface Props {
  title: ReactNode;
  content: ReactNode;
}

function AlarmListRow({ title, content }: Props) {
  return (
    <Flex direction="row">
      <ImageWrapper />
      <TwoLayerContainer top={<AlarmTopWrapper>{title}</AlarmTopWrapper>} bottom={content} />
    </Flex>
  );
}

export default AlarmListRow;

const ImageWrapper = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 16px;

  & > image {
    object-fit: cover;
  }
`;

const AlarmTopWrapper = styled.div`
  margin-bottom: 8px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.gray.Gray500};
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
