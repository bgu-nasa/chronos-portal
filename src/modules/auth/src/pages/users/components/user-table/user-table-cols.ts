export const userTableCols = [
    "Profile",
    "First Name",
    "Last Name",
    "Email",
    "Verified",
];

export function toField(columnName: string): string {
    return columnName.toLowerCase().replace(" ", "");
}
