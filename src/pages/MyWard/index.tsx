/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unused-prop-types */
import { useQuery } from '@tanstack/react-query';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import Flex from '@/src/components/Flex';
import WardInfoContainer from './components/WardInfoContainer';
import { getMyWard } from '@/pages/my-ward';
import { Footer, StyledCarousel } from '../OpenInquiry/components/styledComponent';
import WardSection from './components/WardSection';
import DomesticMap from '@/src/components/DomesticMap';
import { WardType } from './types';
import { getRealAddress, useDeleteWard, useExpandWardPeriod, usePlantWard } from './remote';

export interface Ward {
  id: string;
  isRepresentative: boolean;
  latitude: number;
  longitude: number;
  name: string;
  remainDays: string;
  createdAt: string;
}

interface CurrnetLocation {
  name: string;
  latitude?: number;
  longitude?: number;
}

function MyWard() {
  const [isOpen, setIsOpen] = useState(false);
  const [wardType, setWardType] = useState<WardType>('new');
  const [currentIdx, setCurrentIdx] = useState<number>();
  const [currentLocation, setCurrentLocation] = useState<CurrnetLocation>();
  const { data: wardList } = useQuery(['myWard/getMyWard'], getMyWard);
  const targetId = currentIdx ? wardList[currentIdx] && wardList[currentIdx].id : null;

  const { mutate: mutatePlantWard, isLoading } = usePlantWard({
    latitude: currentLocation?.latitude,
    longitude: currentLocation?.longitude,
  });
  const { mutate: mutateExpandWardPeriod, isLoading: isExpandWardLoading } =
    useExpandWardPeriod(targetId);
  const { mutate: mutateDeleteWard } = useDeleteWard(targetId);

  useEffect(() => {
    async function onSuccess(position: GeolocationPosition) {
      const { latitude, longitude } = position.coords;

      const result = await getRealAddress({
        latitude,
        longitude,
      });
      setCurrentLocation({
        name: result?.읍면동 ?? '강남구',
        latitude,
        longitude,
      });
    }

    async function getCurrentLocation() {
      await navigator.geolocation.getCurrentPosition(onSuccess);
    }

    getCurrentLocation();
  }, []);

  return (
    <Container>
      <DomesticMap wardList={wardList} />
      <Footer>
        <StyledCarousel>
          <WardInfoContainer
            type="new"
            location={currentLocation?.name ?? '강남구'}
            onAdd={() => {
              setIsOpen(true);
              setWardType('new');
            }}
            isLoading={isLoading}
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
                isLoading={isExpandWardLoading}
              />
            ))}
        </StyledCarousel>
      </Footer>
      <WardSection
        isOpen={isOpen}
        location={currentLocation?.name}
        wardType={wardType}
        setIsOpen={(status: boolean) => setIsOpen(status)}
        setWardType={(nextWardType: WardType) => setWardType(nextWardType)}
        handleWardAdd={mutatePlantWard}
        handleWardDelete={mutateDeleteWard}
        handleWardExpand={mutateExpandWardPeriod}
      />
    </Container>
  );
}

export default MyWard;

export const Container = styled(Flex)`
  position: 'relative';
  width: '100vw';
  height: '100vh';
  margin: 0 auto;
  padding: 16px;
`;
