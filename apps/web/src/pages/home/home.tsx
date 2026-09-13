import { useEffect, useState } from "react";
import { SearchResult } from "~/pages/home/components/SearchResult";
import { type HistoryResult, listHistory } from "~/services/history-service";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { useDebounceValue } from "~/hooks/useDebouceValue";
import { LoadingSpinner } from "~/components/LoadingSpinner";

export default function Home() {
    const [content, setContent] = useState<Array<HistoryResult> | undefined>(
        undefined,
    );

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [shredded, setShredded] = useState<boolean>(false);

    const debouncedSearchTerm = useDebounceValue(searchTerm);

    useEffect(() => {
        listHistory({ searchTerm: debouncedSearchTerm, shredded }).then(
            setContent,
        );
    }, [setContent, debouncedSearchTerm, shredded]);

    return (
        <div className="flex flex-col items-center justify-center pt-8 pb-4 h-full w-full overflow-auto gap-5">
            <h1 className="text-5xl">Outlook Junkmail Shredder</h1>
            <div className={"bg-white w-1/3"}>
                <TextField
                    className={"text-orange-500"}
                    id="standard-basic"
                    label="Search"
                    variant="filled"
                    color={"primary"}
                    fullWidth={true}
                    onChange={(event) => {
                        setContent(undefined);
                        setSearchTerm(event.target.value);
                    }}
                />
            </div>
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            defaultChecked={shredded}
                            onChange={() => setShredded(!shredded)}
                            sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                    color: "var(--color-primary)",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                    {
                                        backgroundColor: "var(--color-primary)",
                                    },
                            }}
                        />
                    }
                    label="Shredded?"
                />
            </FormGroup>
            <div className="flex flex-row flex-wrap gap-3 justify-around p-8">
                {content ? (
                    content.map((content, index) => (
                        <div className="flex min-w-min" key={index}>
                            <SearchResult key={index} content={content} />
                        </div>
                    ))
                ) : (
                    <LoadingSpinner />
                )}
            </div>
            {searchTerm ? <div>{content?.length} results found.</div> : null}
        </div>
    );
}
