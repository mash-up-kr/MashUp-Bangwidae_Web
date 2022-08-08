import styled from 'styled-components';
import { typography } from '@/styles';

export const Header = styled.div`
  margin-top: 32px;
  margin-left: 30px;
  font-weight: 400;
  font-size: 24px;
  white-space: pre-line;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  height: 68vh;
`;

export const Footer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  width: 100vw;

  margin-bottom: 3vh;
  padding-left: 24px;

  overflow: scroll;
`;

export const ContainerTitle = styled.div`
  max-width: 196px;
  padding-bottom: 10px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.gray.Gray500};
  white-space: nowrap;
  text-overflow: ellipsis;

  ${typography.Body_Medium_14}
`;

export const StyledSpan = styled.span`
  color: ${({ theme }) => theme.color.primary.Lime300};
  ${typography.Giant1_Bold_24}
`;

export const Title = styled.p`
  ${typography.Title1_Bold_18}
`;

export const Description = styled.p`
  width: 200px;
  margin-top: 8px;
  color: #767676;
  white-space: pre-line;
  ${typography.Body_Regular_14}
`;

export const TendencyTag = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 24px;
  margin-right: 8px;
  padding: 2px 8px;
  color: ${({ theme }) => theme.color.gray.Gray100};
  font-weight: 700;
  font-size: 14px;
  background: ${({ theme }) => theme.color.gray.Gray700};
  border-radius: 4px;
`;

export const QuestionButton = styled.button`
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  color: ${({ theme }) => theme.color.primary.Lime300};
  font-size: ${typography.Body_Bold_14};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.color.primary.Lime300};
  border-radius: 10px;
`;
