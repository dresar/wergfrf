import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Split React and core libs into a separate vendor chunk
            if (id.includes('/react') || id.includes('/react-dom') || id.includes('/react-router-dom')) {
              return 'vendor';
            }
            // Keep UI libraries together
            if (id.includes('/@radix-ui') || id.includes('/class-variance-authority') || id.includes('/clsx') || id.includes('/tailwind-merge')) {
              return 'ui-libs';
            }
            // Split heavy icons
            if (id.includes('/lucide-react')) {
              return 'icons';
            }
            // Split heavy animation lib
            if (id.includes('/framer-motion')) {
              return 'framer';
            }
          }
        },
      },
    },
  },
}));
