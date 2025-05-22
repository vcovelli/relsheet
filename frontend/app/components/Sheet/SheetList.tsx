"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Sheet {
  id: number;
  name: string;
  created_by: string | null;
}

export default function SheetList() {
  const [sheets, setSheets] = useState<Sheet[]>([]);

  useEffect(() => {
    const fetchSheets = async () => {
      try {
        const res = await axios.get("http://backend:8000/api/sheets/");
        setSheets(res.data);
      } catch (error) {
        console.error("Failed to fetch sheets:", error);
      }
    };

    fetchSheets();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🧾 Relational Spreadsheet</h1>
      {sheets.length === 0 ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="space-y-4">
          {sheets.map((sheet) => (
            <div
              key={sheet.id}
              className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <p className="text-lg font-semibold">Name: {sheet.name}</p>
              <p className="text-sm text-gray-500">
                Created By: {sheet.created_by ?? "Anonymous"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
