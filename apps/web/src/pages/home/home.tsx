import { useEffect, useState } from "react";
import { SearchResult } from "~/pages/home/components/SearchResult";
import { type HistoryResult, listHistory } from "~/services/history-service";
import { FormControlLabel, FormGroup, Switch, TextField } from "@mui/material";
import { useDebounceValue } from "~/hooks/useDebouceValue";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import classNames from "classnames";

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
        <div
            className={classNames(
                "flex flex-col pt-8 pb-4 h-full w-full overflow-auto gap-5",
                "items-center",
                "break-after-all md:break-normal",
                "wrap-anywhere md:wrap-normal",
            )}
        >
            <h1 className="md:text-5xl text-3xl">Outlook Junkmail Shredder</h1>
            <div className={"bg-white md:w-1/3 w-8/10"}>
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
            <div
                className={classNames(
                    "flex flex-row flex-wrap gap-3",
                    "max-w-dvw",
                    "md:justify-around justify-center",
                    "pr-4 pl-4",
                )}
            >
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
            {searchTerm && !!content ? (
                <div>{content?.length} results found.</div>
            ) : null}
        </div>
    );
}
