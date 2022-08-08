import styled from 'styled-components';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';
import theme from '@/styles/theme';

interface Props {
  location: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function WardConfirmModal({ location, onConfirm, onCancel }: Props) {
  return (
    <ConfirmModal
      title={
        <TitleWrapper>
          <p style={{ marginBottom: 6 }}>
            <span>지금 </span>
            <span style={{ color: theme.color.primary.Lime300 }}>{location}</span>에
          </p>
          <span>와드를 심으시겠어요?</span>
        </TitleWrapper>
      }
      subTitle={<SubTitle>최소 20일간 소통할 수 있어요!</SubTitle>}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default WardConfirmModal;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

const SubTitle = styled.span`
  font-weight: 400;
  font-size: 14px;
`;
