import styled, { css } from 'styled-components';
import { ReactNode } from 'react';
import { typography } from '@/styles';

type ButtonType = 'default' | 'primary';

interface Props {
  buttonType?: ButtonType;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function LargeLineButton({
  buttonType = 'default',
  disabled = false,
  className,
  children,
  onClick,
}: Props) {
  return (
    <Button className={className} buttonType={buttonType} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

const Button = styled.button<{
  buttonType: ButtonType;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  ${typography.Caption2_Bold_12}
  padding: 8px 12px;
  color: ${({ theme }) => `${theme.color.basic.White}`};
  background: transparent;
  border: ${({ theme }) => `1px solid ${theme.color.gray.Gray700}`};
  border-radius: 40px;
  cursor: pointer;
  ${({ buttonType }) =>
    buttonType === 'primary' &&
    css`
      padding: 6px 12px;
      color: ${({ theme }) => theme.color.primary.Lime300};
      border: ${({ theme }) => `1px solid ${theme.color.primary.Lime300}`};
    `}
  &:disabled {
    color: ${({ theme }) => theme.color.gray.Gray600};
    border: ${({ theme }) => `1px solid ${theme.color.gray.Gray800}`};
  }
`;

export default LargeLineButton;
