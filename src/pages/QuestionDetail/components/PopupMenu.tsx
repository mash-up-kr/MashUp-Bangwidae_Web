import styled from 'styled-components';
import React, { useEffect, useState, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { typography } from '@/styles';

interface Props {
  children: ReactNode;
  elementId: string;
}

// TODO: 별도 컴포넌트로 분리
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

export default function PopupMenu() {
  return (
    <Portal elementId="modal-root">
      <Overlay />
      <Layout>
        <ButtonsLayout>
          <Button>수정하기</Button>
          <Button>삭제하기</Button>
          <Button>익명으로 변경</Button>
        </ButtonsLayout>
        <CancelButton>취소</CancelButton>
      </Layout>
    </Portal>
  );
}

const Overlay = styled.div`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.color.basic.Black};
  opacity: 70%;
`;

const Layout = styled.div`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  width: 100%;
  padding: 0 10px;
  border: 0;
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
