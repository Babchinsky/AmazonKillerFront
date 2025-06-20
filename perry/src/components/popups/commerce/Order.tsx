import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../state/store";
import { getOrderDetails } from "../../../state/orders/orders-slice";
import DefaultImage from "../../../assets/images/default.jpg";
import CloseIcon from "../../../assets/icons/close.svg?react";
import commerceStyles from "./Commerce.module.scss";
import orderStyles from "./Order.module.scss";
import { getFormattedDate } from "@/utils/getFormattedValue";


interface OrderProps {
  orderId: string;
  orderNumber: string;
  onClose: () => void;
}

function Order(props: OrderProps) {
  const dispatch = useDispatch<AppDispatch>();
  
  const accessToken = localStorage.getItem("accessToken");
  
  const order = useSelector((state: RootState) => state.orders.orderDetails);

  const [totalCurrencyMajor, totalCurrencyMinor] = order ? order?.price.toFixed(2).split(".") : [0, 0];

  useEffect(() => {
    dispatch(getOrderDetails(props.orderId));
  }, [dispatch, props.orderId]);

  return (
    <>
      <div className={commerceStyles.overlay} onClick={props.onClose}></div>

      <div className={commerceStyles.commerceContainer}>
        <div className={commerceStyles.commerce}>
          <div className={commerceStyles.contentContainer}>
            <div className={commerceStyles.contentTopContainer}>
              <div className={commerceStyles.titleBarContainer}>
                <div className={commerceStyles.titleContainer}>
                  <h3>Order {props.orderNumber}</h3>
                </div>
    
                <button onClick={props.onClose}>
                  <CloseIcon className={commerceStyles.closeIcon} />
                </button>
              </div>

              <hr className={`${commerceStyles.contentDivider} divider`} />
            </div>
  
            <div className={commerceStyles.contentScrollableContainer}>
              <div className={commerceStyles.contentMiddleContainer}>   
                <div className={commerceStyles.smallItemListContainer}>
                  {order?.items.map((item, index) => (
                    <div key={index} className={commerceStyles.smallItemContainer}>
                      <div>
                        <img alt={item.name} src={item.imageUrl || DefaultImage} />
                      </div>
                      
                      <div className={commerceStyles.itemDataContainer}>
                        <div className={commerceStyles.itemDataTopContainer}>
                          <p>{item.name}</p>
                        </div>

                        <div className={commerceStyles.itemDataBottomContainer}>
                          <div className={`${commerceStyles.itemPriceContainer} ${orderStyles.itemPriceContainer}`}>
                            {(() => {
                              const totalItemPrice = (item.price * item.quantity).toFixed(2);
                              const [currencyMajor, currencyMinor] = item.price.toFixed(2).split(".");
                              const [totalItemCurrencyMajor, totalItemCurrencyMinor] = totalItemPrice.split(".");

                              return (
                                <>
                                  <div className={commerceStyles.itemQuantityPriceContainer}>
                                    <p className={commerceStyles.price}>
                                      <span className={commerceStyles.quantity}>{item.quantity}</span>
                                      <span className={commerceStyles.x}>x</span>
                                      <span className={commerceStyles.currency}>$</span>
                                      <span>{currencyMajor}</span>
                                      <span className={commerceStyles.currencyMinor}>{currencyMinor}</span>
                                    </p>
                                  </div>

                                  <div className={commerceStyles.totalItemPriceContainer}>
                                    <p className={commerceStyles.price}>
                                      <span className={commerceStyles.currency}>$</span>
                                      <span>{totalItemCurrencyMajor}</span>
                                      <span className={commerceStyles.currencyMinor}>{totalItemCurrencyMinor}</span>
                                    </p>
                                  </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
    
              <div className={`${commerceStyles.contentBottomContainer} ${orderStyles.contentBottomContainer}`}>
                <div>
                  <hr className="divider" />
  
                  <div className={`${commerceStyles.contentDataContainer} ${orderStyles.contentDataContainer}`}>
                    <div className={commerceStyles.totalContainer}>
                      <div className={`${commerceStyles.totalDataContainer} ${orderStyles.totalDataContainer}`}>
                        <p>Total:</p>
                        <div className={commerceStyles.totalPriceContainer}>
                          <p className={commerceStyles.price}>
                            <span className={commerceStyles.currency}>$</span>
                            <span>{totalCurrencyMajor}</span>
                            <span className={commerceStyles.currencyMinor}>{totalCurrencyMinor}</span>
                          </p>
                        </div>
                      </div>
                    </div>                 
                  </div>
                  
                  <hr className="divider" />
                </div>
                    
                <div>
                  <h3>Additional information</h3>

                  <div className={orderStyles.additionalInfoContainer}>
                    <p>Recipient’s name:</p>
                    <p>{order?.recipient}</p>
                  </div>
                  <div className={orderStyles.additionalInfoContainer}>
                    <p>Address</p>
                    <p>{order?.address}</p>
                  </div>
                  <div className={orderStyles.additionalInfoContainer}>
                    <p>Payment type</p>
                    <p>{order?.paymentType}</p>
                  </div>
                  <div className={orderStyles.additionalInfoContainer}>
                    <p>Ordered on</p>
                    <p>{order && getFormattedDate(order.orderedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Order;