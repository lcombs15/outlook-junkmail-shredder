import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";

export class SummaryRestController extends BaseRestController {
    protected rootRoute = "/summary";

    registerRoutes(router: Router): void {
        router.get("/", this.getSummary);
        router.get("/ignored", this.queryReport("ignored"));
        router.get("/deleted", this.queryReport("deleted"));
        router.post("/reconcile", this.reconcile);
    }

    getSummary: RequestHandler = async (_, res) => {
        return res.status(200).send(this.service.getReport());
    };

    queryReport: (reportType: "ignored" | "deleted") => RequestHandler =
        (reportType) => async (req, res) => {
            const service = this.service;
            const minTotal = req.query.minTotal as string;
            return res
                .status(200)
                .send(
                    service.searchReport(
                        service.getReport()[reportType],
                        minTotal ? Number.parseInt(minTotal) : undefined,
                        req.query.searchTerm as string,
                    ),
                );
        };

    reconcile: RequestHandler = async (_, res) => {
        console.log("Report reconciliation triggered");
        this.service.reconcileReport();
        return res
            .status(204)
            .send(`Completed reconciliation - ${new Date().toISOString()}`);
    };
}
