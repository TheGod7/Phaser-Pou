import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    base: "./",
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(process.cwd(), "index.html"),
                game: resolve(process.cwd(), "game.html"),
            },
        },
    },
    server: {
        port: 3001,
    },
});

