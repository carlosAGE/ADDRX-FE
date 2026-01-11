import { styled, keyframes } from "styled-components";

const enterUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
`;

export const SlideInBot = styled.div`
  opacity: 0;
  animation: ${enterUp} 1000ms ease-out 200ms forwards; /* 0.2s delay + 0.2s anim */
  will-change: transform, opacity, filter;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;
    transform: none;
    filter: none;
  }
`;
