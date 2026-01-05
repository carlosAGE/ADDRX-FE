import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, "Apple Color Emoji","Segoe UI Emoji";
    min-height: 100%;
  }
  body {
    min-height: 100vh;
  }

  *, *::before, *::after { box-sizing: border-box; }

  a { color: inherit; }

  // some subtle background pattern
  body {
    position: relative;

}

/* fiber overlay */
body::before{
  content:"";
  position: fixed;
  inset: 0;
  pointer-events: none;

  /* 3 layers: vertical fibers + secondary fibers + faint diagonal “pulp” */
  background-image:
    repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent} 0px,
      ${({ theme }) => theme.colors.accent2} 1px,
      transparent 1px,
      transparent 14px
    ),
    repeating-linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.accent} 0px,
      ${({ theme }) => theme.colors.accent2} 1px,
      transparent 1px,
      transparent 7px
    ),
    repeating-linear-gradient(
      25deg,
      ${({ theme }) => theme.colors.accent} 0px,
      ${({ theme }) => theme.colors.accent2} 1px,
      transparent 1px,
      transparent 18px
    );

  /* offset sizes so it doesn’t look like a pattern */
  background-size: 220px 100%, 140px 100%, 260px 100%;
  background-position: 0 0, 40px 0, -30px 0;

  /* keep readable */
  opacity: 0.55;
  mix-blend-mode: overlay;
}
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;

  background: linear-gradient(
    to bottom,
    ${({ theme }) => theme.colors.accent2}8%,
    ${({ theme }) => theme.colors.accent2}8%,
    rgba(0,0,0,0.0) 50%,
    rgba(0,0,0,0.06) 100%
  );

  mix-blend-mode: overlay;
}
`
