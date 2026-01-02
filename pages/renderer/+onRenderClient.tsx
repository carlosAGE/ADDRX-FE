import React from "react";
import { hydrateRoot } from "react-dom/client";

export { onRenderClient };

function onRenderClient(pageContext: any) {
  const { Page, pageProps } = pageContext;
  hydrateRoot(document.getElementById("root")!, <Page {...pageProps} />);
}
