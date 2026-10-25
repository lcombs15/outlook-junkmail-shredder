import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
    plugins: [tailwindcss(), reactRouter(), basicSsl()],
    resolve: {
        tsconfigPaths: true,
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
                secure: false,
                // Optional: removes the "/api" prefix before forwarding the request
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
        },
    },
});
