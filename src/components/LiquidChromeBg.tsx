import { styled, keyframes } from "styled-components";

const chromeFlow = keyframes`
  0% {
    background-position: 0% 0%, 100% 20%, 40% 100%, 0% 0%;
    transform: rotate(-8deg) scale(1.2) translate3d(-1%, -1%, 0);
  }
  100% {
    background-position: 100% 90%, 0% 70%, 60% 0%, 100% 100%;
    transform: rotate(-8deg) scale(1.2) translate3d(1%, 1%, 0);
  }
`;

const chromeShine = keyframes`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
`;

const Wrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
`;

const Base = styled.div`
  position: absolute;
  inset: -20%;
  transform: rotate(-8deg) scale(1.2);
  will-change: background-position, filter, transform;

  background: radial-gradient(
      60% 50% at 20% 30%,
      rgba(255, 255, 255, 0.95),
      rgba(255, 255, 255, 0) 60%
    ),
    radial-gradient(
      50% 60% at 80% 40%,
      rgba(255, 255, 255, 0.85),
      rgba(255, 255, 255, 0) 62%
    ),
    radial-gradient(
      70% 80% at 55% 75%,
      rgba(0, 0, 0, 0.55),
      rgba(0, 0, 0, 0) 60%
    ),
    linear-gradient(
      120deg,
      #0a0a0c 0%,
      #bfc2c7 18%,
      #17181c 34%,
      #f4f5f7 52%,
      #202126 68%,
      #cfd2d7 84%,
      #0b0b0f 100%
    );

  background-size: 140% 140%, 150% 150%, 160% 160%, 260% 260%;
  background-position: 0% 0%, 100% 20%, 40% 100%, 0% 0%;

  filter: contrast(1.15) brightness(1.05);
  animation: ${chromeFlow} 14s ease-in-out infinite alternate;

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

const Shine = styled.div`
  position: absolute;
  inset: -30%;
  transform: rotate(12deg) scale(1.2);
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.55;

  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.55) 45%,
    rgba(255, 255, 255, 0) 60%
  );

  background-size: 220% 100%;
  background-position: 0% 0%;
  animation: ${chromeShine} 9s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none !important;
  }
`;

export default function LiquidChromeBg() {
  return (
    <Wrapper aria-hidden>
      <Base />
      <Shine />
    </Wrapper>
  );
}
