import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';

interface SnackBarProps {
  text: string;
  onClose?: () => void;
}

function SnackBar({ text, onClose }: SnackBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 800);
    }, 3000);
  }, [setIsVisible]);
  return <Wrapper isVisible={isVisible}>{text}</Wrapper>;
}

export default SnackBar;

const Wrapper = styled.div<{ isVisible: boolean }>`
  position: absolute;
  bottom: 104px;
  left: calc(50% - 115px);
  min-width: 230px;
  height: 38px;
  padding: 10px 32px;
  color: ${({ theme }) => theme.color.basic.White};
  text-align: center;
  /* FIXME: 디자인시스템에 없는 색상 디자인팀에 문의 필요 */
  background-color: rgba(37, 37, 37, 0.8);
  border-radius: 4px;
  opacity: ${({ isVisible }) => (isVisible ? 0.95 : 0)};
  transition: opacity 0.5s;
  ${typography.Caption1_Regular_13}
`;
