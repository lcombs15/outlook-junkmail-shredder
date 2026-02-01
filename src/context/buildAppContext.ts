import { EnvironmentService } from "../services/EnvironmentService";
import { DiscordService } from "../services/discord/DiscordService";
import { DiscordEmailNotificationService } from "../services/discord/DiscordEmailNotificationService";
import { AuthenticationService } from "../services/AuthenticationService";
import { DataSummaryService } from "../services/DataSummaryService";
import { EmailPersistenceService } from "../services/db/EmailPersistenceService";
import { DatabaseService } from "../services/db/DatabaseService";
import { HistoryService } from "../services/HistoryService";
import { HistoryResourceMapper } from "../mapper/HistoryResourceMapper";

export interface AppContext {
    discordService: DiscordService;
    discordEmailService: DiscordEmailNotificationService;
    authService: AuthenticationService;
    dataSummaryService: DataSummaryService;
    historyService: HistoryService;
}

/*
    Built today so I can regret this tomorrow. I feel like I've heard every developer I know curse the name of whoever wrote "HugeContext.blah". Well. I suppose I'm in the club now.

    In all seriousness, TypeScript just doesn't have a good dependency injection tool. So, this is my workaround for now/forever.
 */
export function buildAppContext(
    environmentService = new EnvironmentService(),
): AppContext {
    const discordService = new DiscordService(environmentService, fetch);
    const discordEmailService = new DiscordEmailNotificationService(
        discordService,
    );
    const authService = new AuthenticationService(
        discordService,
        environmentService,
    );

    const databaseService = new DatabaseService(environmentService);
    const emailPersistenceService = new EmailPersistenceService(
        databaseService,
    );

    const dataSummaryService = new DataSummaryService(emailPersistenceService);

    const historyService = new HistoryService(
        emailPersistenceService,
        new HistoryResourceMapper(),
    );

    return {
        discordService,
        discordEmailService,
        authService,
        dataSummaryService,
        historyService,
    };
}
