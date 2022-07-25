/* eslint-disable react/require-default-props */
import { ReactNode } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';
import Chat from '../../public/icons/chat.svg';
import Hand from '../../public/icons/hand.svg';
import Heart from '../../public/icons/heart.svg';
import Share from '../../public/icons/share.svg';
import More from '../../public/icons/more.svg';

type Name = 'chat' | 'hand' | 'heart' | 'share' | 'more';
type TextPosition = 'left' | 'right';

export interface IconProps {
  name?: Name;
  color: string;
  size: number;
  children?: ReactNode;
  className?: string;
  textPosition?: TextPosition;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const icons = {
  chat: <Chat />,
  hand: <Hand />,
  heart: <Heart />,
  share: <Share />,
  more: <More />,
};

function Icon({ name, color, size, children, className, textPosition, onClick }: IconProps) {
  if (textPosition === 'left') {
    return (
      <Button name={name} color={color} onClick={onClick} className={className}>
        <TextContent>{children}</TextContent>
        {name && (
          <SvgWrap color={color} size={size} includeText={!!children}>
            {icons[name]}
          </SvgWrap>
        )}
      </Button>
    );
  }

  return (
    <Button name={name} color={color} onClick={onClick} className={className}>
      {name && (
        <SvgWrap color={color} size={size} includeText={!!children}>
          {icons[name]}
        </SvgWrap>
      )}
      <TextContent>{children}</TextContent>
    </Button>
  );
}

export default Icon;

const SvgWrap = styled.div<{
  size: number;
  color: string;
  includeText: boolean;
}>`
  padding: ${({ includeText }) => includeText && '0 4px'};

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
  padding-bottom: 4px;
  ${typography.Caption2_Bold_12}
  font-weight: 400;
`;
