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

  min-width: 43px;
  min-height: 22px;

  max-height: 20px;
  margin-right: 8px;
  padding: 4px 10px;
  color: ${({ theme }) => theme.color.basic.DarkGray};
  font-weight: 700;

  font-size: 14px;
  background-color: ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 16px;
`;
