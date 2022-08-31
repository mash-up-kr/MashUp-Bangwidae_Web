/* eslint-disable @typescript-eslint/no-unused-expressions */
import { ReactNode } from 'react';
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
  isDisabled?: boolean;
}

function InPreparationModal({
  title,
  subTitle,
  addOn,
  onConfirm,
  confirmButtonTxt = '확인',
  isDisabled,
}: Props) {
  return (
    <Modal>
      <Flex direction="column" justify="center" align="center">
        <Flex direction="column" justify="center" align="center">
          <TwoLayerContainer top={title} bottom={subTitle} />
          {addOn && <Flex>{addOn}</Flex>}
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

export default InPreparationModal;

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
