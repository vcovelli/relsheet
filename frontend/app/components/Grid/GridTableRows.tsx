import React from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { Row } from "@/types";

interface Props {
  table: Table<Row>;
  focusedCell: { rowIndex: number; colIndex: number } | null;
  editingCell: { rowIndex: number; colIndex: number } | null;
  handleCellClick: (rowIndex: number, colIndex: number, isEditable: boolean) => void;
  handleContextMenu: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void;
  zebraStriping: boolean;
  focusedColIndex: number | null;
  focusedRowIndex?: number | null;
  setFocusedRowIndex?: (index: number | null) => void;
  setFocusedColIndex?: (index: number | null) => void;
  columnHighlightMode?: boolean;
}

const getRowNumberColumnWidth = (rowCount: number) => {
  const digits = String(rowCount).length;
  return digits * 8 + 32;
};

const GridTableRows: React.FC<Props> = ({
  table,
  focusedCell,
  editingCell,
  handleCellClick,
  handleContextMenu,
  zebraStriping,
  focusedColIndex,
  focusedRowIndex,
  setFocusedRowIndex,
  setFocusedColIndex,
  columnHighlightMode = false,
}) => {
  const rows = table.getRowModel().rows;
  const rowNumberWidth = getRowNumberColumnWidth(rows.length);

  if (!rows) return null;

  return (
    <AnimatePresence initial={false}>
      {rows.map((row, rowIndex) => {
        const isRowFocused = focusedRowIndex === rowIndex;
        const isZebra = zebraStriping && rowIndex % 2 === 1;

        return (
          <motion.div
            key={row.id}
            layout
            className={`grid border-b transition-colors duration-150 ${
              isRowFocused ? "bg-green-100" : isZebra ? "bg-gray-50" : "bg-white"
            }`}
            style={{
              gridTemplateColumns: `${rowNumberWidth}px ${row
                .getVisibleCells()
                .map((cell) => `${cell.column.getSize()}px`)
                .join(" ")}`,
            }}
          >
            <div
              className={`sticky left-0 z-20 bg-white border-r text-center text-xs font-mono text-gray-500 px-2 py-1 select-none cursor-pointer ${
                isRowFocused ? "bg-green-200 font-bold text-black" : ""
              }`}
              onClick={() => {
                setFocusedRowIndex?.(rowIndex);
                setFocusedColIndex?.(null);
              }}
              onContextMenu={(e) => handleContextMenu(e, rowIndex, 0)}
            >
              {rowIndex + 1}
            </div>

            {row.getVisibleCells().map((cell, colIndex) => {
              const adjustedColIndex = colIndex;
              const isFocused =
                focusedCell?.rowIndex === rowIndex && focusedCell?.colIndex === adjustedColIndex;
              const isEditable = cell.column.id !== "__rownum__";
              const isColFocused = columnHighlightMode && focusedColIndex === adjustedColIndex;

              return (
                <div
                  key={cell.id}
                  className={`relative border-r text-sm px-2 py-1 overflow-visible transition-colors duration-100 ${
                    isFocused
                      ? "bg-yellow-100 ring-2 ring-yellow-400 z-10"
                      : isColFocused
                      ? "bg-blue-100"
                      : ""
                  }`}
                  onClick={() => handleCellClick(rowIndex, adjustedColIndex, isEditable)}
                  onContextMenu={(e) => handleContextMenu(e, rowIndex, adjustedColIndex)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              );
            })}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
};

export default GridTableRows;
