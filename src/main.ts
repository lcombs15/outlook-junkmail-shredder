import express from "express";
import { OutlookRestController } from "./controller/OutlookRestController";
import { HealthRestController } from "./controller/HealthRestController";
import { JunkmailShredderService } from "./services/JunkmailShredderService";
import { buildAppContext } from "./context/buildAppContext";
import { HistoryRestController } from "./controller/HistoryRestController";

const main = express();
const port = 3000;

const appContext = buildAppContext();
const service = new JunkmailShredderService(appContext);

[
    new OutlookRestController(service, appContext.dataSummaryService),
    new HealthRestController(
        appContext.emailPersistenceService,
        appContext.authService,
    ),
    new HistoryRestController(appContext.historyService),
].forEach((controller) => {
    const router = express.Router();
    controller.registerRoutes(router);
    main.use(controller.getRoute(), router);
});

main.listen(port, () =>
    console.log(`Api running on port http://localhost:${port}`),
);
