import React from "react";
import TextCell from "./Text/TextCell";
import ChoiceCell from "./Choice/ChoiceCell";
import ReferenceCell from "./Reference/ReferenceCell";
import BooleanCell from "./Boolean/BooleanCell";
import CurrencyCell from "./Currency/CurrencyCell";
import NumberCell from "./Number/NumberCell";
import LinkCell from "./Link/LinkCell";
import FormulaCell from "./Formula/FormulaCell";
import AttachmentCell from "./Attachment/AttachmentCell";
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
  const handleSave = (id: string, key: string, newValue: any) => {
    if (newValue === rowId) return;
    if (newValue !== value) onSave(id, key, newValue);
    onEditComplete?.();
  };

  const normalizedType = column.type?.toLowerCase();

  if (editing) {
    if (["reference", "reference_list"].includes(normalizedType) && column.referenceData) {
      return (
        <ReferenceCell
          value={value}
          row={row}
          rowId={rowId}
          column={column as CustomColumnDef<any> & { referenceData: { id: string; name: string }[] }}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
          onStartEdit={onStartEdit}
        />
      );
    }
    if (["choice", "choice_list"].includes(normalizedType) && column.choices) {
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
    if (normalizedType === "boolean") {
      return (
        <BooleanCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
        />
      );
    }
    if (normalizedType === "currency") {
      return (
        <CurrencyCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
        />
      );
    }
    if (normalizedType === "number") {
      return (
        <NumberCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
        />
      );
    }
    if (normalizedType === "link") {
      return (
        <LinkCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
        />
      );
    }
    if (normalizedType === "formula") {
      return (
        <FormulaCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
        />
      );
    }
    if (normalizedType === "attachment") {
      return (
        <AttachmentCell
          value={value}
          rowId={rowId}
          column={column}
          onSave={handleSave}
          editing
          onEditComplete={onEditComplete}
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

  return (
    <div
      className="w-full h-full px-2 py-1 text-sm select-none cursor-pointer"
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onStartEdit?.();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") onStartEdit?.();
      }}
      tabIndex={0}
    >
      {typeof value === "string" || typeof value === "number"
        ? value
        : `[Uneditable: ${column.type}]`}
    </div>
  );
} 
