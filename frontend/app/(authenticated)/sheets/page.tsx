"use client";

import React, { useState, useEffect } from "react";
import Frame from "@/components/UI/Frame";
import GridTable from "@/components/Grid/GridTable";
import ColumnSettingsPanel from "@/components/UI/ColumnSettingsPanel";
import { CustomColumnDef, Row, ColumnDataType } from "@/types";
import { motion } from "framer-motion";
import { PanelRightOpen } from "lucide-react";

const availableTables = ["orders", "products", "customers", "suppliers", "warehouses"];
const userRole = "enterprise"; // or "pro", "free"

export default function SheetsPage() {
  const [activeTableName, setActiveTableName] = useState<string>("orders");
  const [columns, setColumns] = useState<CustomColumnDef<any>[]>([]);
  const [rows, setRows] = useState<Row[]>([]);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isTablePanelOpen, setIsTablePanelOpen] = useState(true);
  const [columnSettingsTarget, setColumnSettingsTarget] = useState<CustomColumnDef<any> | null>(null);

  useEffect(() => {
    if (!activeTableName) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/schema/${activeTableName}/`);
        const json = await res.json();
        setColumns(json.columns);
        setRows(json.rows);
      } catch (e) {
        console.error("Failed to load sheet:", e);
      }
    };

    fetchData();
  }, [activeTableName]);

  const handleUpdateColumn = (updatedCol: CustomColumnDef<any>) => {
    setIsSettingsPanelOpen(false);
    // You can add column editing logic here if needed
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto bg-gray-100 relative box-border">
      <Frame>
        <div className="flex h-full">
          {/* Left Panel */}
          {isTablePanelOpen ? (
            <div className="w-64 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">📁 Tables</h2>
                <button
                  onClick={() => setIsTablePanelOpen(false)}
                  className="text-gray-600 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <ul className="p-4 space-y-2">
                {availableTables.map((table) => (
                  <button
                    key={table}
                    onClick={() => setActiveTableName(table)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      table === activeTableName
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {table.charAt(0).toUpperCase() + table.slice(1)}
                  </button>
                ))}
              </ul>
            </div>
          ) : (
            <div className="w-12 flex items-start justify-center p-2">
              <button
                onClick={() => setIsTablePanelOpen(true)}
                className="bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
                title="Open Table Panel"
              >
                📁
              </button>
            </div>
          )}

          {/* Main Grid */}
          <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
            <div className="px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold mb-4">🧾 Relational Spreadsheet</h1>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="flex-1"
            >
              <GridTable
                tableName={activeTableName}
                columns={columns}
                data={rows}
                onUpdateTable={() => {}}
                onOpenSettingsPanel={(col) => {
                  setColumnSettingsTarget(col);
                  setIsSettingsPanelOpen(true);
                }}
                isSettingsPanelOpen={isSettingsPanelOpen}
              />
            </motion.div>
          </div>
        </div>
      </Frame>

      {/* Right Column Settings */}
      <button
        className="fixed top-4 right-4 z-50 bg-gray-200 hover:bg-gray-300 border border-gray-400 rounded-full w-8 h-8 flex items-center justify-center shadow-md"
        onClick={() => {
          const fallbackCol: CustomColumnDef<any> = {
            accessorKey: "sample",
            header: "Sample Column",
            type: "text" as ColumnDataType,
          };
          setColumnSettingsTarget(columnSettingsTarget || fallbackCol);
          setIsSettingsPanelOpen(true);
        }}
        title="Open Column Settings"
      >
        <PanelRightOpen className="w-4 h-4 text-gray-700" />
      </button>

      <ColumnSettingsPanel
        isOpen={isSettingsPanelOpen}
        column={columnSettingsTarget}
        onClose={() => setIsSettingsPanelOpen(false)}
        onUpdate={handleUpdateColumn}
      />
    </div>
  );
}
