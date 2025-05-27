import React from "react";
import TextCell from "./Text/TextCell";
import ChoiceCell from "./Choice/ChoiceCell";
import ReferenceCell from "./Reference/ReferenceCell";
import { CustomColumnDef } from "@/types";
import ChoiceTag from "@/components/Grid/EditableCell/Choice/ChoiceTag";

export default function EditableCell({
  value,
  row,
  rowId,
  column,
  onSave,
  editing,
  onEditComplete,
  onStartEdit,
}: {
  value: any;
  row: any;
  rowId: string;
  column: CustomColumnDef<any>;
  onSave: (rowId: string, key: string, value: any) => void;
  editing?: boolean;
  onEditComplete?: () => void;
  onStartEdit?: () => void;
}) {
  console.log("🧹 EditableCell received", {
    rowId,
    accessorKey: column.accessorKey,
    value,
    type: typeof value,
    column,
    row,
  });

  // This save handler receives all 3 args from child components
  const handleSave = (id: string, key: string, newValue: any) => {
    const isSameAsRowId = newValue === rowId;

    console.log("📂 EditableCell handleSave called", {
      rowId: id,
      accessorKey: key,
      newValue,
      oldValue: value,
      newValueIsRowId: isSameAsRowId,
    });

    if (isSameAsRowId) {
      console.error("🚫 Blocked saving rowId as value", {
        newValue,
        rowId: id,
        accessorKey: key,
        column,
      });
      return;
    }

    if (newValue !== value) {
      onSave(id, key, newValue);
    }
    onEditComplete?.();
  };

  if (editing) {
    if (column.type === "reference" && column.referenceData) {
      return (
        <ReferenceCell
          value={value}
          row={row}
          rowId={rowId}
          column={
            column as CustomColumnDef<any> & {
              referenceData: { id: string; name: string }[];
            }
          }
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
          onStartEdit={onStartEdit}
        />
      );
    }

    if (column.type === "choice" && column.choices) {
      return (
        <ChoiceCell
          value={value}
          row={row}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
          onStartEdit={onStartEdit}
        />
      );
    }

    return (
      <TextCell
        value={value}
        row={row}
        rowId={rowId}
        column={column}
        onSave={handleSave}
        editing
        onEditComplete={onEditComplete}
        onStartEdit={onStartEdit}
      />
    );
  }

  if (column.type === "reference" && column.referenceData) {
    const display =
      column.referenceData.find((item) => item.id === value)?.name ?? "Unknown";

    return (
      <button
        type="button"
        className="w-full h-full px-2 py-1 text-sm cursor-default select-none text-left"
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🟢 ReferenceCell double-clicked");
          onStartEdit?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onStartEdit?.();
          }
        }}
        tabIndex={0}
      >
        <ChoiceTag value={display} />
      </button>
    );
  }

  if (column.type === "choice" && column.choices) {
    let display: string;

    if (
      Array.isArray(column.choices) &&
      typeof column.choices[0] === "object" &&
      "id" in column.choices[0]
    ) {
      display =
        (column.choices as { id: string; name: string }[]).find(
          (choice) => choice.id === value
        )?.name ?? "Unknown";
    } else {
      display = value;
    }

    return (
      <button
        type="button"
        className="w-full h-full px-2 py-1 text-sm cursor-default select-none text-left"
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🔶 ChoiceCell double-clicked");
          onStartEdit?.();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onStartEdit?.();
          }
        }}
        tabIndex={0}
      >
        <ChoiceTag value={display} />
      </button>
    );
  }

  if (!column.type || column.type === "text") {
    return (
      <TextCell
        value={value}
        row={row}
        rowId={rowId}
        column={column}
        onSave={onSave}
        editing={false}
        onEditComplete={onEditComplete}
        onStartEdit={onStartEdit}
      />
    );
  }

  console.warn("❌ Unknown column type", column);
  return (
    <div className="text-red-600 px-2 py-1 text-sm">Invalid column type</div>
  );
}
