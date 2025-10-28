import {EnvironmentVariableName} from "../entity/EnvironmentVariable";
import * as fs from "node:fs";

export class EnvironmentService {

    public constructor(private sysEnv = process.env) {
    }

    public getValue(key: EnvironmentVariableName): string | null {
        const value = this.sysEnv[key.toString()];

        if (!value) {
            console.error('Missing environment variable: ', key.toString());
        }

        return value || null;
    }

    public getRequiredValue(key: EnvironmentVariableName): string {
        const val = this.getValue(key);

        if (val == null) {
            throw new Error(`Missing environment variable: ${key.toString()}`)
        }

        return val;
    }

    public getValueFromFile(key: EnvironmentVariableName): string | null {
        const fileName = this.getValue(key);

        if (!fileName) {
            return null;
        }

        return fs.readFileSync(fileName).toString()
    }
}
