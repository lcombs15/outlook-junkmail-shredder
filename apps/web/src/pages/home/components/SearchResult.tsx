import type { HistoryResult } from "~/services/history-service";

export function SearchResult({ content }: { content: HistoryResult }) {
    const { fromEmail, shreddedReason, subject, receiveAt, wasShredded } =
        content;
    return (
        <a href={`/history/${content.id}`} className={"hover:underline"}>
            <div className="flex flex-col gap-1 bg-orange-400 p-1">
                <p>From: {fromEmail}</p>
                <p className="overflow-auto">Subject: {subject}</p>
                {wasShredded && <p>Shredded Reason: {shreddedReason}</p>}
                <p>Received At: {receiveAt}</p>
            </div>
        </a>
    );
}
