import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { userTableColumns } from "./user-table-cols";

export function UserTable() {
    return (
        <DataTable>
            {userTableColumns.map(({ field, colName }) => (
                <Column key={field} field={field} header={colName} />
            ))}
        </DataTable>
    );
}
