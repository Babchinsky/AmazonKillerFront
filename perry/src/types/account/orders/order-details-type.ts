import OrderItemType from "./order-item-type";
import OrderStatusType from "./order-status-type";


type OrderDetailsType = {
  id: string;
  price: number;
  status: OrderStatusType;
  orderedAt: string;
  address: string;
  recipient: string;
  paymentType: string;
  items: OrderItemType[];
};

export default OrderDetailsType;