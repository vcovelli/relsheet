import { CustomColumnDef, Row } from "@/types";

const mockColumns: CustomColumnDef<Row>[] = [
  {
    accessorKey: "order_id",
    header: "Order ID",
    type: "text",
  },
  {
    accessorKey: "customer_id",
    header: "Customer",
    type: "reference",
    referenceData: [
      { id: "1", name: "Alice Johnson" },
      { id: "2", name: "Bob Smith" },
      { id: "3", name: "Charlie Davis" },
    ],
  },
  {
    accessorKey: "shipment_status",
    header: "Status",
    type: "choice",
    choices: [
      { id: "pending", name: "Pending" },
      { id: "in_transit", name: "In Transit" },
      { id: "delivered", name: "Delivered" },
    ],
  },
];

export default mockColumns;
