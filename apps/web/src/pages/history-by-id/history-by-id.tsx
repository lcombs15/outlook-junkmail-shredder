import { type HistoryResult, getHistoryById } from "~/services/history-service";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

export default function HistoryById({
    params: { id },
}: {
    params: { id: string };
}) {
    const [content, setContent] = useState<HistoryResult>();
    const [notFound, setNotFound] = useState(false);
    useEffect(() => {
        getHistoryById(Number.parseInt(id))
            .then(setContent)
            .catch(() => setNotFound(true));
    }, [id]);

    if (notFound) {
        return `Not Found: ${id}`;
    }

    if (!content) {
        return "Loading...";
    }

    return (
        <div className="m-5 flex flex-col gap-2 w-1/4">
            <div>ID: {content?.id}</div>
            <div>From: {content?.fromEmail}</div>
            <div>Subject: {content?.subject}</div>
            <div>Date: {content?.receiveAt}</div>
            <div>Shredded?: {content?.wasShredded ? "Yes" : "No"}</div>
            {content.shreddedReason ? (
                <div>Reason: {content.shreddedReason}</div>
            ) : null}
            <Button
                className="hover:italic"
                variant="contained"
                color="error"
                onClick={() => {
                    if (
                        window.confirm(
                            "Are you sure you want to delete this record?",
                        )
                    ) {
                        fetch(`/api/history/${content.id}`, {
                            method: "DELETE",
                        }).then(() => {
                            window.location.href = "/";
                        });
                    }
                }}
            >
                Delete
            </Button>
        </div>
    );
}
