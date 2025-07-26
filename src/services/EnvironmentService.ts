import {EnvironmentVariableName} from "../entity/EnvironmentVariable";

export class EnvironmentService {

    public constructor(private sysEnv = process.env) {
    }

    public getValue(key: EnvironmentVariableName): string | null {
        return this.sysEnv[key.toString()] || null;
    }
}
