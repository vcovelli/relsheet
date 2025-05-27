"use client";

import React, { useState } from "react";
import Frame from "@/components/UI/Frame";
import GridTable from "@/components/Grid/GridTable";
import ColumnSettingsPanel from "@/components/UI/ColumnSettingsPanel";
import { CustomColumnDef, ColumnDataType } from "@/types";
import { motion } from "framer-motion";
import { PanelRightOpen } from "lucide-react";

export default function SheetsPage() {
  const [sheetSelected, setSheetSelected] = useState(true);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [columnSettingsTarget, setColumnSettingsTarget] = useState<CustomColumnDef<any> | null>(null);

  const handleUpdateColumn = (updatedCol: CustomColumnDef<any>) => {
    setIsSettingsPanelOpen(false);
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto bg-gray-100 relative box-border">
      <Frame>
        <div className="flex flex-col h-full">
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
            {sheetSelected && (
              <GridTable
                onOpenSettingsPanel={(col) => {
                  setColumnSettingsTarget(col);
                  setIsSettingsPanelOpen(true);
                }}
                isSettingsPanelOpen={isSettingsPanelOpen}
              />
            )}
          </motion.div>
        </div>
      </Frame>

      {/* Toggle Button */}
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

      {/* Settings Panel */}
      <ColumnSettingsPanel
        isOpen={isSettingsPanelOpen}
        column={columnSettingsTarget}
        onClose={() => setIsSettingsPanelOpen(false)}
        onUpdate={handleUpdateColumn}
      />
    </div>
  );
}
