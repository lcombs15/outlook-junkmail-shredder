import { DatabaseService } from "./services/DatabaseService";

function main() {
    const db = new DatabaseService();

    db.example().then(() => process.exit(0));
}

main();
