import { BaseRestController } from "./BaseRestController";
import { RequestHandler, Router } from "express";
import { JunkmailShredderService } from "../services/JunkmailShredderService";

export class OutlookRestController extends BaseRestController {
    protected rootRoute: string = "/outlook";

    constructor(private service: JunkmailShredderService) {
        super();
    }

    registerRoutes(router: Router): void {
        router.post("/sweepJunkmail", this.sweepJunkEmails);
        router.post("/clearIgnoredEmails", this.clearIgnoredEmails);
    }

    sweepJunkEmails: RequestHandler = async (_, res) => {
        console.log("On demand run triggered");
        this.service.sweepJunkEmails();
        return res
            .status(200)
            .send(`Junk email cleanup complete - ${new Date().toISOString()}`);
    };

    clearIgnoredEmails: RequestHandler = async (_, res) => {
        console.log("Delete ignored messages triggered");
        await this.service.deleteIgnoredMessages();
        return res
            .status(200)
            .send(`Ignored messages deleted - ${new Date().toISOString()}`);
    };
}
