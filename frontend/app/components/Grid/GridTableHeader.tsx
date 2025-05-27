import React, { useState, useRef, useEffect } from "react";
import { flexRender, Table } from "@tanstack/react-table";
import { CustomColumnDef, Row, ColumnDataType } from "@/types";
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
  onOpenSettingsPanel: (col: CustomColumnDef<Row>) => void;
  setRawColumns: React.Dispatch<React.SetStateAction<CustomColumnDef<Row>[]>>;
  setData: React.Dispatch<React.SetStateAction<Row[]>>;
  handleContextMenu: (e: React.MouseEvent, rowIndex: number, colIndex: number) => void;
  setFocusedRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const getRowNumberColumnWidth = (rowCount: number) => {
  const digits = String(rowCount).length;
  return digits * 8 + 32;
};

const columnTypes = [
  { label: "Text", type: "text" },
  { label: "Numeric", type: "number" },
  { label: "Integer", type: "integer" },
  { label: "Check Box", type: "boolean" },
  { label: "Date", type: "date" },
  { label: "Date Time", type: "datetime" },
  { label: "Choice List", type: "choice_list" },
  { label: "Reference List", type: "reference_list" },
  { label: "Attachment", type: "attachment" },
  { label: "Formula", type: "formula" },
  { label: "Link", type: "link" },
];

const GridTableHeader: React.FC<Props> = ({
  table,
  rawColumns,
  containerRef,
  setRenamePosition,
  setColumnBeingRenamed,
  setShowRenameModal,
  focusedColIndex,
  onFocusColumn,
  onOpenSettingsPanel,
  setRawColumns,
  setData,
  handleContextMenu,
  setFocusedRowIndex,
}) => {
  const [showAddDropdown, setShowAddDropdown] = useState(false);
  const [showTypeSubmenu, setShowTypeSubmenu] = useState(false);
  const addBtnRef = useRef<HTMLDivElement>(null);
  const [addMenuPos, setAddMenuPos] = useState<{ x: number; y: number } | null>(null);

  const headerGroups = table?.getHeaderGroups?.();
  const rowCount = table.getRowModel().rows.length;
  const rowNumberWidth = getRowNumberColumnWidth(rowCount);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdown = document.getElementById("add-column-dropdown");
      const button = addBtnRef.current;
      if (
        dropdown &&
        !dropdown.contains(e.target as Node) &&
        button &&
        !button.contains(e.target as Node)
      ) {
        setShowAddDropdown(false);
        setShowTypeSubmenu(false);
      }
    };

    if (showAddDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAddDropdown]);

  if (!headerGroups) return null;

  const handleAddColumn = (type: string) => {
    const newKey = `col_${Date.now()}`;
    const newCol: CustomColumnDef<Row> = {
      accessorKey: newKey,
      header: `New ${type}`,
      type: type as ColumnDataType,
    };

    setRawColumns((prev) => [...prev, newCol]);
    setData((prev) =>
      prev.map((row) => ({
        ...row,
        [newKey]: type === "number" || type === "integer" ? 0 : "",
      }))
    );
    setShowAddDropdown(false);
    setShowTypeSubmenu(false);
  };

  return (
    <div className="overflow-x-auto w-full relative">
      {headerGroups.map((headerGroup) => (
        <div
          key={headerGroup.id}
          className="grid bg-gray-100 font-semibold text-xs text-gray-600 border-b w-full"
          style={{
            gridTemplateColumns: `${rowNumberWidth}px ${headerGroup.headers
              .map((h) => `${h.getSize() || 120}px`)
              .join(" ")} 40px`,
          }}
        >
          <div
            style={{ width: `${rowNumberWidth}px` }}
            className="border-r text-xs font-mono text-gray-400 px-2 py-2 text-center bg-gray-100 select-none cursor-pointer"
            onClick={() => setFocusedRowIndex(null)}
            onContextMenu={(e) => handleContextMenu(e, -1, 0)}
          >
            #
          </div>

          {headerGroup.headers.map((header, index) => {
            const adjustedIndex = index;
            const col = rawColumns[adjustedIndex];

            return (
              <div
                key={header.id}
                className={`relative border-r whitespace-nowrap px-3 py-2 cursor-pointer rounded-sm transition-all duration-150 overflow-hidden text-ellipsis truncate ${
                  focusedColIndex === adjustedIndex ? "bg-gray-300 shadow" : "hover:bg-gray-200 hover:shadow"
                }`}
                style={{
                  width: header.getSize(),
                  transition: "width 0.05s ease-out",
                  minWidth: "80px",
                }}
                onClick={(e) => {
                  if (!col) return;
                  if (e.detail === 1) {
                    setFocusedRowIndex(null);
                    onFocusColumn(col, adjustedIndex);
                  }
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!col || !containerRef.current) return;

                  const headerRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  const containerRect = containerRef.current.getBoundingClientRect();
                  const relativeX = headerRect.left - containerRect.left;
                  const relativeY = headerRect.bottom - containerRect.top + 4;

                  setRenamePosition({ x: relativeX, y: relativeY });
                  setColumnBeingRenamed({ index: adjustedIndex + 1, name: String(col.header || "") });
                  setShowRenameModal(true);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleContextMenu(e, -1, adjustedIndex + 1);
                }}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {header.column.getCanResize() && (
                  <div
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    className="absolute top-0 right-0 h-full w-1 bg-transparent cursor-col-resize z-10 select-none"
                  />
                )}
              </div>
            );
          })}

          <div
            ref={addBtnRef}
            className="border-r flex items-center justify-center cursor-pointer hover:bg-gray-200"
            onClick={() => {
              const rect = addBtnRef.current?.getBoundingClientRect();
              if (rect) {
                setAddMenuPos({ x: rect.left, y: rect.bottom });
              }
              setShowAddDropdown((prev) => !prev);
            }}
          >
            <PlusIcon className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      ))}

      {showAddDropdown && addMenuPos && (
        <div
          id="add-column-dropdown"
          className="absolute z-50 w-64 bg-white border shadow rounded text-sm"
          style={{ position: "fixed", top: addMenuPos.y, left: addMenuPos.x }}
        >
          <div className="p-2">
            <div className="font-semibold mb-1">Add column</div>
            <div
              className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleAddColumn("text")}
            >
              Add column
            </div>
            <div
              className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer relative"
              onMouseEnter={() => setShowTypeSubmenu(true)}
              onMouseLeave={() => setShowTypeSubmenu(false)}
            >
              Add column with type →
              {showTypeSubmenu && (
                <div
                  className="absolute top-0 left-full ml-1 w-48 bg-white border shadow rounded z-50"
                  onMouseEnter={() => setShowTypeSubmenu(true)}
                  onMouseLeave={() => setShowTypeSubmenu(false)}
                >
                  {columnTypes.map((col) => (
                    <div
                      key={col.type}
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleAddColumn(col.type)}
                    >
                      {col.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className="px-2 py-1 hover:bg-gray-100 rounded cursor-pointer"
              onClick={() => handleAddColumn("formula")}
            >
              Add formula column
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GridTableHeader;
