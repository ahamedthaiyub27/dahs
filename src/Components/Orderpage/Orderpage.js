import React, { useEffect, useState } from 'react';
import styles from './Orderpage.module.css';

const Orderpage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/get');
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (order, newStatus) => {
    const updatedFields = {
      order_status: newStatus,
    };

    if (newStatus === 'Done') {
      updatedFields.order_type = 'served';
    }
    if (newStatus === 'Ready for pickup') {
      updatedFields.order_type = 'Take away';
    }


    fetch(`http://localhost:8000/update/${order._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedFields),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update');
        return res.json();
      })
      .then((data) => {
        console.log(' Order updated:', data);

        if (newStatus === 'Done' || newStatus === 'Cancelled') {
          setTimeout(() => {
           
          }, 40000);
        }

        fetchOrders();
      })
      .catch((err) => {
        console.error(' Update error:', err);
      });
  };

  const deleteOrder = (_id) => {
    fetch(`http://localhost:8000/delete/${_id}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete');
        return res.json();
      })
      .then(() => {
        setOrders((prev) => prev.filter((order) => order._id !== _id));
        alert('order will be deleted in 40 s')
      })
      .catch((err) => console.error('Delete error:', err));
  };

  return (
    <div className={styles.container}>
      <h1>Orders</h1>
      <div className={styles.orderMainContainer}>
        {orders.map((data, index) => (
          <div
            key={index}
            className={`${styles.orderCard} ${styles[data.order_status.toLowerCase().replace(/\s/g, '')]}`}
          >
            <div className={styles.header}>
              <span className={styles.orderId}># {data.order_id}</span>
              <span className={styles.orderType}>{data.order_type}</span>
            </div>
            <div className={styles.time}>
              Table-{data.table_no} | {new Date(data.createdAt).toLocaleTimeString()}
            </div>
            <div className={styles.subStatus}>Qty: {data.ordered_quantity}</div>
            <div className={styles.itemCount}>Persons: {data.no_of_persons}</div>
            <ul className={styles.itemList}>
              <li>{data.ordered_food}</li>
              {data.cooking_instructions && data.cooking_instructions !== 'null' && (
                <li>Instructions: {data.cooking_instructions}</li>
              )}
            </ul>
            <div className={styles.footer}>
              <div className={styles.statusText}>Status: {data.order_status}</div>
              <select
                value={data.order_status}
                onChange={(e) => handleStatusChange(data, e.target.value)}
              >
                <option value="Processing">Processing</option>
                <option value="Done">Done</option>
                <option value="Not Pickup">Not Pickup</option>
                <option value="Ready for pickup">Ready for pickup</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orderpage;
