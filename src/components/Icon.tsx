import { ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';

type Name = 'chat' | 'hand' | 'heart' | 'share';

export interface IconProps {
  name: Name;
  color: string;
  size: number;
  children: ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Icon({ name, color, size, children, onClick }: IconProps) {
  return (
    <Button name={name} color={color} onClick={onClick}>
      <Img src={`/icons/${name}.svg`} size={size} alt={name} />
      <TextContent>{children}</TextContent>
    </Button>
  );
}

export default Icon;

const Button = styled.button<{
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: ${({ color }) => color};
  background-color: transparent;
  border: 0;
  cursor: pointer;
  ${typography.Caption2_Bold_12}
`;

const Img = styled.img<{
  size: number;
}>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  padding-right: 4px;
`;

const TextContent = styled.span`
  ${typography.Caption2_Bold_12}
  font-weight: 400;
`;
