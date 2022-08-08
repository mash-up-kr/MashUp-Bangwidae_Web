import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  elementId: string;
}

function Modal({ children }: { children: ReactNode }) {
  return (
    <Portal elementId="modal-root">
      <ModalWrapper>
        <ModalContent>{children}</ModalContent>
      </ModalWrapper>
    </Portal>
  );
}

export default Modal;

function Portal({ children, elementId }: Props) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById(elementId));
  }, []);

  if (!element) {
    return null;
  }

  return ReactDOM.createPortal(children, element);
}

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10000;
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  width: 75%;
  padding: 30px 16px;
  text-align: center;
  background-color: ${({ theme }) => theme.color.gray.Gray800};
  border-radius: 16px;
  transform: translate3d(-50%, -50%, 0);
  filter: drop-shadow(0 3px 13px rgba(0, 0, 0, 0.039))
    drop-shadow(0 10.5px 36px rgba(0, 0, 0, 0.19));
`;
