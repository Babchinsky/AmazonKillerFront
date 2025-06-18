import React, { useState, ChangeEvent, useEffect, useMemo } from 'react';
import AdminInput from './AdminInput';
import { ConfirmModal } from '../common/ConfirmModal';
import './OrdersPanel.scss';
import { ADMIN_TOKEN } from '../../utils/auth/authToken';

enum PaymentType {
  Cash = 'Cash',
  Card = 'Card'
}

enum OrderStatus {
  Received = 'Received',
  ReadyForPickup = 'ReadyForPickup',
  Shipped = 'Shipped',
  Cancelled = 'Cancelled',
  Ordered = 'Ordered'
}

interface Address {
  country: string;
  city: string;
  state?: string;
  street: string;
  apartmentNumber?: string;
  postCode: string;
}

interface DeliveryInfo {
  firstName: string;
  lastName: string;
  email: string;
  address: Address;
}

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  products: Product[];
  status: OrderStatus;
  paymentType: PaymentType;
  deliveryInfo: DeliveryInfo;
  totalPrice: number;
  createdAt: string;
}

interface OrderDetails {
  id: string;
  orderNumber: string;
  price: number;
  status: OrderStatus;
  orderedAt: string;
  address: string;
  recipient: string;
  paymentType: PaymentType;
  items: {
    id: string;
    name: string;
    imageUrl: string;
    quantity: number;
    price: number;
  }[];
}

const statusToNumberMap: Record<OrderStatus, number> = {
  [OrderStatus.Received]: 0,
  [OrderStatus.ReadyForPickup]: 1,
  [OrderStatus.Shipped]: 2,
  [OrderStatus.Cancelled]: 3,
  [OrderStatus.Ordered]: 4
};

const updateOrderStatusOnServer = async (orderId: string, newStatus: OrderStatus): Promise<boolean> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderId,
        newStatus: statusToNumberMap[newStatus]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return true;
  } catch (error) {
    console.error('Ошибка при обновлении статуса заказа:', error);
    return false;
  }
};

