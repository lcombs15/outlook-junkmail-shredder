import type { HistoryResult } from "~/services/history-service";
import classNames from "classnames";

export function SearchResult({ content }: { content: HistoryResult }) {
    const { fromEmail, shreddedReason, subject, receiveAt, wasShredded } =
        content;
    return (
        <a href={`/history/${content.id}`} className={"hover:underline"}>
            <div
                className={classNames(
                    "shadow-sm flex flex-col gap-1 bg-card text-card-foreground p-2 rounded-md border hover:bg-primary",
                    {
                        "border-destructive/75": wasShredded,
                        ring: !wasShredded,
                    },
                )}
            >
                <p className={"font-semibold"}>From: {fromEmail}</p>
                <p className="overflow-auto">Subject: {subject}</p>
                {wasShredded && <p>Shredded Reason: {shreddedReason}</p>}
                <p>Received At: {receiveAt}</p>
            </div>
        </a>
    );
}
