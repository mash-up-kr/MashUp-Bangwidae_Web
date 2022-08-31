/* eslint-disable react/require-default-props */
import { CSSProperties, ReactNode } from 'react';

interface Props {
  direction?: CSSProperties['flexDirection'];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  style?: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
}

function Flex({
  direction = 'row',
  justify = 'start',
  align = 'start',
  children,
  style,
  onClick,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Flex;
