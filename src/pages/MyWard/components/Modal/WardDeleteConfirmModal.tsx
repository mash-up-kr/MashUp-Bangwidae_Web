import styled from 'styled-components';
import ConfirmModal from '@/src/components/Modal/ConfirmModal';
import theme from '@/styles/theme';

interface Props {
  onConfirm?: () => void;
  onCancel?: () => void;
}

function WardDeleteConfirmModal({ onConfirm, onCancel }: Props) {
  return (
    <ConfirmModal
      title={
        <TitleWrapper style={{ marginTop: 14, marginBottom: 8, textAlign: 'center', fontSize: 18 }}>
          <p style={{ marginBottom: 6 }}>
            <span>와드를</span>
            <span style={{ color: theme.color.primary.Lime300 }}>삭제</span>하시겠어요?
          </p>
        </TitleWrapper>
      }
      subTitle={<SubTitle style={{ fontSize: 14 }}>장소에 방문하면 다시 심을 수 있어요!</SubTitle>}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default WardDeleteConfirmModal;

const TitleWrapper = styled.div`
  margin-bottom: 8px;
  font-weight: 700;
  font-size: 18px;
`;

const SubTitle = styled.div`
  margin-bottom: 18px;
  font-weight: 400;
`;
