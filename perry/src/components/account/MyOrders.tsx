import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../state/store";
import { getOrderDetails, getOrders } from "../../state/orders/orders-slice";
import Button from "../buttons/Button";
import Order from "../popups/commerce/Order";
import accountDataStyles from "./AccountData.module.scss";
import myOrdersStyles from "./MyOrders.module.scss";
import { getFormattedDate } from "@/utils/getFormattedValue";


function MyOrders() {
  const dispatch = useDispatch<AppDispatch>();
  const { orders, error } = useSelector((state: RootState) => state.orders);

  const [itemsCountMap, setItemsCountMap] = useState<Record<string, number>>({});
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderNumber, setSelectedOrderNumber] = useState<string | null>(null);
  
  const [isOrderOpen, setIsOrderOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getOrders({}));
  }, [dispatch]);

  useEffect(() => {
    if (!orders.length) {
      return;
    }

    orders.forEach((order) => {
      if (itemsCountMap[order.id] != null) {
        return;
      }

      dispatch(getOrderDetails(order.id))
        .unwrap()
        .then((details) => {
          setItemsCountMap((prev) => ({
            ...prev,
            [order.id]: details.items.length,
          }));
        })
        .catch(() => {
          setItemsCountMap((prev) => ({ ...prev, [order.id]: 0 }));
        });
    });
  }, [orders, dispatch, itemsCountMap]);

  useEffect(() => {
    const action = isOrderOpen ? "add" : "remove";
    document.body.classList[action]("body-no-scroll");
    document.documentElement.classList[action]("html-no-scroll");

    return () => {
      document.body.classList.remove("body-no-scroll");
      document.documentElement.classList.remove("html-no-scroll");
    };
  }, [isOrderOpen]);

  return (
    <>
      <div className={accountDataStyles.accountDataContainer}>
        <div className={accountDataStyles.accountDataTopContainer}>
          <h1>My orders</h1>
          <hr className={`${accountDataStyles.accountDataDivider} divider`} />
        </div>
        
        <div className={accountDataStyles.accountDataBottomContainer}>
          <div className={myOrdersStyles.orderListContainer}>
            {orders.length > 0 ? (
              <>
                {orders.map((order, index) => {
                  const count = itemsCountMap[order.id];
  
                  return (
                    <div
                      className={`${myOrdersStyles.orderContainer} ${index % 2 !== 0 ? "highlight" : ""}`}
                      key={order.id}
                    >
                      <div className={myOrdersStyles.orderLeftContainer}>
                        <div>
                          <p>
                            Order {order.orderNumber}
                            <span className={
                              `${myOrdersStyles.status} ${myOrdersStyles[order.status
                              .toLowerCase()
                              .replace(/(?:^\w|\s\w)/g, m => m.trim().toUpperCase())
                              .replace(/\s/g, "")
                              .replace(/^./, c => c.toLowerCase()) + "Status"]}`
                            }>
                              {order.status}
                            </span>
                          </p>
                        </div>
                        <div className={myOrdersStyles.date}>
                          Ordered on {order && getFormattedDate(order.orderedAt)}
                        </div>
                      </div>
  
                      <div className={myOrdersStyles.orderRightContainer}>
                        <p className={myOrdersStyles.itemCount}>
                          {count != null
                          ? `Ordered ${count} item${count !== 1 ? "s" : ""}`
                          : "Loading…"}
                        </p>
                        <div>
                          <div className={myOrdersStyles.itemPriceContainer}>
                            {(() => {
                              const [totalItemCurrencyMajor, totalItemCurrencyMinor] = order.totalPrice.toFixed(2).split(".");
      
                              return (
                                <p className={myOrdersStyles.price}>
                                  <span className={myOrdersStyles.currency}>$</span>
                                  <span>{totalItemCurrencyMajor}</span>
                                  <span className={myOrdersStyles.currencyMinor}>{totalItemCurrencyMinor}</span>
                                </p>
                              );
                            })()}
                          </div>
  
                          <Button 
                            type="secondary" 
                            content="Details"
                            onClick={() => {
                              setSelectedOrderId(order.id);
                              setSelectedOrderNumber(order.orderNumber);
                              setIsOrderOpen(true);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <p className={myOrdersStyles.orderListMessage}>No orders found.</p>
            )}
          </div>
        </div>
      </div>

      {isOrderOpen && selectedOrderId && selectedOrderNumber && (
        <Order orderId={selectedOrderId} orderNumber={selectedOrderNumber} onClose={() => setIsOrderOpen(false)} />
      )}
    </>
  );
}

export default MyOrders;