import styled, { css, keyframes } from 'styled-components';
import ShadowSvg from 'public/images/shadow.svg';
import WingSvg from 'public/images/wing.svg';
import { typography } from '@/styles';
import Carousel from '@/src/components/Carousel';

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
  overflow: hidden;
`;

export const Footer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;

  margin-bottom: 16px;
  margin-left: 8px;

  overflow: hidden;
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

export const Description = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  margin-top: 8px;
  color: #767676;
  white-space: pre-line;
  text-align: center;
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

export const StyledCarousel = styled(Carousel)`
  width: calc(100% - 16px);
  white-space: no-wrap;
`;

export const ProfileImageWrapper = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
`;

const doridori = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  100%{
    transform: rotateY(45deg);
  }
`;

export const ProfileImage = styled.img`
  position: absolute;
  top: 0;
  z-index: 10;
  padding: 10px;
  object-fit: cover;
  background: ${({ theme }) => theme.color.gray.Gray900};
  border-radius: 250px;
  animation: ${doridori} 1s 1s infinite linear alternate;
`;

const shadow = keyframes`
  0% {
    left: -10px;
  }
  100% {
    left: 77px;
  }
`;

export const Shadow = styled(ShadowSvg)`
  position: absolute;
  top: 15px;
  transition: left 1.5s ease;
  animation: ${shadow} 2s infinite linear alternate;
`;

const rightWing = keyframes`
  0% {
    right: 0px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 0
  }
  100% {
    right: calc((100vw - 100%) * -1);
    opacity: 0;
  }
`;

const leftWing = keyframes`
  0% {
    left: -12px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  70% {
    opacity: 0
  }
  100% {
    left: calc((100vw - 100%) * -1);
    opacity: 0
  }
`;

export const Wing = styled(WingSvg)<{ isLeft?: boolean }>`
  position: absolute;
  opacity: 1;
  animation: ${rightWing} 2s infinite;
  ${({ isLeft }) =>
    isLeft &&
    css`
      transform: rotate(180deg);
      animation: ${leftWing} 2s infinite;
    `}
`;
