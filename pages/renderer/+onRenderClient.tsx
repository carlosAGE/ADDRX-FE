import React from "react";
import { hydrateRoot } from "react-dom/client";
// @ts-expect-error css module
import "../../src/index.css";

export { onRenderClient };

function onRenderClient(pageContext: any) {
  const { Page, pageProps } = pageContext;
  hydrateRoot(document.getElementById("root")!, <Page {...pageProps} />);
}
