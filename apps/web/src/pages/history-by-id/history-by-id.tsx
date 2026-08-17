import { type HistoryResult, useHistoryById } from "~/services/history-service";
import { useEffect, useState } from "react";

export default function HistoryById({
    params: { id },
}: {
    params: { id: string };
}) {
    const [content, setContent] = useState<HistoryResult>();
    const [notFound, setNotFound] = useState(false);
    useEffect(() => {
        useHistoryById(Number.parseInt(id))
            .then(setContent)
            .catch(() => setNotFound(true));
    }, [id, setContent, setNotFound]);

    console.log({ content });

    return !content ? (
        notFound ? (
            `Not Found: ${id}`
        ) : (
            "Loading..."
        )
    ) : (
        <div>
            <div>ID: {content?.id}</div>
            <div>From: {content?.fromEmail}</div>
            <div>Subject: {content?.subject}</div>
            <div>Date: {content?.receiveAt}</div>
            <div>Shredded?: {content?.wasShredded ? "Yes" : "No"}</div>
            {content.shreddedReason ? (
                <div>Reason: {content.shreddedReason}</div>
            ) : null}
        </div>
    );
}
