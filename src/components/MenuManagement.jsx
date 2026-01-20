import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminNavbar from "./AdminNavbar";
import { fetchFoodItems, updateFoodItem } from "../redux/foodSlice";
import { useNavigate } from "react-router-dom";

import menu1 from '../images/ButterChicken.webp';
import menu2 from '../images/paneer-tikka.jpg';
import menu3 from '../images/Chicken-Biryani.jpg';
import menu4 from '../images/Masala-Dosa.avif';
import menu5 from '../images/Veg-pulao.jpg';
import menu6 from '../images/Chocolate-Donut.jpg';

const foodImages = {
  "Butter Chicken": menu1,
  "Paneer Tikka": menu2,
  "Chicken Biryani": menu3,
  "Masala Dosa": menu4,
  "Veg Pulao": menu5,
  "Chocolate Donut": menu6,
};

function MenuManagement() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.food);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [editingItemId, setEditingItemId] = useState(null);
  const [editedValues, setEditedValues] = useState({});

  // 🔒 Authorization check just like in WaiterManagement.jsx
  useEffect(() => {
    if (!user || user.role !== 'owner') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    dispatch(fetchFoodItems());
  }, [dispatch]);

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setEditedValues({ price: item.price, description: item.description });
  };

  const handleCancel = () => {
    setEditingItemId(null);
    setEditedValues({});
  };

  const handleSave = (itemId) => {
    dispatch(updateFoodItem({ id: itemId, updates: editedValues }));
    setEditingItemId(null);
    setEditedValues({});
  };

  const handleChange = (e) => {
    setEditedValues({ ...editedValues, [e.target.name]: e.target.value });
  };

  const handleToggleAvailability = (itemId, currentStatus) => {
    dispatch(updateFoodItem({ id: itemId, updates: { isAvailable: !currentStatus } }));
  };

  return (
    <div style={{ backgroundColor: 'black', minHeight: '100vh', paddingBottom: '3rem' }}>
      <AdminNavbar />
      <div className="container mt-5">
        <h2 className="text-center text-danger mb-4 fw-bold">Menu Management</h2>

        {loading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="row justify-content-center g-4">
          {items.map((item) => (
            <div className="col-md-4 d-flex justify-content-center" key={item.id}>
              <div className="card text-white bg-dark" style={{ width: '18rem' }}>
                <img
                  src={foodImages[item.name] || ''}
                  className="card-img-top"
                  alt={item.name}
                  style={{ height: '140px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">
                    {item.name} – ₹
                    {editingItemId === item.id ? (
                      <input
                        type="number"
                        className="form-control mt-2"
                        name="price"
                        value={editedValues.price}
                        onChange={handleChange}
                      />
                    ) : (
                      item.price
                    )}
                  </h5>

                  {editingItemId === item.id ? (
                    <textarea
                      className="form-control my-2"
                      name="description"
                      value={editedValues.description}
                      onChange={handleChange}
                    />
                  ) : (
                    <p className="card-text">{item.description}</p>
                  )}

                  {editingItemId === item.id ? (
                    <>
                      <button className="btn btn-success me-2" onClick={() => handleSave(item.id)}>Save</button>
                      <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn btn-primary me-2" onClick={() => handleEdit(item)}>Edit</button>
                      <button
                        className={`btn ${item.isAvailable ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleToggleAvailability(item.id, item.isAvailable)}
                      >
                        {item.isAvailable ? 'Disable' : 'Enable'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuManagement;





