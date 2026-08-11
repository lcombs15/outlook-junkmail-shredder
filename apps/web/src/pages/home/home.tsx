import type { Route } from "./+types/home";
import { useEffect, useState } from "react";
import { SearchResult } from "~/pages/home/components/SearchResult";
import { type HistoryResult, useHistory } from "~/services/useHistory";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "New React Router App" },
        { name: "description", content: "Welcome to React Router!" },
    ];
}

export default function Home() {
    const [content, setContent] = useState<Array<HistoryResult> | undefined>(
        undefined,
    );

    useEffect(() => {
        useHistory().then((data) => setContent(data));
    }, [setContent]);

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-4 h-full w-full overflow-scroll">
            <h1 className="text-5xl">Outlook Junkmail Shredder</h1>
            <div className="flex flex-row flex-wrap gap-3 justify-around p-8">
                {!!content ? (
                    content.map((content, index) => (
                        <div className="flex min-w-min">
                            <SearchResult key={index} content={content} />
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </div>
    );
}
