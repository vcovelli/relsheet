"use client";

import React, { useRef } from "react";
import { PaperclipIcon } from "lucide-react";
import { CustomColumnDef } from "@/types";

interface AttachmentCellProps {
  value: string | null;
  rowId: string;
  column: CustomColumnDef<any>;
  editing?: boolean;
  onSave?: (id: string, key: string, value: any) => void;
  onEditComplete?: () => void;
  onStartEdit?: () => void;
}

const AttachmentCell: React.FC<AttachmentCellProps> = ({
  value,
  rowId,
  column,
  editing = false,
  onSave,
  onEditComplete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onSave) {
      const url = URL.createObjectURL(file); // You’ll want to upload this and store a permanent URL instead
      onSave(rowId, column.accessorKey, url);
    }
    onEditComplete?.();
  };

  if (!editing) {
    return value ? (
      <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline flex items-center gap-1">
        <PaperclipIcon className="w-4 h-4" /> Attachment
      </a>
    ) : (
      <span className="text-gray-400 italic text-sm">No file</span>
    );
  }

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="block w-full text-sm file:mr-4 file:py-1 file:px-2 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
      />
    </div>
  );
};

export default AttachmentCell;
