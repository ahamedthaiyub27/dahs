// src/Components/Cards/Cards.js
import React, { useEffect, useState } from 'react';
import styles from './Cards.module.css';
import { FaPlus, FaStar, FaFire, FaUtensils, FaTimes } from 'react-icons/fa';

const Cards = () => {
  const [menudata, setMenudata] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const fetchdatamenu = async () => {
    try {
      const res = await fetch('https://backangular-production.up.railway.app/menu/allmenu');
      const data = await res.json();
      setMenudata(data);
    } catch (error) {
      console.error('Error fetching menu data:', error);
    }
  };

  useEffect(() => {
    fetchdatamenu();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const response = await fetch('https://backangular-production.up.railway.app/menu/postmenu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        const addedItem = await response.json();
        setMenudata([...menudata, addedItem]);
        setNewItem({ name: '', description: '', price: '', category: '', image: '' });
        setShowForm(false);
        fetchdatamenu(); // Refresh menu
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to add item'}`);
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
      alert('Error adding menu item. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className={styles.topBar}>
        <button className={styles.addMenuButton} onClick={() => setShowForm(true)}>
          <FaUtensils className={styles.addMenuIcon} />
          Add Menu Item
        </button>
      </div>

      {showForm && (
        <div className={styles.formOverlay}>
          <div className={styles.addForm}>
            <button className={styles.closeButton} onClick={() => setShowForm(false)}>
              <FaTimes />
            </button>
            <h2>Add New Menu Item</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Name*</label>
                <input
                  type="text"
                  name="name"
                  value={newItem.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={newItem.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Price*</label>
                <input
                  type="number"
                  name="price"
                  value={newItem.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Category*</label>
                <select
                  name="category"
                  value={newItem.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="pizza">Pizza</option>
                  <option value="Burger">Burger</option>
                  <option value="desserts">Desserts</option>
                  <option value="Sushi">Sushi</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={newItem.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className={styles.formFooter}>
                <p>* Required fields</p>
                <button type="submit" className={styles.submitButton} disabled={isAdding}>
                  {isAdding ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.overallcard}>
        {menudata.map((data) => (
          <div className={styles.overall} key={data._id}>
            <div className={styles.imageContainer}>
              <img
                src={data.image || '/default-food.png'}
                className={styles.image}
                alt={data.name}
                onError={(e) => (e.target.src = '/default-food.png')}
              />
            </div>
            <div className={styles.content}>
              <h1 className={styles.title}>{data.name}</h1>
              <p className={styles.category}>{data.category}</p>
              <p className={styles.description}>{data.description}</p>
              <div className={styles.pricecontent}>
                <p className={styles.price}>${data.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Cards;
