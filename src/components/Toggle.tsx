/* eslint-disable react/require-default-props */
import { nanoid } from 'nanoid';
import React, { useCallback, MouseEvent } from 'react';
import styled from 'styled-components';

export interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ id = nanoid(), checked, onChange }: ToggleProps) {
  const handleCheck = useCallback(() => {
    onChange?.(!checked);
  }, [checked, onChange]);

  const handleWrapperClick = useCallback((e: MouseEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  return (
    <Element onClick={handleWrapperClick}>
      <Input id={id} type="checkbox" checked={checked} onChange={handleCheck} />
      <Label htmlFor={id} />
    </Element>
  );
}

export default Toggle;

const Element = styled.div`
  position: relative;
  display: flex;
`;

const Label = styled.label`
  position: relative;
  display: inline-block;
  width: 47px;
  height: 24px;
  vertical-align: top;
  background-color: ${({ theme }) => theme.color.primary.Lime800};
  border-radius: 12px;
  &::after {
    position: absolute;
    top: 2.5px;
    left: 25.5px;
    display: block;
    width: 19.15px;
    height: 19px;
    background-color: ${({ theme }) => theme.color.primary.Lime300};
    border-radius: 20px;
    transition: left 0.3s ease 0s, background-color 0.3s ease 0s, box-shadow 0.3s ease 0s;
    content: '';
  }
  input:not(:checked) ~ & {
    background-color: ${({ theme }) => theme.color.gray.Gray700};
    &::after {
      left: 2.5px;
      background-color: ${({ theme }) => theme.color.gray.Gray200};
    }
  }
  input:disabled ~ & {
    opacity: 0.3;
  }
`;

const Input = styled.input`
  display: none;
  &:focus-visible:enabled ~ ${Label} {
    border-radius: 20px;
    box-shadow: 0 0 0 1px blue, 0 0 0 3px pink;
  }
`;
