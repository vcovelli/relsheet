import React, { useState } from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { CustomColumnDef, Row } from "@/types";
import { PlusIcon } from "lucide-react";

interface Props {
  table: Table<Row>;
  rawColumns: CustomColumnDef<Row>[];
  containerRef: React.RefObject<HTMLDivElement>;
  setRenamePosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  setColumnBeingRenamed: React.Dispatch<React.SetStateAction<{ index: number; name: string } | null>>;
  setShowRenameModal: React.Dispatch<React.SetStateAction<boolean>>;
  focusedColIndex: number | null;
  onFocusColumn: (col: CustomColumnDef<Row>, index: number) => void;
}

const GridTableHeader: React.FC<Props> = ({
  table,
  rawColumns,
  containerRef,
  setRenamePosition,
  setColumnBeingRenamed,
  setShowRenameModal,
  focusedColIndex,
  onFocusColumn,
}) => {
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  const headerGroups = table?.getHeaderGroups?.();
  if (!headerGroups) return null;

  const handleAddColumn = (type: string) => {
    console.log("Add column of type:", type);
    setShowAddDropdown(false);
  };

  return (
    <div className="overflow-x-auto w-full relative">
      {headerGroups.map((headerGroup) => (
        <div
          key={headerGroup.id}
          className="grid bg-gray-100 font-semibold text-xs text-gray-600 border-b w-full"
          style={{
            gridTemplateColumns: `${headerGroup.headers.map((h) => `${h.getSize() || 120}px`).join(" ")} 40px`,
          }}
        >
          {headerGroup.headers.map((header, index) => (
            <div
              key={header.id}
              className={`border-r whitespace-nowrap px-3 py-2 cursor-pointer rounded-sm transition-all duration-150 ${
                focusedColIndex === index
                  ? "bg-gray-300 shadow"
                  : "hover:bg-gray-200 hover:shadow"
              }`}
              onClick={() => {
                const col = rawColumns[index - 1];
                if (!col) return;
                onFocusColumn(col, index);
              }}
              onDoubleClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const col = rawColumns[index - 1];
                if (!col || !containerRef.current) return;

                const headerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                const containerRect = containerRef.current.getBoundingClientRect();
                const relativeX = headerRect.left - containerRect.left;
                const relativeY = headerRect.bottom - containerRect.top + 4;

                setRenamePosition({ x: relativeX, y: relativeY });
                setColumnBeingRenamed({ index, name: String(col.header || "") });
                setShowRenameModal(true);
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}

          <div
            className="border-r flex items-center justify-center cursor-pointer hover:bg-gray-200"
            onClick={() => setShowAddDropdown((prev) => !prev)}
          >
            <PlusIcon className="w-4 h-4 text-gray-600" />
          </div>

          {showAddDropdown && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border shadow rounded text-sm z-50">
              <div className="p-2">
                <p className="font-semibold mb-2">Add Column</p>
                {["text", "number", "formula"].map((type) => (
                  <button
                    key={type}
                    className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded"
                    onClick={() => handleAddColumn(type)}
                  >
                    Add {type.charAt(0).toUpperCase() + type.slice(1)} Column
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default GridTableHeader;
