import { OrgData } from "./OrgData";
import { SettingsType } from "./SettingsType";
import { User } from "./User";

export class JsonStructure {
    orgIds: { [key: string]: OrgData };
    settings: { [key: string]: SettingsType };

    constructor() {
        this.orgIds = {};
        this.settings = {};
    }

    addOrgId(orgId: string, sessionId: string, url: string, lastModified: string) {
        this.orgIds[orgId] = {
            sessionId,
            url,
            lastModified,
            users: [],
        };
    }

    addUser(orgId: string, user: User) {
        if (this.orgIds[orgId]) {
            this.orgIds[orgId].users.push(user);
        } else {
            console.error(`OrgId "${orgId}" not found.`);
        }
    }
}
