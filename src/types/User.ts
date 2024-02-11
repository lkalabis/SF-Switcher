export type User = {
    Id: string | number;
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    OrgId: string | number;
    Label: string;
    Shortcut: string | null;
    IsActive: boolean;
    Profile: {
        Name: string;
    };
    UUID: string;
};
