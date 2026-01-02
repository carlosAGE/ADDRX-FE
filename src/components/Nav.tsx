import { styled } from "styled-components";

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  .navContainer {
    display: flex;
    width: 100%;
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
  return (
    <StyledNav>
      <div className="navContainer">
        <StyledLink href="/">Home</StyledLink>
        <StyledLink href="/about">About</StyledLink>
        <StyledLink href="/contact">Contact</StyledLink>
        <StyledLink href="/archive">Archive</StyledLink>
      </div>
    </StyledNav>
  );
}
