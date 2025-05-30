"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { buildColumnDefs } from "@/hooks/useColumns";
import { Row, CustomColumnDef } from "@/types";
import ContextMenu from "@components/UI/ContextMenu";
import GridTableHeader from "./GridTableHeader";
import GridTableRows from "./GridTableRows";
import useKeyboardNavigation from "./useKeyboardNavigation";
import useContextMenu from "./useContextMenu";
import RenameModal from "@/components/UI/RenameColumnModal";

interface GridTableProps {
  tableName: string;
  columns: CustomColumnDef<Row>[]; // Stronger typing
  data: Row[];
  onOpenSettingsPanel: (col: CustomColumnDef<Row>) => void;
  isSettingsPanelOpen: boolean;
  onUpdateTable: (name: string, updated: { columns: CustomColumnDef<Row>[]; data: Row[] }) => void;
}

const GridTable: React.FC<GridTableProps> = ({
  tableName,
  columns,
  data,
  onOpenSettingsPanel,
  isSettingsPanelOpen,
  onUpdateTable,
}) => {
  const [dataState, setDataState] = useState<Row[]>(data);
  const [rawColumns, setRawColumns] = useState<CustomColumnDef<Row>[]>(
    () => columns.filter((col) => col.accessorKey !== "__rowId")
  );

  const [focusedCell, setFocusedCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; colIndex: number } | null>(null);
  const [zebraStriping, setZebraStriping] = useState(true);
  const [focusedColIndex, setFocusedColIndex] = useState<number | null>(null);
  const [focusedColumn, setFocusedColumn] = useState<CustomColumnDef<Row> | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ index: number; name: string } | null>(null);
  const [renamePosition, setRenamePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState<number | null>(null);
  const [columnHighlightMode, setColumnHighlightMode] = useState(false);

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
    data: dataState,
    setData: (newData) => {
      setDataState(newData);
      onUpdateTable(tableName, { columns: rawColumns, data: newData });
    },
    rawColumns,
    setRawColumns: (newCols) => {
      setRawColumns(newCols);
      onUpdateTable(tableName, { columns: newCols, data: dataState });
    },
    setRenameTarget,
    setRenamePosition,
    setShowRenameModal,
    containerRef,
  });

  useEffect(() => {
    setDataState(data);
  }, [data]);

  useEffect(() => {
    setRawColumns(columns.filter((col) => col.accessorKey !== "__rowId"));
  }, [columns]);

  const handleSave = useCallback((id: string, key: string, value: any) => {
    setDataState((prev) => {
      const updated = prev.map((row) =>
        row.__rowId === id && key !== "id" ? { ...row, [key]: value } : row
      );
      onUpdateTable(tableName, { columns: rawColumns, data: updated });
      return updated;
    });
  }, [onUpdateTable, tableName, rawColumns]);

  const handleEditComplete = useCallback(() => setEditingCell(null), []);

  const columnDefs = useMemo(() => {
    return buildColumnDefs(editingCell, handleSave, handleEditComplete, setEditingCell, rawColumns);
  }, [editingCell, handleSave, handleEditComplete, rawColumns]);

  const table = useReactTable({
    data: dataState,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
  });

  useKeyboardNavigation({
    showRenameModal,
    focusedCell,
    columnDefs,
    data: dataState,
    rawColumns,
    editingCell,
    setFocusedCell,
    setEditingCell,
  });

  const handleRename = useCallback((newName: string) => {
    if (renameTarget && newName.trim()) {
      const updatedCols = rawColumns.map((col, i) =>
        i === renameTarget.index - 1 ? { ...col, header: newName.trim() } : col
      );
      setRawColumns(updatedCols);
      onUpdateTable(tableName, { columns: updatedCols, data: dataState });
    }
    setShowRenameModal(false);
  }, [renameTarget, rawColumns, dataState, tableName, onUpdateTable]);

  useEffect(() => {
    if (isSettingsPanelOpen && focusedColumn && !showRenameModal) {
      onOpenSettingsPanel(focusedColumn);
    }
  }, [focusedColumn?.accessorKey, isSettingsPanelOpen, showRenameModal]);

  const handleToggleZebra = useCallback(() => {
    setZebraStriping((prev) => !prev);
  }, []);

  const handleCellClick = useCallback((rowIndex: number, colIndex: number, isEditable: boolean) => {
    setColumnHighlightMode(false);
    setFocusedRowIndex(null);

    if (editingCell?.rowIndex === rowIndex && editingCell.colIndex === colIndex) return;

    setFocusedCell({ rowIndex, colIndex });
    setFocusedColIndex(colIndex);

    const matchedRawCol = rawColumns[colIndex];
    if (matchedRawCol) {
      setFocusedColumn(matchedRawCol);
    }

    if (isEditable) setEditingCell({ rowIndex, colIndex });
  }, [editingCell, rawColumns]);

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="relative h-[calc(100vh-3rem)] w-full overflow-auto bg-white rounded-xl shadow border px-4 pt-4 pb-4"
      >
        <div className="mb-2 flex justify-end">
          <button
            className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-50"
            onClick={handleToggleZebra}
          >
            Toggle Zebra Striping
          </button>
        </div>

        <div className="min-w-max">
          <GridTableHeader
            table={table}
            rawColumns={rawColumns}
            containerRef={scrollContainerRef}
            setRenamePosition={setRenamePosition}
            setColumnBeingRenamed={setRenameTarget}
            setShowRenameModal={setShowRenameModal}
            handleContextMenu={handleContextMenu}
            setRawColumns={(cols) => {
              setRawColumns(cols);
              onUpdateTable(tableName, { columns: cols, data: dataState });
            }}
            setData={(rows) => {
              setDataState(rows);
              onUpdateTable(tableName, { columns: rawColumns, data: rows });
            }}
            focusedColIndex={focusedColIndex}
            setFocusedRowIndex={setFocusedRowIndex}
            onFocusColumn={useCallback((col, index) => {
              if (showRenameModal) return;
              setFocusedColIndex(index);
              setFocusedColumn(col);
              setColumnHighlightMode(true);
            }, [showRenameModal])}
            onOpenSettingsPanel={onOpenSettingsPanel}
          />

          <GridTableRows
            table={table}
            listHeight={scrollContainerRef.current?.clientHeight || 0}
            focusedCell={focusedCell}
            editingCell={editingCell}
            handleCellClick={handleCellClick}
            handleContextMenu={handleContextMenu}
            zebraStriping={zebraStriping}
            focusedColIndex={focusedColIndex}
            focusedRowIndex={focusedRowIndex}
            setFocusedRowIndex={setFocusedRowIndex}
            setFocusedColIndex={setFocusedColIndex}
            columnHighlightMode={columnHighlightMode}
          />
        </div>

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
