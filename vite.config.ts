import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vike from "vike/plugin";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              ssr: true,
              displayName: true,
              fileName: false,
              pure: true,
            },
          ],
        ],
      },
    }),
    vike(),
  ],

  resolve: {
    dedupe: ["styled-components"],
  },

  ssr: {
    noExternal: ["styled-components"],
  },
});
