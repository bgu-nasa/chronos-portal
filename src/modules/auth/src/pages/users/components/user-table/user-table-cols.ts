export const userTableColumnNames = [
    "Profile",
    "First Name",
    "Last Name",
    "Email",
    "Verified",
];

export function toField(columnName: string): string {
    return columnName.toLowerCase().replace(" ", "");
}

export const userTableColumns = userTableColumnNames.map((columnName) => ({
    field: toField(columnName),
    colName: columnName,
}));
