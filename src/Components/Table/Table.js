import React, { useState, useEffect } from 'react';
import styles from './Table.module.css';

const Table = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [chairs, setChairs] = useState(3);


  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await fetch('http://localhost:8000/get');
        const data = await response.json();

        const uniqueTables = [];
        const seen = new Set();

        data.forEach((order) => {
          if (!seen.has(order.table_no)) {
            seen.add(order.table_no);
            uniqueTables.push({
              id: order.table_no,
              name: `Table ${order.table_no}`,
              chairs: order.no_of_persons || 4,
              status: order.order_status === 'Done' ? 'inactive' : 'active',
            });
          }
        });

        setTables(uniqueTables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    };

    fetchTables();
  }, []);

  const handleTableClick = (table) => {
    setSelectedTable(table);
    setShowForm(false);
  };

  const handleAddClick = () => {
    setShowForm(true);
    setSelectedTable(null);
    setChairs(3);
  };

  const handleCreate = () => {
    const newId = tables.length + 1;
    const newTable = {
      id: newId,
      name: `Table ${newId}`,
      chairs,
      status: 'inactive',
    };
    setTables([...tables, newTable]);
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {tables.map((table) => (
          <div
            key={table.id}
            className={`${styles.tableCard} ${styles[table.status]}`}
            onClick={() => handleTableClick(table)}
          >
            <h4>{table.name}</h4>
            <small> {table.chairs} chair</small>
          </div>
        ))}
        <div className={`${styles.tableCard} ${styles.addCard}`} onClick={handleAddClick}>
          +
        </div>
      </div>

      {selectedTable && (
        <div className={styles.details}>
          <h3>{selectedTable.name}</h3>
          <p><strong>Chairs:</strong> {selectedTable.chairs}</p>
          <p><strong>Status:</strong> {selectedTable.status}</p>
        </div>
      )}

      {showForm && (
        <div className={styles.form}>
          <h3>Add New Table</h3>
          <p>Table Name: Table {tables.length + 1}</p>
          <label>
            Chairs:
            <input
              type="number"
              min="1"
              value={chairs}
              onChange={(e) => setChairs(Number(e.target.value))}
            />
          </label>
          <button onClick={handleCreate}>Create</button>
        </div>
      )}
    </div>
  );
};

export default Table;
