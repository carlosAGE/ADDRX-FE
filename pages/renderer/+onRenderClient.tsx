import React from "react";
import { hydrateRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { chromeNeutral } from "../../src/theme/chromeNeutral";
import { GlobalStyle } from "../../src/theme/GlobalStyle";

export { onRenderClient };

function onRenderClient(pageContext: any) {
  const { Page, pageProps } = pageContext;
  hydrateRoot(
    document.getElementById("root")!,
    <ThemeProvider theme={chromeNeutral}>
      <GlobalStyle />
      <Page {...pageProps} />
    </ThemeProvider>
  );
}
