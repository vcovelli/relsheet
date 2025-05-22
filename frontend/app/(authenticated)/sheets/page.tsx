"use client";

import React, { useState } from "react";
import Frame from "@/components/UI/Frame";
import SheetList from "@/components/Sheet/SheetList";
import GridTable from "@/components/Grid/GridTable";
import { motion } from "framer-motion";

export default function SheetsPage() {
  const [sheetSelected, setSheetSelected] = useState(true);

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Frame>
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold mb-6">🧾 Relational Spreadsheet</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="flex-1 overflow-auto"
          >
            {sheetSelected ? <GridTable /> : <SheetList />}
          </motion.div>
        </div>
      </Frame>
    </div>
  );
}
