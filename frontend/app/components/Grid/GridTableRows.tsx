import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { flexRender, Table } from "@tanstack/react-table";
import { Row } from "@/types";

interface Props {
  table: Table<Row>;
  focusedCell: { rowIndex: number; colIndex: number } | null;
  editingCell: { rowIndex: number; colIndex: number } | null;
  handleCellClick: (rowIndex: number, colIndex: number, isEditable: boolean) => void;
  handleContextMenu: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void;
  zebraStriping: boolean;
  focusedColIndex: number | null;
}

const GridTableRows: React.FC<Props> = ({
  table,
  focusedCell,
  editingCell,
  handleCellClick,
  handleContextMenu,
  zebraStriping,
  focusedColIndex,
}) => {
  const rows = table?.getRowModel?.().rows;

  if (!rows) return null; // avoid runtime crash

  return (
    <AnimatePresence initial={false}>
      {rows.map((row, rowIndex) => (
        <motion.div
          key={row.original.__rowId}
          layout
          className={`grid hover:bg-blue-50 ${
            zebraStriping && rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"
          }`}
          style={{
            gridTemplateColumns: row.getVisibleCells().map((cell) => `${cell.column.getSize()}px`).join(" "),
          }}
        >
          {row.getVisibleCells().map((cell, colIndex) => {
            const isFocused = focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === colIndex;
            const isEditable = cell.column.id !== "__rownum__";
            return (
              <div
                key={cell.id}
                className={`relative border-b border-r text-sm overflow-visible px-2 py-1 ${
                  isFocused ? "bg-yellow-100 ring-2 ring-yellow-400" : ""
                }`}
                onClick={() => handleCellClick(rowIndex, colIndex, isEditable)}
                onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          })}
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default GridTableRows;
