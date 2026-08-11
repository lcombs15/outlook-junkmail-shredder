import type { HistoryResult } from "~/services/useHistory";

export function SearchResult({ content }: { content: HistoryResult }) {
    const { fromEmail, shreddedReason, subject, receiveAt, wasShredded } =
        content;
    return (
        <div className="flex flex-col gap-1 bg-orange-400 p-1">
            <p>From: {fromEmail}</p>
            <p className="overflow-auto">Subject: {subject}</p>
            {wasShredded && <p>Shredded Reason: {shreddedReason}</p>}
            <p>Received At: {receiveAt}</p>
        </div>
    );
}
