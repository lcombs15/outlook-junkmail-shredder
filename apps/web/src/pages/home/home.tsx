import { useEffect, useState } from "react";
import { SearchResult } from "~/pages/home/components/SearchResult";
import { type HistoryResult, listHistory } from "~/services/history-service";
import { TextField } from "@mui/material";
import { useDebounceValue } from "~/hooks/useDebouceValue";

export default function Home() {
    const [content, setContent] = useState<Array<HistoryResult> | undefined>(
        undefined,
    );

    const [searchTerm, setSearchTerm] = useState<string>("");

    const debouncedSearchTerm = useDebounceValue(searchTerm);

    useEffect(() => {
        listHistory({ searchTerm: debouncedSearchTerm }).then((data) =>
            setContent(data),
        );
    }, [setContent, debouncedSearchTerm]);

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-4 h-full w-full overflow-scroll gap-5">
            <h1 className="text-5xl">Outlook Junkmail Shredder</h1>
            <div className={"bg-white w-1/3"}>
                <TextField
                    className={"text-orange-500"}
                    id="standard-basic"
                    label="Search"
                    variant="filled"
                    color={"primary"}
                    fullWidth={true}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
            <div className="flex flex-row flex-wrap gap-3 justify-around p-8">
                {content ? (
                    content.map((content, index) => (
                        <div className="flex min-w-min" key={index}>
                            <SearchResult key={index} content={content} />
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
            {searchTerm ? <div>{content?.length} results found.</div> : null}
        </div>
    );
}
