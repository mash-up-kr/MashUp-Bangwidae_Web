import styled from 'styled-components';

type Name = 'chat' | 'hand' | 'heart' | 'share';

export interface IconProps {
  name: Name;
  color: string;
  size: number;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

function Icon({ name, color, size, onClick }: IconProps) {
  return (
    <Button name={name} color={color} size={size} onClick={onClick}>
      <Img src={`/icons/${name}.svg`} alt={name} />
    </Button>
  );
}

export default Icon;

const Button = styled.button<{
  color: string;
  size: number;
}>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  padding: 0;
  color: ${({ color }) => color};
  background-color: transparent;
  border: 0;
  cursor: pointer;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
`;
