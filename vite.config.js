// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // listen on 0.0.0.0 for Replit
    port: 5000, // your chosen dev port
    // Allow Replit preview hosts (wildcard) + your exact sisko URL + local
    allowedHosts: [
      ".replit.dev",
      ".repl.co",
      "localhost",
      "127.0.0.1",
      "4855c4d4-4946-4496-8095-dd04aac9e150-00-39v7zvvrxqyf9.sisko.replit.dev",
    ],
    // HMR settings that work well on Replit tunnels
    hmr: {
      clientPort: 443,
    },
  },
  preview: {
    port: 5000,
    allowedHosts: [
      ".replit.dev",
      ".repl.co",
      "4855c4d4-4946-4496-8095-dd04aac9e150-00-39v7zvvrxqyf9.sisko.replit.dev",
    ],
  },
});
