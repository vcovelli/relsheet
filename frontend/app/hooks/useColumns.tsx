import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "@/components/Grid/EditableCell";
import { Row, CustomColumnDef } from "@/types";

export function buildColumnDefs(
  editingCell: { rowIndex: number; colIndex: number } | null,
  onSave: (id: string, key: string, value: any) => void,
  clearEdit: () => void,
  setEditingCell: (cell: { rowIndex: number; colIndex: number }) => void,
  schema: CustomColumnDef<Row>[]
): ColumnDef<Row>[] {
  const baseColumns: ColumnDef<Row>[] = [
    {
      accessorKey: "__rownum__",
      header: "#",
      enableResizing: false,
      cell: ({ row }) => row.index + 1,
      id: "__rownum__",
    },
  ];

  const editableColumns: ColumnDef<Row>[] = schema.map((col, colIndex) => ({
    accessorKey: col.accessorKey,
    header: col.header,
    id: col.accessorKey,
    size: 160,
    cell: ({ getValue, row }) => {
      const rowIndex = row.index;
      const actualColIndex = baseColumns.length + colIndex;

      return (
        <EditableCell
          value={getValue()}
          row={row.original}
          rowId={row.original.__rowId}
          column={col}
          onSave={onSave}
          editing={
            editingCell?.rowIndex === rowIndex &&
            editingCell?.colIndex === actualColIndex
          }
          onStartEdit={() => setEditingCell({ rowIndex, colIndex: actualColIndex })}
          onEditComplete={clearEdit}
        />
      );
    },
  }));

  return [...baseColumns, ...editableColumns];
}
