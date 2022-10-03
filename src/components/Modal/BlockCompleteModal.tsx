/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ReactNode } from 'react';
import styled from 'styled-components';
import Modal from '.';
import Flex from '../Flex';

interface Props {
  title: ReactNode;
  onConfirm?: () => void | Promise<unknown>;
  confirmButtonTxt?: string;
  isDisabled?: boolean;
}

function BlockCompleteModal({ title, onConfirm, confirmButtonTxt = '확인', isDisabled }: Props) {
  return (
    <Modal>
      <Flex direction="column" justify="center" align="center">
        <Flex direction="column" justify="center" align="center">
          {title}
        </Flex>
        <Button
          withBackground
          onClick={() => {
            onConfirm && onConfirm();
          }}
          disabled={isDisabled}
        >
          {confirmButtonTxt}
        </Button>
      </Flex>
    </Modal>
  );
}

export default BlockCompleteModal;

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

  :disabled {
    color: white;
    background-color: ${({ theme }) => theme.color.gray.Gray400};
  }
`;
