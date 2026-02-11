import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";
import { DataSummaryService } from "../services/DataSummaryService";

export class OutlookRestController extends BaseRestController {
    protected rootRoute: string = "/outlook";

    constructor(
        private junkmailShredderService: JunkmailShredderService,
        private dataSummaryService: DataSummaryService,
    ) {
        super();
    }

    registerRoutes(router: Router): void {
        router.post("/sweepJunkmail", this.sweepJunkEmails);
        router.post("/clearIgnoredEmails", this.clearIgnoredEmails);
        router.post("/reconcile", this.reconcileData);
    }

    sweepJunkEmails: RequestHandler = async (_, res) => {
        console.log("On demand run triggered");
        this.junkmailShredderService.sweepJunkEmails();
        return res
            .status(200)
            .send(`Junk email cleanup complete - ${new Date().toISOString()}`);
    };

    clearIgnoredEmails: RequestHandler = async (_, res) => {
        console.log("Delete ignored messages triggered");
        await this.junkmailShredderService.deleteIgnoredMessages();
        return res
            .status(200)
            .send(`Ignored messages deleted - ${new Date().toISOString()}`);
    };

    reconcileData: RequestHandler = async (_, res) => {
        await this.dataSummaryService.reconcile();

        return res
            .status(200)
            .send(`Data reconciled - ${new Date().toISOString()}`);
    };
}
