import React, { useEffect, useRef, useState } from "react";
import { CustomColumnDef } from "@/types";
import ChoiceTag from "@components/Grid/ChoiceTag";

type ReferenceOption = { id: string; name: string };

export default function ReferenceCell({
  value: initialValue,
  row,
  column,
  onSave,
  editing = false,
  onEditComplete,
  onStartEdit,
}: {
  value: any;
  row: any;
  column: CustomColumnDef<any> & { referenceData?: ReferenceOption[] };
  onSave: (id: number, key: string, value: any) => void;
  editing?: boolean;
  onEditComplete?: () => void;
  onStartEdit?: () => void;
}) {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (editing && selectRef.current) {
      selectRef.current.focus();
    }
  }, [editing]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onSave(row.id, column.accessorKey, newValue);
    onEditComplete?.();
  };

  const display = column.referenceData?.find(item => item.id === initialValue)?.name ?? "Unknown";

  if (editing) {
    return (
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        onBlur={() => onEditComplete?.()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setValue(initialValue);
            onEditComplete?.();
          }
        }}
        className="w-full h-full px-2 py-1 text-sm border border-gray-300 rounded outline-none"
      >
        {column.referenceData?.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div
      className="w-full h-full px-2 py-1 text-sm cursor-default select-none"
      onDoubleClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onStartEdit?.();
      }}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onStartEdit?.();
        }
      }}
    >
      <ChoiceTag value={display} />
    </div>
  );
}
