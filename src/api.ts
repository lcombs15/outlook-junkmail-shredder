import express from "express";
import { OutlookRestController } from "./controller/OutlookRestController";
import { HealthRestController } from "./controller/HealthRestController";
import { JunkmailShredderService } from "./services/JunkmailShredderService";
import { buildAppContext } from "./context/buildAppContext";
import { HistoryRestController } from "./controller/HistoryRestController";

const api = express();
const port = 3000;

const appContext = buildAppContext();
const service = new JunkmailShredderService(appContext);

[
    new OutlookRestController(service),
    new HealthRestController(service),
    new HistoryRestController(appContext.historyService),
].forEach((controller) => {
    const router = express.Router();
    controller.registerRoutes(router);
    api.use(controller.getRoute(), router);
});

api.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
