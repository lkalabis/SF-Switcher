import { User } from "./User";

export interface OrgData {
    sessionId: string;
    url: string;
    lastModified: string;
    users: User[];
    loginAsNext: string;
}
