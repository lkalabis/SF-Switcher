import { OrgData } from "./OrgData";
import { User } from "./User";

export class JsonStructure {
    orgIds: { [key: string]: OrgData };

    constructor() {
        this.orgIds = {};
    }

    addOrgId(orgId: string, sessionId: string, url: string, lastModified: string) {
        this.orgIds[orgId] = {
            sessionId,
            url,
            lastModified,
            users: [],
            loginAsNext: "",
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
