import {
    isRouteErrorResponse,
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function meta() {
    return [
        { title: "Junkmail Shredder" },
        { name: "description", content: "Outlook Junkmail Shredder" },
    ];
}

export const links: Route.LinksFunction = () => [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
    },
];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={new QueryClient()}>
            <html
                lang="en"
                className="min-h-screen min-w-screen w-full dark bg-background m-0"
            >
                <head>
                    <meta charSet="utf-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1"
                    />
                    <Meta />
                    <Links />
                </head>
                <body className="h-full w-full max-h-full max-w-full bg-background m-0">
                    <div className={"float-start absolute"}>
                        <div className={"flex flex-row gap-20"}>
                            {[
                                {
                                    icon: <HomeIcon fontSize={"inherit"} />,
                                    href: "/",
                                },
                                {
                                    icon: <BarChartIcon fontSize={"inherit"} />,
                                    href: "/dashboard",
                                },
                            ].map(({ href, icon }) => {
                                return (
                                    <a
                                        key={href}
                                        href={href}
                                        className={
                                            "decoration-0 hover:text-green-400"
                                        }
                                    >
                                        <div
                                            className={
                                                "w-10 h-10 flex grow text-8xl"
                                            }
                                        >
                                            {icon}
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </body>
            </html>
        </QueryClientProvider>
    );
}

export default function App() {
    return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
