/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-prop-types */
import { useQuery } from 'react-query';

import styled from 'styled-components';
import { useState } from 'react';
import Flex from '@/src/components/Flex';
import WardInfoContainer from './components/WardInfoContainer';
import { getMyWard } from '@/pages/my-ward';
import { Footer, StyledCarousel } from '../OpenInquiry/components/styledComponent';
import WardSection from './components/WardSection';
import { WardType } from './types';

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
  const [isOpen, setIsOpen] = useState(false);
  const [wardType, setWardType] = useState<WardType>('new');
  const [currentIdx, setCurrentIdx] = useState<number>();
  const { data: wardList } = useQuery(['myWard/getMyWard'], getMyWard);

  return (
    <Container>
      <Footer>
        <StyledCarousel>
          <WardInfoContainer
            type="new"
            location="강남구"
            remainDays="D-10"
            onAdd={() => {
              setIsOpen(true);
              setWardType('new');
            }}
          />
          {wardList &&
            wardList.map(({ id, name, remainDays }: Ward, idx: string) => (
              <WardInfoContainer
                key={id}
                type="existing"
                location={name}
                remainDays={remainDays}
                onExpand={() => {
                  setCurrentIdx(Number(idx));
                  setWardType('expand');
                  setIsOpen(true);
                }}
                onDelete={() => {
                  setCurrentIdx(Number(idx));
                  setWardType('delete');
                  setIsOpen(true);
                }}
              />
            ))}
        </StyledCarousel>
      </Footer>
      <WardSection
        isOpen={isOpen}
        wardType={wardType}
        targetId={currentIdx ? wardList[currentIdx] && wardList[currentIdx].id : null}
        setIsOpen={(status: boolean) => setIsOpen(status)}
        setWardType={(nextWardType: WardType) => setWardType(nextWardType)}
      />
    </Container>
  );
}

export default MyWard;

export const Container = styled(Flex)`
  position: 'relative';
  width: '100vw';
  height: '100vh';
  padding: 16;
`;
