import React from "react";
import { styled, useTheme, keyframes, css } from "styled-components";
import AX from "../../public/icons/AX";

/** Animations */
const logoIn = keyframes`
  from { opacity: 0; transform: translateY(-2px) scale(0.94); filter: blur(2px); }
  to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
`;

const leftLinksOut = keyframes`
  from { opacity: 0; transform: translateX(48px); filter: blur(1px); }
  to   { opacity: 1; transform: translateX(0); filter: blur(0); }
`;

const rightLinksOut = keyframes`
  from { opacity: 0; transform: translateX(-48px); filter: blur(1px); }
  to   { opacity: 1; transform: translateX(0); filter: blur(0); }
`;

const StyledNav = styled.nav<{ $mounted: boolean }>`
  display: flex;
  flex-wrap: wrap;

  .navContainer {
    display: flex;
    justify-content: center;
    width: 100%;
    padding: 2rem;
  }

  .linksContainer {
    display: flex;
    align-items: center;
    position: relative;

    width: 100%;
    max-width: min(90vw, 900px);

    justify-content: center; /* mobile default */
    @media (min-width: 768px) {
      justify-content: space-between;
    }
  }

  .leftGroup,
  .rightGroup {
    display: flex;
    align-items: center;
    position: relative;
    z-index: 1;
  }

  .iconContainer {
    margin: 0 auto;
  }
  .iconContainer {
    position: relative;
    z-index: 2;
    display: grid;
    place-items: center;

    button {
      background: transparent;
      border: none;
      padding: 0;
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }
    }
  }

  ${(p) =>
    p.$mounted
      ? css`
          .iconContainer {
            animation: ${logoIn} 520ms cubic-bezier(0.2, 0.9, 0.2, 1) 60ms both;
          }
          .leftGroup {
            animation: ${leftLinksOut} 560ms cubic-bezier(0.2, 0.9, 0.2, 1)
              260ms both;
          }
          .rightGroup {
            animation: ${rightLinksOut} 560ms cubic-bezier(0.2, 0.9, 0.2, 1)
              260ms both;
          }
        `
      : css`
          .iconContainer,
          .leftGroup,
          .rightGroup {
            opacity: 0;
            transform: translateY(0);
          }
        `}

  @media (prefers-reduced-motion: reduce) {
    .iconContainer,
    .leftGroup,
    .rightGroup {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      filter: none !important;
    }
  }
`;

const StyledLink = styled.a`
  display: inline-block;
  padding: 10px 14px;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    box-shadow: inset 0 -1px 0 ${(props) => props.theme.colors.surface2};
  }
`;

export default function Nav() {
  const theme = useTheme() as any;
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <StyledNav $mounted={mounted}>
      <div className="navContainer">
        <div className="linksContainer">
          <div className="leftGroup">
            <StyledLink href="/">Home</StyledLink>
            <StyledLink href="/about">About</StyledLink>
          </div>

          <div className="iconContainer">
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              aria-label="Go home"
            >
              <AX
                style={{ width: "auto", height: "3rem" }}
                fill={theme.colors.text}
              />
            </button>
          </div>

          <div className="rightGroup">
            <StyledLink href="/contact">Contact</StyledLink>
            <StyledLink href="/archive">Archive</StyledLink>
          </div>
        </div>
      </div>
    </StyledNav>
  );
}
