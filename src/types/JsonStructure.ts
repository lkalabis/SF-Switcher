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

    addUser(orgId: string, user: User, indexToAdd?: number) {
        if (this.orgIds[orgId]) {
            if (indexToAdd !== undefined) {
                this.orgIds[orgId].users.splice(indexToAdd, 0, user);
            } else {
                this.orgIds[orgId].users.push(user);
            }
        } else {
            console.error(`OrgId "${orgId}" not found.`);
        }
    }
}
