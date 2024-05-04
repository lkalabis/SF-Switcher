export type User = {
    id: string | number;
    Id: string | number;
    FirstName: string;
    LastName: string;
    Username: string;
    Email: string;
    OrgId: string | number;
    Label: string;
    Shortcut?: string | null;
    IsActive: boolean;
    Profile: {
        Name: string;
    };
    UUID: string;
    Position?: number;
    ColorCode?: string;
    Group?: {
        Id: string | number;
        Label: string;
        Position: number;
        ColorCode: string;
    };
};
