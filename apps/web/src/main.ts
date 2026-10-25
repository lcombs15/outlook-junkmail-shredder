import "react-router";
import express from "express";
import { createRequestHandler } from "@react-router/express";
import { createProxyMiddleware } from "http-proxy-middleware"; // @ts-expect-error will fix later/never
import * as build from "../build/server/index.js";
import https from "node:https";
import morgan from "morgan";
import * as fs from "node:fs";

const app = express();
const port = 5174;

const server = https.createServer(
    {
        key: fs.readFileSync("./cert-key.pem"),
        cert: fs.readFileSync("./cert.pem"),
    },
    app,
);

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

server.listen(port, "0.0.0.0", () =>
    console.log(`Api running on port http://localhost:${port}`),
);
