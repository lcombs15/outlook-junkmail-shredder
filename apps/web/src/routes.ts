import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
    index("pages/home/home.tsx"),
    route("history/:id", "pages/history-by-id/history-by-id.tsx"),
] satisfies RouteConfig;
