import "react-router";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import { createProxyMiddleware } from "http-proxy-middleware"; // @ts-ignore
import * as build from "../build/server/index.js";
import morgan from "morgan";

const app = express();
const port = 5174;

app.use(
    "/api",
    createProxyMiddleware({
        target: `http://${process.env.BACKEND_HOST || "localhost"}:3000`,
        changeOrigin: true,
        pathRewrite: {
            "^/api": "",
        },
    }),
);

app.use(
    "/assets",
    express.static("build/client/assets", { immutable: true, maxAge: "1y" }),
);

app.use(morgan("tiny"));

app.use(
    createRequestHandler({
        build: build,
    }),
);

app.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