export const OrdersPanel: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderDetails>>({});
  
  const [orderToUpdateStatus, setOrderToUpdateStatus] = useState<{id: string, status: OrderStatus} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        console.log('PostCode value:', data.items.map((item: any) => ({
          id: item.id,
          postCode: item.Info_Delivery_Address_PostCode
        })));
        const ordersFromApi = data.items.map((item: any) => {
          // Improved address parsing logic
          const addressParts = (item.address || '').split(', ').filter((part: string) => part.trim());
          const [country = '', state = '', city = '', ...restAddress] = addressParts;
          const streetAddress = restAddress.join(', ');

          // Разбиваем имя получателя
          const [firstName = '', lastName = ''] = (item.recipient || '').split(' ');

          return {
            id: item.id || 'N/A',
            orderNumber: item.orderNumber || `#${item.id.slice(0, 6)}`,
            userId: 'N/A', // Нет в ответе
            user: {
              id: 'N/A', // Нет в ответе
              name: item.recipient || 'Unknown User',
              email: item.email || 'N/A'
            },
            products: [], // Нет в ответе, оставляем пустой массив
            status: item.status || OrderStatus.Received,
            paymentType: item.paymentType as PaymentType || PaymentType.Card,
            deliveryInfo: {
              firstName,
              lastName,
              email: item.deliveryEmail || 'N/A',
              address: {
                country: country || '',
                state: state || '',
                city: city || '',
                street: streetAddress || '',
                postCode: item.Info_Delivery_Address_PostCode || ''
              }
            },
            totalPrice: item.totalPrice || 0,
            createdAt: item.orderedAt || new Date().toISOString()
          };
        });
        setOrders(ordersFromApi);
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setSearchValue(searchQuery);
    }
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrderDetails(prev => ({
        ...prev,
        [orderId]: data
      }));
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error);
    }
  };

  const toggleOrderExpand = (orderId: string) => {
    if (!expandedOrders.includes(orderId)) {
      fetchOrderDetails(orderId);
    }
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };


  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const success = await updateOrderStatusOnServer(orderId, newStatus);
    
    if (success) {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));
    }
    setOrderToUpdateStatus(null);
  };

  const getStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    const allStatuses = Object.values(OrderStatus);
    return allStatuses.filter(status => status !== currentStatus);
  };

  const filteredOrders = useMemo(() => {
    const searchLower = searchValue.toLowerCase();
    return orders.filter(order => {
      return (
        order.user.name.toLowerCase().includes(searchLower) ||
        order.user.email.toLowerCase().includes(searchLower) ||
        order.id.toLowerCase().includes(searchLower) ||
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.deliveryInfo.email.toLowerCase().includes(searchLower)
      );
    });
  }, [orders, searchValue]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setExpandedOrders([]);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  return (
    <div className="orders-panel">
      <ConfirmModal
        isOpen={!!orderToUpdateStatus}
        title="Change Order Status"
        message={`Do you want to change the order status to ${orderToUpdateStatus?.status}?`}
        confirmText="Yes"
        cancelText="No"
        type="status-change"
        onConfirm={() => orderToUpdateStatus && handleUpdateOrderStatus(orderToUpdateStatus.id, orderToUpdateStatus.status)}
        onCancel={() => setOrderToUpdateStatus(null)}
      />

      <div className="orders-panel__header">
        <div className="orders-panel__controls-group">
          <div className="orders-panel__search">
            <AdminInput
              type="text"
              value={searchValue}
              onChange={handleSearch}
              placeholder="Search by user name, email or order ID..."
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>
        </div>
      </div>

      <div className="orders-panel__content">
        <div className="orders-panel__orders-list">
          {orders.length === 0 ? (
            <div className="orders-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No orders found</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="orders-panel__empty-state">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <p>No orders match your search</p>
            </div>
          ) : (
            <>
              {currentOrders.map(order => (
                <div key={order.id} className="orders-panel__order-item">
                  <div 
                    className="orders-panel__order-header"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="orders-panel__order-info">
                      <div className="orders-panel__user-info">
                        <h3>{order.user.name}</h3>
                      </div>
                      <div className="orders-panel__order-meta">
                        <span className="orders-panel__order-id">{order.orderNumber}</span>
                        <span className="orders-panel__date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`orders-panel__status ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="orders-panel__price">
                        ${order.totalPrice.toFixed(2)}
                      </div>
                    </div>
                    <svg
                      className={`expand-arrow ${expandedOrders.includes(order.id) ? 'expanded' : ''}`}
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  
                  <div className={`orders-panel__order-content ${expandedOrders.includes(order.id) ? 'expanded' : ''}`}>
                    <div className="orders-panel__section">
                      <h4>Products</h4>
                      <div className="orders-panel__products">
                        {orderDetails[order.id]?.items ? (
                          orderDetails[order.id].items.map((product) => (
                            <div key={product.id} className="orders-panel__product">
                              <div className="orders-panel__product-info">
                                <span className="name">{product.name}</span>
                                <span className="quantity">×{product.quantity}</span>
                              </div>
                              <span className="price">${(product.price * product.quantity).toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <div className="orders-panel__loading">
                            Loading products...
                          </div>
                        )}
                        <div className="orders-panel__total">
                          <span className="orders-panel__total-label">Total</span>
                          <div className="orders-panel__total-price">
                            <span className="price">${order.totalPrice.toFixed(2)}</span>
                            <span className={`orders-panel__payment-type ${order.paymentType.toLowerCase()}`}>
                              {order.paymentType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="orders-panel__section">
                      <h4>Delivery Information</h4>
                      <div className="orders-panel__delivery-info">
                        <div className="orders-panel__recipient">
                          <p>
                            <strong>Recipient:</strong> {order.deliveryInfo.firstName} {order.deliveryInfo.lastName}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.deliveryInfo.email}
                          </p>
                        </div>
                        <div className="orders-panel__address">
                          <p>
                            <strong>Address:</strong><br />
                            {[
                              order.deliveryInfo.address.street,
                              order.deliveryInfo.address.city,
                              order.deliveryInfo.address.state,
                              order.deliveryInfo.address.country,
                              order.deliveryInfo.address.postCode
                            ].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="orders-panel__section orders-panel__actions-section">
                      <div className="orders-panel__action-buttons">
                        <div className="orders-panel__status-container">
                          <button
                            className="orders-panel__edit-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const statusSelect = document.getElementById(`status-select-${order.id}`);
                              if (statusSelect) {
                                statusSelect.style.display = statusSelect.style.display === 'none' ? 'block' : 'none';
                              }
                            }}
                          >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Change status
                          </button>
                          <div id={`status-select-${order.id}`} className="orders-panel__status-select" style={{display: 'none'}}>
                            {getStatusOptions(order.status).map(status => (
                              <button
                                key={status}
                                className={`orders-panel__status-option ${status.toLowerCase()}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOrderToUpdateStatus({ id: order.id, status });
                                  const statusSelect = document.getElementById(`status-select-${order.id}`);
                                  if (statusSelect) {
                                    statusSelect.style.display = 'none';
                                  }
                                }}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
        
        {filteredOrders.length > itemsPerPage && (
          <div className="orders-panel__pagination">
            <button
              className={`page-button arrow ${currentPage === 1 ? 'disabled' : ''}`}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`page-button ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <button key={page} className="page-button dots">
                    ...
                  </button>
                );
              }
              return null;
            })}

            <button
              className={`page-button arrow ${currentPage === totalPages ? 'disabled' : ''}`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
