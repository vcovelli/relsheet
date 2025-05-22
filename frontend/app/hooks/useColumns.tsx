import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import EditableCell from "@/components/Grid/EditableCell";
import mockColumns from "@/data/mockColumns";
import { Row } from "@/types";

export function useColumns(
  editingCell: { rowIndex: number; colIndex: number } | null,
  onSave: (id: number, key: string, value: any) => void,
  clearEdit: () => void,
  setEditingCell: (cell: { rowIndex: number; colIndex: number }) => void
): ColumnDef<Row>[] {
  return useMemo(() => {
    const baseColumns: ColumnDef<Row>[] = [
      {
        accessorKey: "__rownum__",
        header: "#",
        enableResizing: false,
        cell: ({ row }) => row.index + 1,
        id: "__rownum__",
      },
    ];

    const editableColumns: ColumnDef<Row>[] = mockColumns.map((col) => ({
      accessorKey: col.accessorKey,
      header: col.header,
      id: col.accessorKey,
      size: 160,
      cell: ({ getValue, row, column }) => {
        const rowIndex = row.index;
        const colIndex =
          baseColumns.length +
          mockColumns.findIndex((c) => c.accessorKey === column.id);

        const originalCol = mockColumns.find((c) => c.accessorKey === column.id);

        if (!originalCol) {
          console.warn("Column definition not found for:", column.id);
          return null;
        }

        return (
          <EditableCell
            value={getValue()}
            row={row.original}
            column={originalCol}
            onSave={onSave}
            editing={
              editingCell?.rowIndex === rowIndex &&
              editingCell?.colIndex === colIndex
            }
            onStartEdit={() => setEditingCell({ rowIndex, colIndex })}
            onEditComplete={clearEdit}
          />
        );
      },
    }));

    return [...baseColumns, ...editableColumns];
  }, [editingCell, onSave, clearEdit, setEditingCell]);
}
