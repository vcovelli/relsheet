"use client";

import React, { useEffect, useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { motion, AnimatePresence } from "framer-motion";
import { useColumns } from "@/hooks/useColumns";
import mockRows from "@/data/mockRows";
import { Row } from "@/types";
import ContextMenu from "@/components/UI/ContextMenu";
import RenameColumnModal from "@/components/UI/RenameColumnModal";

const GridTable: React.FC = () => {
  const [data, setData] = useState<Row[]>([]);
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextTarget, setContextTarget] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renamePosition, setRenamePosition] = useState({ x: 0, y: 0 });
  const [columnBeingRenamed, setColumnBeingRenamed] = useState<{ index: number; name: string } | null>(null);

  const handleSave = (id: number, key: string, value: any) => {
    setData((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      )
    );
  };

  const columnDefs = useColumns(
    editingCell,
    handleSave,
    () => setEditingCell(null),
    setEditingCell
  );

  useEffect(() => {
    setData(mockRows);
  }, []);

  const handleContextMenu = (
    e: React.MouseEvent,
    rowIndex: number,
    colIndex: number
  ) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setContextTarget({ rowIndex, colIndex });
    setShowContextMenu(true);
  };

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!focusedCell) return;

      const { rowIndex, colIndex } = focusedCell;
      const maxRow = data.length - 1;
      const maxCol = columnDefs.length - 1;

      switch (e.key) {
        case "ArrowUp":
          setFocusedCell({ rowIndex: Math.max(0, rowIndex - 1), colIndex });
          break;
        case "ArrowDown":
          setFocusedCell({ rowIndex: Math.min(maxRow, rowIndex + 1), colIndex });
          break;
        case "ArrowLeft":
          setFocusedCell({ rowIndex, colIndex: Math.max(0, colIndex - 1) });
          break;
        case "ArrowRight":
          setFocusedCell({ rowIndex, colIndex: Math.min(maxCol, colIndex + 1) });
          break;
        case "Enter":
          e.preventDefault();
          setEditingCell({ rowIndex, colIndex });
          break;
        case "Escape":
          setFocusedCell(null);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedCell, columnDefs.length, data.length]);

  return (
    <div className="relative w-full min-h-screen border bg-white rounded shadow p-4 overflow-x-auto">
      {/* Header */}
      {table.getHeaderGroups().map((headerGroup) => (
        <div
          key={headerGroup.id}
          className="grid bg-gray-100 font-semibold text-xs text-gray-600 border-b"
          style={{
            gridTemplateColumns: headerGroup.headers
              .map((h) => `${h.getSize()}px`)
              .join(" "),
          }}
        >
          {headerGroup.headers.map((header) => (
            <div
              key={header.id}
              className="border-r whitespace-nowrap px-3 py-2"
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>
      ))}

      {/* Rows */}
      <AnimatePresence initial={false}>
        {table.getRowModel().rows.map((row, rowIndex) => (
          <motion.div
            key={row.id}
            layout
            className="grid hover:bg-blue-50"
            style={{
              gridTemplateColumns: row.getVisibleCells()
                .map((cell) => `${cell.column.getSize()}px`)
                .join(" "),
            }}
          >
            {row.getVisibleCells().map((cell, colIndex) => {
              const isFocused =
                focusedCell?.rowIndex === rowIndex &&
                focusedCell?.colIndex === colIndex;

              const isEditable = cell.column.id !== "__rownum__";

              return (
                <div
                  key={cell.id}
                  className={`relative border-b border-r text-sm overflow-visible ${
                    isFocused ? "bg-yellow-100 ring-2 ring-yellow-400" : ""
                  }`}
                  onClick={() => setFocusedCell({ rowIndex, colIndex })}
                  onDoubleClick={() => {
                    console.log("🧲 double clicked from GridTable wrapper");
                    setEditingCell({ rowIndex, colIndex });
                  }}
                  onContextMenu={(e) => handleContextMenu(e, rowIndex, colIndex)}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Context Menu */}
      {showContextMenu && contextTarget && (
        <ContextMenu
          position={contextMenuPosition}
          rowIndex={contextTarget.rowIndex}
          colIndex={contextTarget.colIndex}
          onInsertAbove={() => {
            const { rowIndex } = contextTarget;
            const newRow = { ...data[rowIndex], id: Date.now() };
            setData([...data.slice(0, rowIndex), newRow, ...data.slice(rowIndex)]);
            setShowContextMenu(false);
          }}
          onInsertBelow={() => {
            const { rowIndex } = contextTarget;
            const newRow = { ...data[rowIndex], id: Date.now() };
            setData([...data.slice(0, rowIndex + 1), newRow, ...data.slice(rowIndex + 1)]);
            setShowContextMenu(false);
          }}
          onDuplicateRow={() => {
            const { rowIndex } = contextTarget;
            const newRow = { ...data[rowIndex], id: Date.now() };
            setData([...data.slice(0, rowIndex + 1), newRow, ...data.slice(rowIndex + 1)]);
            setShowContextMenu(false);
          }}
          onDeleteRow={() => {
            const { rowIndex } = contextTarget;
            setData(data.filter((_, i) => i !== rowIndex));
            setShowContextMenu(false);
          }}
          onInsertColLeft={() => console.log("Insert Col Left")}
          onInsertColRight={() => console.log("Insert Col Right")}
          onDeleteCol={() => console.log("Delete Col")}
          onRenameColumn={() => {
            if (!contextTarget) return;
            const { colIndex } = contextTarget;
            const col = columnDefs[colIndex];
            setRenamePosition(contextMenuPosition);
            setColumnBeingRenamed({ index: colIndex, name: col.header as string });
            setShowRenameModal(true);
            setShowContextMenu(false);
          }}
          onHideColumn={() => console.log("Hide Column")}
          onSortAsc={() => console.log("Sort Asc")}
          onSortDesc={() => console.log("Sort Desc")}
          onFilterColumn={() => console.log("Filter Column")}
          onClose={() => setShowContextMenu(false)}
        />
      )}

      {/* Rename Column Modal */}
      {showRenameModal && columnBeingRenamed && (
        <RenameColumnModal
          position={renamePosition}
          initialName={columnBeingRenamed.name}
          onClose={() => setShowRenameModal(false)}
          onRename={(newName) => {
            columnDefs[columnBeingRenamed.index].header = newName;
            setShowRenameModal(false);
          }}
        />
      )}
    </div>
  );
};

export default GridTable;
