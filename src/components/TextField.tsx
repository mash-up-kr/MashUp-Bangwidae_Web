/* eslint-disable react/require-default-props */
import { ChangeEvent } from 'react';
import styled from 'styled-components';
import { typography } from '@/styles';

interface TextFieldProps {
  value: string;
  label?: string;
  maxLength?: number;
  placeholder?: string;
  hintText?: string;
  onChange: (value: string) => void;
}

function TextField({ value, label, maxLength, placeholder, hintText, onChange }: TextFieldProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <Element>
      {label && <Label>{label}</Label>}
      <Input value={value} onChange={handleChange} placeholder={placeholder} isError={!!hintText} />
      {hintText && <HintText>{hintText}</HintText>}
      {maxLength && (
        <MaxLength>
          {value.length}
          <span>/{maxLength}</span>
        </MaxLength>
      )}
    </Element>
  );
}

export default TextField;

const Element = styled.div`
  position: relative;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray500};
  ${typography.Body_Regular_14}
`;

const Input = styled.input<{ isError?: boolean }>`
  width: 100%;
  padding: 16px 0 13px;
  color: ${({ theme }) => theme.color.basic.White};
  background-color: transparent;
  border: none;
  border-bottom: 1px solid
    ${({ theme, isError }) => (isError ? theme.color.error.Red500 : theme.color.primary.Lime300)};
  box-shadow: none;
  caret-color: ${({ theme }) => theme.color.primary.Lime300};
  ${typography.Giant2_Bold_20}
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: ${({ theme }) => theme.color.gray.Gray700};
  }
`;

const HintText = styled.div`
  position: absolute;
  left: 0;
  margin-top: 7px;
  color: ${({ theme }) => theme.color.error.Red500};
  ${typography.Caption1_Regular_13}
`;

const MaxLength = styled.div`
  position: absolute;
  right: 0;
  margin-top: 7px;
  ${typography.Caption1_Regular_13}
  color: ${({ theme }) => theme.color.gray.Gray500};
  span {
    color: ${({ theme }) => theme.color.gray.Gray700};
  }
`;
