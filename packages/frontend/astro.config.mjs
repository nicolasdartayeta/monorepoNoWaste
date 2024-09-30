import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  output: "server",
  server: {
    host: "0.0.0.0",
    hmr: { clientPort: 4321 },
    port: 4321,
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
        // Add files or directories to watch
        paths: ["src/**/*.astro", "src/**/*.js"], // Example: Watch only `.astro` and `.js` files in `src/`

        // Ignore files or directories
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/ignored-directory/**",
        ], // Exclude specific paths
      },
    },
  },
});
