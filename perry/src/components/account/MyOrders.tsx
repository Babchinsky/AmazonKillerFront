import { useDispatch, useSelector } from "react-redux";
import OrderType from "../../types/account/orders/order-type";
import TextButton from "../buttons/Button";
import accountDataStyles from "./AccountData.module.scss";
import myOrdersStyles from "./MyOrders.module.scss";
import { AppDispatch, RootState } from "../../state/store";
import { useEffect } from "react";
import { getOrders } from "../../state/orders/order-slice";


function MyOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, isLoading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    dispatch(getOrders() as any);
  }, [dispatch]);

  // const orders: OrderType[] = [
  //   { id: "000001", date: "12.05.2024", status: "Received", total: "$999.99", items: 1 },
  //   { id: "000002", date: "12.05.2024", status: "Ready for pickup", total: "$999.99", items: 1 },
  //   { id: "000003", date: "12.05.2024", status: "Shipped", total: "$999.99", items: 1 },
  //   { id: "000004", date: "12.05.2024", status: "Ordered", total: "$999.99", items: 1 },
  //   { id: "000005", date: "12.05.2024", status: "Cancelled", total: "$999.99", items: 1 },
  // ];

  return (
    <div className="account-data-content-container">
      <div className="title-container">
        <h1>My orders</h1>
      </div>

      <hr className="divider" />

      <div className="order-list-container">
        {orders.map((order, index) => (
          <div
            className={`order-container ${index % 2 !== 0 ? "highlight" : ""}`}
            key={order.id}
          >
            <div className="order-left-container">
              <div>
                <p>
                  Order #{order.orderNumber}{" "}
                  <span className={`status ${order.status.replace(/\s/g, "-").toLowerCase()}-status`}>
                    {order.status}
                  </span>
                </p>
              </div>
              <div className="date">
                Ordered on {new Date(order.orderedAt).toLocaleDateString()}
              </div>
            </div>

            <div className="order-right-container">
              <p className="item-count">Shipping to: {order.recipient}</p>
              <div>
                <div className="price-container">
                  <p className="price">
                    <span className="currency">$</span>
                    <span>{Math.floor(order.totalPrice)}</span>
                    <span className="currency-minor">
                      {String(order.totalPrice % 1).slice(2).padEnd(2, "0")}
                    </span>
                  </p>
                </div>
                <TextButton className="details-button" type="secondary" content="Details" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;