import styled, { keyframes } from 'styled-components';
import React, { useEffect, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { typography } from '@/styles';

// TODO: 공통 컴포넌트로 분리
interface PortalProps {
  children: ReactNode;
  elementId: string;
}

// TODO: 공통 컴포넌트로 분리
function Portal({ children, elementId }: PortalProps) {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById(elementId));
  }, []);

  if (!element) {
    return null;
  }

  return ReactDOM.createPortal(children, element);
}

interface PopupMenuProps {
  children: ReactNode;
  onClose: React.MouseEventHandler;
  isBeforeClose: boolean;
}

export default function PopupMenu({ children, onClose, isBeforeClose }: PopupMenuProps) {
  return (
    <Portal elementId="modal-root">
      <Overlay onClick={onClose} isBeforeClose={isBeforeClose} />
      <Layout isBeforeClose={isBeforeClose}>
        <ButtonsLayout>
          {React.Children.map(children, (child) => (
            <Button key={new Date().getTime()}>{child}</Button>
          ))}
        </ButtonsLayout>
        <CancelButton onClick={onClose}>취소</CancelButton>
      </Layout>
    </Portal>
  );
}

/* Slide Animation */
const slideUp = keyframes`
  from {
    transform: translateY(222px);
  }
`;

/* Slide Animation */
const slideDown = keyframes`
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(222px);
  }
`;

const Overlay = styled.div<{
  isBeforeClose: boolean;
}>`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.color.basic.Black};
  visibility: ${({ isBeforeClose }) => (isBeforeClose ? 'hidden' : 'visible')};
  opacity: 70%;
`;

const Layout = styled.div<{
  isBeforeClose: boolean;
}>`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  padding: 0 10px;
  border: 0;
  animation-name: ${({ isBeforeClose }) => (isBeforeClose ? slideDown : slideUp)};
  /* Slide Animation */
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
`;

const ButtonsLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const Button = styled.button`
  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 12px 12px;
  }

  ${typography.Title2_Regular_16}
  width: 100%;
  margin: 0 auto;
  background: #262627;
  color: #438ff7;
  height: 50px;
  cursor: pointer;
  border: none;
  border-bottom: 1px solid #444445;

  &:hover {
    background: #49494b;
  }
`;

const CancelButton = styled.button`
  ${typography.Title2_Regular_16}
  margin: 12px auto 10px auto;
  width: 100%;
  color: #438ff7;
  background: #262627;
  border-radius: 12px;
  height: 50px;
  border: none;

  &:hover {
    background: #49494b;
  }
`;
