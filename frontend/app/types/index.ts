export interface Row {
  id: number;
  [key: string]: any;
}

export interface CustomColumnDef<TData> {
  accessorKey: string;
  header: string;
  type?: "text" | "choice" | "reference";
  choices?: string[];
  referenceData?: { id: number; name: string }[];
}
