import { ChangeEvent, Fragment } from 'react';
import styled from 'styled-components';
import { v4 } from 'uuid';

type OptionType = {
  value?: string | number;
  key: string;
  text: string;
};

interface RadioButtonProps {
  options: Array<OptionType>;
  value?: string | number;
  name?: string;
  onChange?: (value: string) => void;
}

function RadioButton({ options, value, name = v4(), onChange }: RadioButtonProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <Wrapper>
      {options.map((option) => (
        <Fragment key={option.key}>
          <Input
            id={option.key}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={handleChange}
          />
          <label htmlFor={option.key}>{option.text}</label>
        </Fragment>
      ))}
    </Wrapper>
  );
}

export default RadioButton;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  display: none;
  & + label {
    min-height: 34px;
    margin: 0 10px 10px 0;
    padding: 7px 12px;
    color: ${({ theme }) => theme.color.basic.White};
    background: transparent;
    border: 1px solid ${({ theme }) => theme.color.basic.White};
    border-radius: 40px;
  }
  &:checked + label {
    color: ${({ theme }) => theme.color.primary.Lime300};
    border: 1px solid ${({ theme }) => theme.color.primary.Lime300};
  }
`;
