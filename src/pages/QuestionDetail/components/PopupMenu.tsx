import styled from 'styled-components';
import { typography } from '@/styles';

export default function PopupMenu() {
  return (
    <Layout>
      <ButtonsLayout>
        <Button>수정하기</Button>
        <Button>삭제하기</Button>
        <Button>익명으로 변경</Button>
      </ButtonsLayout>
      <CancelButton>취소</CancelButton>
    </Layout>
  );
}

const Layout = styled.div`
  position: fixed;
  bottom: 0;
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
`;

const CancelButton = styled.button`
  margin: 12px auto 10px auto;
  width: 100%;
  color: #438ff7;
  background: #262627;
  border-radius: 12px;
  height: 50px;
  border: none;
  ${typography.Title2_Regular_16}
`;
