import styled from 'styled-components';
import { typography } from '@/styles';

export const SettingWrapper = styled.div`
  margin: 12px 30px;
`;

export const ItemWrapper = styled.div`
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray.Gray800};
`;

export const Title = styled.div`
  margin-bottom: 8px;
  ${typography.Title2_Regular_16}
`;

export const Date = styled.div`
  color: ${({ theme }) => theme.color.gray.Gray400};
  ${typography.Caption2_Regular_12}
`;

export const Content = styled.div`
  margin-top: 16px;
  color: #dcdddc;
  white-space: pre-line;
  ${typography.Caption1_Regular_13}
`;
