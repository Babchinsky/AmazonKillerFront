import OrderStatusType from "./order-status-type";


type OrderType = {
  id: string;
  orderNumber: string;
  totalPrice: number;
  status: OrderStatusType;
  orderedAt: string;
  email: string;
  deliveryEmail: string;
  address: string;
  recipient: string;
  paymentType: string;
};

export default OrderType;