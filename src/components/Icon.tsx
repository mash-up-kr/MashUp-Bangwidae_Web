/* eslint-disable react/require-default-props */
import { ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';
import Chat from '../../public/icons/chat.svg';
import Hand from '../../public/icons/hand.svg';
import Heart from '../../public/icons/heart.svg';
import Share from '../../public/icons/share.svg';

type Name = 'chat' | 'hand' | 'heart' | 'share';

export interface IconProps {
  name: Name;
  color: string;
  size: number;
  children: ReactNode;
  className?: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const icons = {
  chat: <Chat />,
  hand: <Hand />,
  heart: <Heart />,
  share: <Share />,
};

function Icon({ name, color, size, children, className, onClick }: IconProps) {
  return (
    <Button name={name} color={color} onClick={onClick} className={className}>
      <SvgWrap color={color} size={size}>
        {icons[name]}
      </SvgWrap>
      <TextContent>{children}</TextContent>
    </Button>
  );
}

export default Icon;

const SvgWrap = styled.div<{
  size: number;
  color: string;
}>`
  padding-right: 4px;

  svg {
    width: ${({ size }) => size};
    height: ${({ size }) => size};
  }

  path {
    fill: ${({ color }) => color};
  }
`;

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

const TextContent = styled.span`
  ${typography.Caption2_Bold_12}
  font-weight: 400;
`;
