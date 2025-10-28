import * as fs from "node:fs";

export class JsonFileStore<T> {
    constructor(private readonly filePath: string) {}

    public read(orElse: T): T {
        try {
            return JSON.parse(fs.readFileSync(this.filePath).toString()) as T || orElse
        } catch (e) {
            console.error('Issue reading JSON file store: ' + this.filePath);
            return orElse;
        }
    }

    public write(data: T): void {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2))
    }
}