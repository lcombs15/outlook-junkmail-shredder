import { JunkmailShredderService } from "./services/JunkmailShredderService";
import { buildAppContext } from "./context/buildAppContext";

new JunkmailShredderService(buildAppContext()).sweepJunkEmails();
