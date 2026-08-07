import { useEffect, useState } from "react";

export function Welcome() {
    const [content, setContent] = useState<Array<Record<string, string>>>([]);

    useEffect(() => {
        fetch("/api/history/ignored")
            .then((response) => response.json())
            .then((data) => {
                setContent(data.content);
            });
    }, [setContent]);

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-4">
            <h1 className="text-5xl">Outlook Junkmail Shredder</h1>
            {content.length > 0 ? (
                content.map((content, index) => (
                    <p key={index}>{JSON.stringify(content, null, 2)}</p>
                ))
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
