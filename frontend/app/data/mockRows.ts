import { Row } from "@/types";
import { v4 as uuidv4 } from "uuid";

const mockRows: Row[] = [
  {
    __rowId: uuidv4(),
    order_id: "ORD-8423",
    customer_id: 1,
    shipment_status: "Pending",
  },
  //{
    //__rowId: uuidv4(),
    //order_id: "ORD-3825",
    //customer_id: 1,
    //shipment_status: "Pending",
  //},
  //{
    //__rowId: uuidv4(),
    //order_id: "ORD-7385",
    //customer_id: 2,
    //shipment_status: "In Transit",
  //},
  //{
    //__rowId: uuidv4(),
    //order_id: "ORD-2568",
    //customer_id: 3,
    //shipment_status: "Delivered",
  //},
];

export default mockRows;
