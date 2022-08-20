/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ReactNode, useState } from 'react';
import styled from 'styled-components';
import TwoLayerContainer from '@/src/pages/OpenInquiry/components/TwoLayerComponent';
import Modal from '.';
import Flex from '../Flex';

interface Props {
  title: ReactNode;
  subTitle?: ReactNode;
  addOn?: ReactNode;
  onConfirm?: () => void | Promise<unknown>;
  confirmButtonTxt?: string;
  onCancel?: () => void | Promise<unknown>;
  cancelButtonTxt?: string;
}

function ConfirmModal({
  title,
  subTitle,
  addOn,
  onConfirm,
  confirmButtonTxt = '확인',
  onCancel,
  cancelButtonTxt = '취소',
}: Props) {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal>
      <Flex direction="column">
        <TwoLayerContainer top={title} bottom={subTitle} style={{ marginBottom: 20 }} />
        {addOn}
      </Flex>
      <Flex justify="space-between" style={{ width: '100%', marginTop: 8 }}>
        <Button
          withBackground={false}
          style={{ marginRight: 8 }}
          onClick={() => {
            onCancel && onCancel();
            setIsOpen(false);
          }}
        >
          {cancelButtonTxt}
        </Button>
        <Button
          withBackground
          onClick={() => {
            onConfirm && onConfirm();
            setIsOpen(false);
          }}
        >
          {confirmButtonTxt}
        </Button>
      </Flex>
    </Modal>
  );
}

export default ConfirmModal;

const Button = styled.button<{ withBackground: boolean }>`
  width: 100%;
  height: 48px;
  margin-top: 8px;
  color: ${({ withBackground }) => (withBackground ? 'black' : 'white')};
  font-weight: 700;
  font-size: 14px;
  background-color: ${({ withBackground, theme }) =>
    withBackground ? theme.color.primary.Lime300 : 'transparent'};
  border: ${({ withBackground, theme }) =>
    withBackground ? 'none' : `1px solid ${theme.color.gray.Gray500}`};
  border-radius: 8px;
`;
