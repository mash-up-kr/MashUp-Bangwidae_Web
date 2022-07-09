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

  max-height: 20px;
  margin-right: 8px;
  padding: 4px 10px;
  color: ${({ theme }) => theme.color.basic.DarkGray};
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 16px;
`;
