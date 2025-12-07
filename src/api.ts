import express from "express";
import { JunkmailShredderService } from "./services/JunkmailShredderService";
import { BaseRestController } from "./controller/BaseRestController";
import { SummaryRestController } from "./controller/SummaryRestController";

const api = express();
const port = 3000;

// Need a fresh instance of the service for each request because tokens can expire
// Could refactor this later to resolve this issue
function getService() {
    return new JunkmailShredderService();
}

const controllers: Array<BaseRestController> = [new SummaryRestController()];

controllers.forEach((controller) => {
    const router = express.Router();
    controller.registerRoutes(router);
    api.use(controller.getRoute(), router);
});

api.get("/onDemand", async (_, res) => {
    console.log("On demand run triggered");
    getService().sweepJunkEmails();
    return res
        .status(200)
        .send(`Junk email cleanup complete - ${new Date().toISOString()}`);
});

api.get("/deleteIgnoredMessages", async (_, res) => {
    console.log("Delete ignored messages triggered");
    await getService().deleteIgnoredMessages();
    return res
        .status(200)
        .send(`Ignored messages deleted - ${new Date().toISOString()}`);
});

api.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
