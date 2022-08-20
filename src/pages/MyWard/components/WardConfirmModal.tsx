import styled from 'styled-components';
import Image from 'next/image';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';
import theme from '@/styles/theme';
import addWard from '@/src/asset/image/addWard.png';

interface Props {
  location: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

function WardConfirmModal({ location, onConfirm, onCancel }: Props) {
  return (
    <ConfirmModal
      title={
        <TitleWrapper style={{ marginTop: 24, marginBottom: 8, textAlign: 'center' }}>
          <p style={{ marginBottom: 6 }}>
            <span>지금 </span>
            <span style={{ color: theme.color.primary.Lime300 }}>{location}</span>에
          </p>
          <p>지금 와드를 심으시겠어요?</p>
        </TitleWrapper>
      }
      subTitle={<SubTitle>최소 20일간 소통할 수 있어요!</SubTitle>}
      addOn={<Image src={addWard} width={150} height={123} />}
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

const SubTitle = styled.div`
  margin-bottom: 18px;
  font-weight: 400;
`;
