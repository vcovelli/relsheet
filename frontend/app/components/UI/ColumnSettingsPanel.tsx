import React, { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import { ColumnDataType, CustomColumnDef } from "@/types";

interface ColumnSettingsPanelProps {
  isOpen: boolean;
  column: CustomColumnDef<any> | null;
  onClose: () => void;
  onUpdate: (updated: CustomColumnDef<any>) => void;
}

const COLUMN_TYPES: ColumnDataType[] = [
  "text",
  "number",
  "currency",
  "boolean",
  "choice",
  "reference",
  "date",
  "link",
  "formula",
  "attachment",
];

export default function ColumnSettingsPanel({
  isOpen,
  column,
  onClose,
  onUpdate,
}: ColumnSettingsPanelProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ColumnDataType>("text");
  const [formula, setFormula] = useState("");

  useEffect(() => {
    if (column) {
      setName(column.header?.toString() || "");
      setType(column.type || "text");
      if (column.type === "formula" && "formula" in column) {
        setFormula((column as any).formula || "");
      }
    }
  }, [column]);

  const handleSave = () => {
    if (!column) return;
    const updated: CustomColumnDef<any> = {
      ...column,
      header: name,
      type,
      ...(type === "formula" && { formula }),
    };
    onUpdate(updated);
    onClose();
  };

  return (
    <>

      {/* Sliding Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Column Settings</h2>
          <button onClick={onClose}>
            <XIcon className="w-5 h-5 text-gray-500 hover:text-black" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Column Label
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Column Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ColumnDataType)}
              className="w-full border rounded px-2 py-1 text-sm"
            >
              {COLUMN_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {type === "formula" && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Formula
              </label>
              <textarea
                value={formula}
                onChange={(e) => setFormula(e.target.value)}
                className="w-full h-24 border rounded px-2 py-1 text-sm"
                placeholder="Enter formula here"
              />
            </div>
          )}

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white rounded py-2 text-sm hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}
