import { WardType } from '../types';
import NewWardInputModal from './Modal/NewWardInputModal';
import WardConfirmModal from './Modal/WardConfirmModal';
import WardExpandModal from './Modal/WardExpandConfirmModal';
import WardDeleteConfirmModal from './Modal/WardDeleteConfirmModal';

interface Props {
  isOpen: boolean;
  location?: string;
  wardType: WardType;
  setIsOpen: (status: boolean) => void;
  setWardType: (wardType: WardType) => void;
  handleWardAdd: (wardName: string) => void;
  handleWardDelete: () => void;
  handleWardExpand: () => void;
}

function WardSection({
  isOpen = false,
  location,
  setIsOpen,
  setWardType,
  wardType,
  handleWardAdd,
  handleWardDelete,
  handleWardExpand,
}: Props) {
  if (!isOpen) return null;

  switch (wardType) {
    case 'new':
      return (
        <WardConfirmModal
          location={location ?? '강남구'}
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
            await handleWardAdd(wardName);
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    case 'expand':
      return (
        <WardExpandModal
          onConfirm={async () => {
            await handleWardExpand();
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    case 'delete':
      return (
        <WardDeleteConfirmModal
          onConfirm={async () => {
            await handleWardDelete();
            setIsOpen(false);
          }}
          onCancel={() => setIsOpen(false)}
        />
      );
    default:
      return null;
  }
}

export default WardSection;
