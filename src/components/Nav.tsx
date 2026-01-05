import { styled, useTheme } from "styled-components";
import AX from "../../public/icons/AX";

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;

  .linksContainer {
    display: flex;
    align-items: center;
    gap: 4rem;

    a {
      border: none;
    }
  }
  .iconContainer {
    button {
      &:hover {
        opacity: 0.8;
      }
    }
  }

  .navContainer {
    display: flex;
    justify-content: center;
    gap: 12px;
    width: 100%;
    padding: 2rem;
  }
`;

const StyledLink = styled.a`
  display: inline-block; /* ← THIS is the fix */
  padding: 10px 14px;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s ease, color 0.15s ease;
  /* &:hover {
    border-bottom-color: ${(props) => props.theme.colors.surface2};
    color: ${(props) => props.theme.colors.textMuted};
  } */

  &:hover {
    box-shadow: inset 0 -1px 0 ${(props) => props.theme.colors.surface2};
  }
`;

export default function Nav() {
  const theme = useTheme() as any;
  return (
    <StyledNav>
      <div className="navContainer">
        <div className="linksContainer">
          <StyledLink href="/">Home</StyledLink>
          <StyledLink href="/about">About</StyledLink>
          <div className="iconContainer">
            {/* icon from public/AX.png */}
            <button
              // transparent everything, only to show icon and navigate to /
              onClick={() => {
                window.location.href = "/";
              }}
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              <AX
                style={{ width: "auto", height: "3rem" }}
                fill={theme.colors.text}
              />
            </button>
          </div>
          <StyledLink href="/contact">Contact</StyledLink>
          <StyledLink href="/archive">Archive</StyledLink>
        </div>
      </div>
    </StyledNav>
  );
}
