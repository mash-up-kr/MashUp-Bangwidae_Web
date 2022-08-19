/* eslint-disable react/no-unused-prop-types */
import { useQuery } from 'react-query';
import styled from 'styled-components';
import Flex from '@/src/components/Flex';
import WardInfoContainer from './components/WardInfoContainer';
import { getMyWard } from '@/pages/my-ward';
import { Footer } from '../OpenInquiry/components/styledComponent';
import Carousel from '@/src/components/Carousel';

interface Ward {
  id: string;
  isRepresentative: boolean;
  latitude: number;
  longitude: number;
  name: string;
  remainDays: string;
  createdAt: string;
}

function MyWard() {
  const { data: wardList } = useQuery(['myWard/getMyWard'], getMyWard);

  return (
    <Flex style={{ padding: 16, position: 'relative', width: '100vw', height: '100vh' }}>
      <Footer>
        <StyledCarousel>
          <WardInfoContainer type="new" location="강남구" remainDays="D-10" />
          {wardList &&
            wardList.map(({ id, name, remainDays }: Ward) => (
              <WardInfoContainer key={id} type="existing" location={name} remainDays={remainDays} />
            ))}
        </StyledCarousel>
      </Footer>
    </Flex>
  );
}

export default MyWard;

export const StyledCarousel = styled(Carousel)`
  width: calc(100% - 16px);
`;

// <button onClick={() => setIsOpen(true)}>모달 테스트를 위한 버튼</button>
// {isOpen && (
//   <WardConfirmModal
//     location="강남구"
//     onConfirm={() => {
//       setIsOpen(false);
//     }}
//     onCancel={() => {
//       setIsOpen(false);
//     }}
//   />
// )}
