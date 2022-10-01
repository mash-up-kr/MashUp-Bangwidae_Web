import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Toggle } from '@/src/components';
import { typography } from '@/styles';
import { GET_NOTIFICATION_INFO } from '@/src/consts/query';
import { getMyNotificationSetting } from '@/pages/setting/alarm';
import { useNotificationUpdater } from './mutations';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';

function Alarm() {
  const { data, isLoading } = useQuery([GET_NOTIFICATION_INFO], getMyNotificationSetting);

  const [notification, setNotification] = useState(false);
  const [nightNotification, setNightNotification] = useState(false);
  const [locationInfo, setLocationInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!data) {
      return;
    }
    setNotification(data.notification);
    setNightNotification(data.nightNotification);
    setLocationInfo(data.locationInfo);
  }, [data]);

  const { mutate: updateNotificationInfo } = useNotificationUpdater({
    notification,
    nightNotification,
    locationInfo,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }
    updateNotificationInfo();
  }, [notification, nightNotification, locationInfo]);

  const handleLocationInfoChange = (v: boolean) => {
    if (!v) {
      setShowModal(true);
      return;
    }
    setLocationInfo(v);
  };

  return (
    <Wrapper>
      <Title>알림</Title>
      <ToggleWrapper hasBorder>
        <div>알림</div>
        <Toggle checked={notification} onChange={(v) => setNotification(v)} />
      </ToggleWrapper>
      <ToggleWrapper>
        <div>심야 알림 허용</div>
        <Toggle checked={nightNotification} onChange={(v) => setNightNotification(v)} />
      </ToggleWrapper>
      <Description>20:00 ~ 07:00 사이에도 알림을 보내드릴께요!</Description>
      <Title>위치정보</Title>
      <ToggleWrapper hasBorder>
        <div>위치정보 사용 허가하기</div>
        <Toggle checked={locationInfo} onChange={handleLocationInfoChange} />
      </ToggleWrapper>
      {showModal && (
        <ConfirmModal
          title="위치정보 사용 관리"
          subTitle="위치정보를 차단하면 앱 사용에 제한이 있어요. 위치정보를 허용해주세요!"
          confirmButtonTxt="허용하기"
          cancelButtonTxt="차단하기"
          onConfirm={() => {
            setLocationInfo(true);
            setShowModal(false);
          }}
          onCancel={() => {
            setLocationInfo(false);
            setShowModal(false);
          }}
        />
      )}
    </Wrapper>
  );
}

export default Alarm;

const Wrapper = styled.div`
  padding: 28px 30px 20px;
`;

const ToggleWrapper = styled.div<{ hasBorder?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ hasBorder }) =>
    hasBorder &&
    css`
      margin-bottom: 12px;
      padding-bottom: 13px;
      border-bottom: 1px solid #252525;
    `}
`;

const Title = styled.div`
  margin-bottom: 13px;
  color: ${({ theme }) => theme.color.gray.Gray400};
  ${typography.Body_Medium_14}
`;

const Description = styled.div`
  margin-bottom: 40px;
  padding-bottom: 12px;
  color: ${({ theme }) => theme.color.gray.Gray500};
  border-bottom: 1px solid #252525;
  ${typography.Caption1_Regular_13}
`;
