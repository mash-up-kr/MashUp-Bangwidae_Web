/* eslint-disable react/require-default-props */
import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

type TagType = 'fulfilled' | 'outline';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
  type?: TagType;
  color?: string;
  backgroundColor?: string;
}

function Tag({
  type = 'fulfilled',
  color = 'black',
  backgroundColor = '#DBF87A',
  style,
  children,
}: Props) {
  return (
    <CustomTag type={type} color={color} backgroundColor={backgroundColor} style={{ ...style }}>
      {children}
    </CustomTag>
  );
}

export default Tag;

const CustomTag = styled.div<{ type: TagType; backgroundColor: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  padding: 0 10px;
  color: ${({ color }) => color};
  font-weight: 700;
  font-size: 12px;
  background-color: ${({ type, backgroundColor }) =>
    type === 'fulfilled' ? backgroundColor : 'transparent'};
  border: ${({ type, color }) => (type === 'fulfilled' ? 'none' : `1px solid ${color}`)};
  border-radius: 40px;
`;
