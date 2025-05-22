import { Row } from "@/types";

const mockRows: Row[] = Array.from({ length: 3 }).map((_, i) => ({
  id: i + 1,
  order_id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
  customer_id: 1,
  shipment_status: "Pending",
}));

export default mockRows;
