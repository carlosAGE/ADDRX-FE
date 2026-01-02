import React from "react";
import { renderToString } from "react-dom/server";
import { ThemeProvider, ServerStyleSheet } from "styled-components";
import { chromeNeutral } from "../../src/theme/chromeNeutral";
import { GlobalStyle } from "../../src/theme/GlobalStyle";
import { escapeInject, dangerouslySkipEscape } from "vike/server";

export { onRenderHtml };

function onRenderHtml(pageContext: any) {
  const { Page, pageProps } = pageContext;

  const sheet = new ServerStyleSheet();

  try {
    const appHtml = renderToString(
      sheet.collectStyles(
        <ThemeProvider theme={chromeNeutral}>
          <GlobalStyle />
          <Page {...pageProps} />
        </ThemeProvider>
      )
    );

    const styleTags = sheet.getStyleTags(); // string of <style>...</style>

    return escapeInject`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          ${dangerouslySkipEscape(styleTags)}
          <title>ADDRX</title>
        </head>
        <body>
          <div id="root">${dangerouslySkipEscape(appHtml)}</div>
        </body>
      </html>`;
  } finally {
    sheet.seal();
  }
}
