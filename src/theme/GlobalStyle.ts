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

`
