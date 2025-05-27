import { useEffect } from "react";
import { CustomColumnDef, Row } from "@/types";

type Props = {
  showRenameModal: boolean;
  focusedCell: { rowIndex: number; colIndex: number } | null;
  setFocusedCell: (cell: { rowIndex: number; colIndex: number } | null) => void;
  editingCell: { rowIndex: number; colIndex: number } | null;
  setEditingCell: (cell: { rowIndex: number; colIndex: number } | null) => void;
  data: Row[];
  rawColumns: CustomColumnDef<Row>[];
  columnDefs: ReturnType<typeof import("@/hooks/useColumns").buildColumnDefs>;
};

export default function useKeyboardNavigation({
  showRenameModal,
  focusedCell,
  setFocusedCell,
  editingCell,
  setEditingCell,
  data,
  rawColumns,
  columnDefs,
}: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement as HTMLElement | null;

      // Block keyboard nav if:
      if (
        showRenameModal || // rename modal visible
        active?.tagName === "INPUT" || // typing in any input
        active?.tagName === "TEXTAREA" || // or textarea
        active?.isContentEditable || // or any editable element
        active?.closest(".rename-modal") || // inside rename modal
        active?.closest("[data-radix-popper-content-wrapper]") // or any popover
      ) {
        return;
      }

      if (!focusedCell) return;

      const { rowIndex, colIndex } = focusedCell;
      const maxRow = data.length - 1;
      const maxCol = columnDefs.length - 1;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          setFocusedCell({ rowIndex: Math.max(0, rowIndex - 1), colIndex });
          break;

        case "ArrowDown":
          e.preventDefault();
          setFocusedCell({ rowIndex: Math.min(maxRow, rowIndex + 1), colIndex });
          break;

        case "ArrowLeft":
          e.preventDefault();
          setFocusedCell({ rowIndex, colIndex: Math.max(0, colIndex - 1) });
          break;

        case "ArrowRight":
          e.preventDefault();
          setFocusedCell({ rowIndex, colIndex: Math.min(maxCol, colIndex + 1) });
          break;

        case "Enter": {
          e.preventDefault();
          const columnType = rawColumns[colIndex - 1]?.type;

          if (columnType === "choice" || columnType === "reference") {
            if (
              editingCell?.rowIndex === rowIndex &&
              editingCell?.colIndex === colIndex
            ) {
              const input = document.querySelector("[data-autofocus-select]") as HTMLElement;
              input?.focus();
              input?.click();
            } else {
              setEditingCell({ rowIndex, colIndex });
            }
          } else {
            setEditingCell({ rowIndex, colIndex });
          }
          break;
        }

        case "Escape":
          e.preventDefault();
          setFocusedCell(null);
          setEditingCell(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showRenameModal,
    focusedCell,
    editingCell,
    columnDefs.length,
    data.length,
    rawColumns,
    setFocusedCell,
    setEditingCell,
  ]);
}
