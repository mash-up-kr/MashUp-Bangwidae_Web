/* eslint-disable react/require-default-props */
import { CSSProperties, ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}

function Tag({ children, style }: Props) {
  return <LevelTag style={{ ...style }}>{children}</LevelTag>;
}

export default Tag;

const LevelTag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 18px;
  color: ${({ theme }) => theme.color.gray.Gray800};
  font-weight: 700;
  font-size: 12px;
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 40px;
`;
