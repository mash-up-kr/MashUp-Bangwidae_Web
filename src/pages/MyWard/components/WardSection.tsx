import { WardType } from '../types';
import NewWardInputModal from './Modal/NewWardInputModal';
import WardConfirmModal from './Modal/WardConfirmModal';
import WardExpandModal from './Modal/WardExpandConfirmModal';
import { useDeleteWard, useExpandWardPeriod, usePlantWard } from '../remote';
import WardDeleteConfirmModal from './Modal/WardDeleteConfirmModal';

interface Props {
  isOpen: boolean;
  wardType: WardType;
  targetId?: string;
  setIsOpen: (status: boolean) => void;
  setWardType: (wardType: WardType) => void;
}

function WardSection({ isOpen = false, setIsOpen, targetId, setWardType, wardType }: Props) {
  const { mutate: mutatePlantWard } = usePlantWard();
  const { mutate: mutateExpandWardPeriod } = useExpandWardPeriod(targetId);
  const { mutate: mutateDeleteWard } = useDeleteWard(targetId);

  if (!isOpen) return null;

  switch (wardType) {
    case 'new':
      return (
        <WardConfirmModal
          location="강남구"
          onConfirm={() => {
            setWardType('newInput');
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    case 'newInput':
      return (
        <NewWardInputModal
          onConfirm={async (wardName) => {
            try {
              await mutatePlantWard(wardName);

              setIsOpen(false);
            } catch (e) {
              console.log(e);
            }
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    case 'expand':
      return (
        <WardExpandModal
          onConfirm={async () => {
            try {
              await mutateExpandWardPeriod();

              setIsOpen(false);
            } catch (e) {
              alert('에러가 발생했습니다. 다시 시도해주세요.');
            }
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    case 'delete':
      return (
        <WardDeleteConfirmModal
          onConfirm={async () => {
            try {
              await mutateDeleteWard();

              setIsOpen(false);
            } catch (e) {
              alert('에러가 발생했습니다. 다시 시도해주세요.');
            }
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    default:
      return null;
  }
}

export default WardSection;
