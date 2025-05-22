import React from "react";
import TextCell from "./TextCell";
import ChoiceCell from "./ChoiceCell";
import ReferenceCell from "./ReferenceCell";
import { CustomColumnDef } from "@/types";
import ChoiceTag from "@components/Grid/ChoiceTag";

export default function EditableCell({
  value,
  row,
  column,
  onSave,
  editing,
  onEditComplete,
  onStartEdit,
}: {
  value: any;
  row: any;
  column: CustomColumnDef<any>;
  onSave: (id: number, key: string, value: any) => void;
  editing?: boolean;
  onEditComplete?: () => void;
  onStartEdit?: () => void;
}) {
  console.log("🧩 EditableCell rendered", {
    accessorKey: column.accessorKey,
    type: column.type,
    editing,
    value,
  });

  const handleSave = (newValue: any) => {
    if (newValue !== value) {
      onSave(row.id, column.accessorKey, newValue);
    }
    onEditComplete?.();
  };

  // 👉 Render edit mode
  if (editing) {
    if (column.type === "reference" && column.referenceData) {
      return (
        <ReferenceCell
          value={value}
          row={row}
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
        column={column}
        onSave={handleSave}
        editing
        onEditComplete={onEditComplete}
        onStartEdit={onStartEdit}
      />
    );
  }

  // 👉 View mode for reference
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
          console.log("🟩 ReferenceCell double-clicked");
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

  // 👉 View mode for choice
  if (column.type === "choice" && column.choices) {
    return (
      <button
        type="button"
        className="w-full h-full px-2 py-1 text-sm cursor-default select-none text-left"
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log("🟦 ChoiceCell double-clicked");
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
        <ChoiceTag value={value} />
      </button>
    );
  }

  // 👉 View mode for text
  if (!column.type || column.type === "text") {
    return (
      <TextCell
        value={value}
        row={row}
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
