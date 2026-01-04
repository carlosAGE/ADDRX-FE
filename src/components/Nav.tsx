import { styled, useTheme } from "styled-components";
import AX from "../../public/icons/AX";

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;

  .navContainer {
    display: flex;
    justify-content: center;
    gap: 12px;
  }
`;

const StyledLink = styled.a`
  padding: 10px 14px;
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  border-radius: 0px;
  color: ${(props) => props.theme.colors.text};

  &:hover {
    background-color: ${(props) => props.theme.colors.surface2};
    color: ${(props) => props.theme.colors.textMuted};
  }
`;

export default function Nav() {
  const theme = useTheme() as any;
  return (
    <StyledNav>
      <div className="navContainer">
        <div className="iconContainer">
          {/* icon from public/AX.png */}
          <AX
            style={{ width: "10rem", height: "10rem" }}
            fill={theme.colors.text}
          />
          <div>ADDRX</div>
        </div>
        <div className="linksContainer">
          <StyledLink href="/">Home</StyledLink>
          <StyledLink href="/about">About</StyledLink>
          <StyledLink href="/contact">Contact</StyledLink>
          <StyledLink href="/archive">Archive</StyledLink>
        </div>
      </div>
    </StyledNav>
  );
}
