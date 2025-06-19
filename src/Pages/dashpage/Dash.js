import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut } from 'react-chartjs-2';
import styles from './Dash.module.css';

import {
  FaUserTie,
  FaMoneyBillWave,
  FaClipboardList,
  FaUsers,
} from 'react-icons/fa';

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  ArcElement,
  Legend,
} from 'chart.js';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  ArcElement,
  Legend
);

const Dash = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get('https://backangular-production.up.railway.app/get')
        .then((response) => setOrders(response.data))
        .catch((err) => console.error('Error fetching orders:', err));
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getOrderDate = (order) => {
    const timestamp = parseInt(order.order_id?.split('-')[1]) || Date.now();
    return new Date(timestamp);
  };

  const filteredOrders = orders; 

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce(
    (sum, order) => sum + (order.ordered_amount || 0),
    0
  );
  const totalClients = filteredOrders.reduce(
    (sum, order) => sum + (order.no_of_persons || 0),
    0
  );

  const orderTypes = {
    Served: 0,
    'Dine In': 0,
    'Take Away': 0,
  };

  const chefStats = {};
  const activeTables = new Set();
  const weekRevenue = [0, 0, 0, 0, 0, 0, 0]; // Sunday to Saturday

  filteredOrders.forEach((order) => {
    const type = (order.order_type || '').toLowerCase();
    if (type === 'served') orderTypes.Served++;
    else if (type === 'dine in') orderTypes['Dine In']++;
    else if (type === 'take away') orderTypes['Take Away']++;

    if (order.chef_assigned) {
      chefStats[order.chef_assigned] =
        (chefStats[order.chef_assigned] || 0) + 1;
    }

    if (order.table_no !== undefined && order.table_no !== null) {
      activeTables.add(order.table_no);
    }

    const day = getOrderDate(order).getDay();
    weekRevenue[day] += order.ordered_amount || 0;
  });

  const doughnutData = {
    labels: ['Served', 'Dine In', 'Take Away'],
    datasets: [
      {
        data: [
          orderTypes['Served'],
          orderTypes['Dine In'],
          orderTypes['Take Away'],
        ],
        backgroundColor: ['#4caf50', '#81c784', '#a5d6a7'],
        hoverBackgroundColor: ['#388e3c', '#66bb6a', '#81c784'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14 },
          color: '#333',
        },
      },
    },
  };

  const lineData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Revenue',
        data: weekRevenue,
        borderColor: '#4caf50',
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, beginAtZero: true },
    },
  };

  return (
    <div className={styles.dashboard}>
      {/* Top Cards */}
      <div className={styles.topCards}>
        <div className={styles.card}>
          <FaUserTie className={styles.icon} />
          <p>
            04
            <br />
            <small>Total Chef</small>
          </p>
        </div>
        <div className={styles.card}>
          <FaMoneyBillWave className={styles.icon} />
          <p>
            {totalRevenue.toFixed(2)}
            <br />
            <small>$ Total Revenue</small>
          </p>
        </div>
        <div className={styles.card}>
          <FaClipboardList className={styles.icon} />
          <p>
            {totalOrders}
            <br />
            <small>Total Orders</small>
          </p>
        </div>
        <div className={styles.card}>
          <FaUsers className={styles.icon} />
          <p>
            {totalClients}
            <br />
            <small>Total Clients</small>
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className={styles.middleSection}>
        {/* Order Summary */}
        <div className={styles.summaryBox}>
          <div className={styles.boxHeader}>Order Summary</div>
          {Object.values(orderTypes).some((count) => count > 0) ? (
            <Doughnut data={doughnutData} options={doughnutOptions} />
          ) : (
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              No order data
            </p>
          )}
        </div>

        {/* Revenue */}
        <div className={styles.summaryBox}>
          <div className={styles.boxHeader}>Revenue</div>
          <Line data={lineData} options={lineOptions} />
        </div>

        {/* Tables */}
        <div className={styles.summaryBox}>
          <div className={styles.boxHeader}>Tables</div>
          <div className={styles.tableGrid}>
            {Array.from({ length: 36 }, (_, i) => {
              const tableNumber = i + 1;
              const isActive = activeTables.has(tableNumber);
              return (
                <div
                  className={styles.tableItem}
                  key={tableNumber}
                  style={{
                    backgroundColor: isActive ? '#81c784' : 'black',
                    color: '#fff',
                  }}
                >
                  {tableNumber}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chef Stats Table */}
      <div className={styles.tableSection}>
        <table>
          <thead>
            <tr>
              <th>Chef Name</th>
              <th>Order Taken</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(chefStats).map(([chef, count]) => (
              <tr key={chef}>
                <td>{chef}</td>
                <td>{count.toString().padStart(2, '0')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dash;
