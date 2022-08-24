import styled, { useTheme } from 'styled-components';
import { useState } from 'react';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';

interface Props {
  onConfirm: (wardName: string) => void;
  onCancel?: () => void;
}

const MIN_LENGTH = 2;
const MAX_LENGTH = 5;

function NewWardInputModal({ onConfirm, onCancel }: Props) {
  const colorTheme = useTheme();
  const [wardName, setWardName] = useState('');

  return (
    <ConfirmModal
      title={
        <TitleWrapper style={{ marginTop: 14, marginBottom: 8, textAlign: 'center' }}>
          <p style={{ marginBottom: 6 }}>
            <span>새로운 </span>
            <span style={{ color: colorTheme.color.primary.Lime300 }}>와드</span>의
          </p>
          <p>이름을 설정해주세요!</p>
        </TitleWrapper>
      }
      subTitle={
        <>
          <SubTitle style={{ marginTop: 4, fontSize: 14 }}>
            2~5자의 글자로 이름지어 주세요.
          </SubTitle>
          <Input onChange={(e) => setWardName(e.target.value)} maxLength={MAX_LENGTH} />
        </>
      }
      onConfirm={() => onConfirm(wardName)}
      onCancel={onCancel}
      isDisabled={wardName.length < MIN_LENGTH}
    />
  );
}

export default NewWardInputModal;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  margin-top: 20;
  margin-top: 20px;
  padding: 8px;
  color: white;
  font-weight: 700;
  font-size: 16px;
  background-color: ${({ theme }) => theme.color.gray.Gray700};
  border: none;
  border-radius: 8px;
`;

const SubTitle = styled.div`
  margin-bottom: 18px;
  font-weight: 400;
`;
