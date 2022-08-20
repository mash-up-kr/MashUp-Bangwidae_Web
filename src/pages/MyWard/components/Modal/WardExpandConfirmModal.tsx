import styled from 'styled-components';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';
import theme from '@/styles/theme';

interface Props {
  onConfirm?: () => void;
  onCancel?: () => void;
}

function WardExpandModal({ onConfirm, onCancel }: Props) {
  return (
    <ConfirmModal
      title={
        <TitleWrapper style={{ marginTop: 14, marginBottom: 8, textAlign: 'center' }}>
          <p style={{ marginBottom: 6 }}>
            <span>와드 기간을</span>
            <span style={{ color: theme.color.primary.Lime300 }}> 연장</span>하시겠어요?
          </p>
        </TitleWrapper>
      }
      subTitle={<SubTitle style={{ fontSize: 14 }}>기존 기간에서 10일이 더 늘어나요!</SubTitle>}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default WardExpandModal;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

const SubTitle = styled.div`
  margin-bottom: 18px;
  font-weight: 400;
`;
