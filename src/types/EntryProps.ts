import { OrgInfo } from "./OrgInfo";
import { User } from "./User";

export type EntryFormProps = {
    username: string;
    label: string;
    record: User;
    isNewEntry: boolean;
    onSaveNew: (entry: User) => void;
    onSaveExisting: (newRecord: User) => void;
    onCancelAdd: () => void;
    onCancelEdit: () => void;
    currentOrg: OrgInfo;
};
