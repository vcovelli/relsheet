"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { buildColumnDefs } from "@/hooks/useColumns";
import mockRows from "@/data/mockRows";
import mockColumns from "@/data/mockColumns";
import { Row, CustomColumnDef } from "@types";
import ContextMenu from "@components/UI/ContextMenu";
import GridTableHeader from "./GridTableHeader";
import GridTableRows from "./GridTableRows";
import useKeyboardNavigation from "./useKeyboardNavigation";
import useContextMenu from "./useContextMenu";
import RenameModal from "@/components/UI/RenameColumnModal";

const GridTable: React.FC<{
  onOpenSettingsPanel: (col: CustomColumnDef<any>) => void;
}> = ({ onOpenSettingsPanel }) => {
  const [data, setData] = useState<Row[]>([]);
  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [rawColumns, setRawColumns] = useState<CustomColumnDef<Row>[]>(mockColumns);
  const [zebraStriping, setZebraStriping] = useState(true);
  const [focusedColIndex, setFocusedColIndex] = useState<number | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ index: number; name: string } | null>(null);
  const [renamePosition, setRenamePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRenameModal, setShowRenameModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const {
    scrollContainerRef,
    showContextMenu,
    contextMenuPosition,
    contextTarget,
    handleContextMenu,
    handleContextAction,
    setShowContextMenu,
    setContextTarget,
  } = useContextMenu({
    data,
    setData,
    rawColumns,
    setRawColumns,
    setRenameTarget,
    setRenamePosition,
    setShowRenameModal,
    containerRef,
  });

  useEffect(() => setData(mockRows), []);

  const handleSave = (id: string, key: string, value: any) => {
    setData((prev) =>
      prev.map((row) => (row.__rowId === id && key !== "id" ? { ...row, [key]: value } : row))
    );
  };

  const handleEditComplete = () => setEditingCell(null);

  const columnDefs = useMemo(() => {
    return buildColumnDefs(editingCell, handleSave, handleEditComplete, setEditingCell, rawColumns);
  }, [editingCell, rawColumns]);

  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  useKeyboardNavigation({
    showRenameModal,
    focusedCell,
    columnDefs,
    data,
    rawColumns,
    editingCell,
    setFocusedCell,
    setEditingCell,
  });

  const handleRename = (newName: string) => {
    if (renameTarget && newName.trim()) {
      setRawColumns((prev) =>
        prev.map((col, i) =>
          i === renameTarget.index - 1 ? { ...col, header: newName.trim() } : col
        )
      );
    }
    setShowRenameModal(false);
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="relative h-[calc(100vh-3rem)] w-full overflow-x-auto bg-white rounded-xl shadow border px-4 pt-4 pb-4"
      >
        <div className="mb-2 flex justify-end">
          <button
            className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
            onClick={() => setZebraStriping((prev) => !prev)}
          >
            Toggle Zebra Striping
          </button>
        </div>

        <GridTableHeader
          table={table}
          rawColumns={rawColumns}
          containerRef={scrollContainerRef}
          setRenamePosition={setRenamePosition}
          setColumnBeingRenamed={setRenameTarget}
          setShowRenameModal={setShowRenameModal}
          focusedColIndex={focusedColIndex}
          onFocusColumn={(col, index) => {
            if (showRenameModal) return;
            setFocusedColIndex(index);
            onOpenSettingsPanel(col);
          }}
        />

        <GridTableRows
          table={table}
          focusedCell={focusedCell}
          editingCell={editingCell}
          handleCellClick={(rowIndex, colIndex, isEditable) => {
            if (
              editingCell &&
              editingCell.rowIndex === rowIndex &&
              editingCell.colIndex === colIndex
            )
              return;
            setFocusedCell({ rowIndex, colIndex });
            if (isEditable) setEditingCell({ rowIndex, colIndex });
          }}
          handleContextMenu={handleContextMenu}
          zebraStriping={zebraStriping}
          focusedColIndex={focusedColIndex}
        />

        {showRenameModal && renameTarget && (
          <RenameModal
            position={renamePosition}
            initialName={renameTarget.name}
            onClose={() => setShowRenameModal(false)}
            onRename={handleRename}
          />
        )}

        {showContextMenu && contextTarget && (
          <ContextMenu
            position={contextMenuPosition}
            rowIndex={contextTarget.rowIndex}
            colIndex={contextTarget.colIndex}
            onInsertAbove={() => handleContextAction("insertAbove")}
            onInsertBelow={() => handleContextAction("insertBelow")}
            onDuplicateRow={() => handleContextAction("duplicateRow")}
            onDeleteRow={() => handleContextAction("deleteRow")}
            onInsertColLeft={() => handleContextAction("insertColLeft")}
            onInsertColRight={() => handleContextAction("insertColRight")}
            onDeleteCol={() => handleContextAction("deleteCol")}
            onRenameColumn={() => handleContextAction("renameColumn")}
            onHideColumn={() => {}}
            onSortAsc={() => {}}
            onSortDesc={() => {}}
            onFilterColumn={() => {}}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GridTable;
