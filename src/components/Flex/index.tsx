/* eslint-disable react/require-default-props */
import { CSSProperties, ReactNode } from 'react';

interface Props {
  direction?: CSSProperties['flexDirection'];
  justify?: CSSProperties['justifyContent'];
  align?: CSSProperties['alignItems'];
  style?: CSSProperties;
  children: ReactNode;
}

function Flex({ direction = 'row', justify = 'start', align = 'start', children, style }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Flex;
