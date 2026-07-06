import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // Import the v4 compiler engine

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
});
