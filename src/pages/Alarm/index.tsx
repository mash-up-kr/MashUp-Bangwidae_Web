import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Toggle } from '@/src/components';
import { typography } from '@/styles';

function Alarm() {
  const [alarm1, setAlarm1] = useState(true);
  const [alarm2, setAlarm2] = useState(false);
  const [alarm3, setAlarm3] = useState(true);

  const handleChange = async (v: boolean) => {
    setAlarm1(v);
    const data = await axios.get(`/api/user/me`, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Cache-Control': 'no-cache',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOCK_TOKEN}`,
      },
    });
    console.log(data);
  };
  return (
    <Wrapper>
      <Title>알림</Title>
      <ToggleWrapper style={{ marginBottom: '34px' }}>
        <div>알림</div>
        <Toggle checked={alarm1} onChange={handleChange} />
      </ToggleWrapper>
      <ToggleWrapper>
        <div>심야 알림 허용</div>
        <Toggle checked={alarm2} onChange={(v) => setAlarm2(v)} />
      </ToggleWrapper>
      <Description>20:00 ~ 07:00 사이에도 알림을 보내드릴께요!</Description>
      <Title style={{ marginTop: '77px' }}>위치정보</Title>
      <ToggleWrapper>
        <div>위치정보 사용 허가하기</div>
        <Toggle checked={alarm3} onChange={(v) => setAlarm3(v)} />
      </ToggleWrapper>
    </Wrapper>
  );
}

export default Alarm;

const Wrapper = styled.div`
  padding: 28px 30px 20px;
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  /* margin-bottom: 34px; */
`;

const Title = styled.div`
  margin-bottom: 13px;
  color: ${({ theme }) => theme.color.gray.Gray400};
  ${typography.Body_Medium_14}
`;

const Description = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray500};
  ${typography.Caption1_Regular_13}
`;
