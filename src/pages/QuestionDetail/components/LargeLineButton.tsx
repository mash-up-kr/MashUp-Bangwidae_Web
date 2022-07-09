import styled from 'styled-components';

interface Props {
  borderColor: string;
  fontColor: string;
  children: string;
}

function LargeLineButton({ borderColor, fontColor, children }: Props) {
  return (
    <Button type="button" borderColor={borderColor} fontColor={fontColor}>
      {children}
    </Button>
  );
}

/*
 ** SCSS 변수 적용
 */
const Button = styled.button<{
  borderColor?: string;
  fontColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 18px;
  color: ${({ fontColor }) => `${fontColor}`};
  font-weight: 700;
  font-size: 12px;
  line-height: 18px;
  background: transparent;
  border: ${({ borderColor }) => `1px solid ${borderColor}`};
  border-radius: 40px;
`;

export default LargeLineButton;
