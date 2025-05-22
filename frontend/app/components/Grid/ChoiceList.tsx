"use client";

import React from "react";
import * as Select from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";

interface ChoiceListProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const ChoiceList: React.FC<ChoiceListProps> = ({ value, options, onChange }) => {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center justify-between w-full px-2 py-1 border border-gray-300 rounded bg-white text-sm shadow-sm">
        <Select.Value asChild>
          <span>{value}</span>
        </Select.Value>
        <Select.Icon className="ml-1">
          <ChevronDownIcon />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content
          className="bg-white rounded shadow-lg border border-gray-200 z-50"
          sideOffset={4}
        >
          <Select.Viewport className="p-1">
            {options.map((opt) => (
              <Select.Item
                key={opt}
                value={opt}
                className="px-3 py-1.5 text-sm hover:bg-blue-50 focus:bg-blue-100 cursor-pointer rounded outline-none select-none"
              >
                <Select.ItemText>{opt}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

export default ChoiceList;
