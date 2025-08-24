import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
// import './App.css'; // This line is removed as the CSS is now embedded
import { User, Store, Lock, LogIn, LogOut, Plus, Search, Filter, SortAsc, SortDesc, Trash, Home as HomeIcon, Star, List, Settings, ArrowLeft } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// =======================
// NEW: Styles Component with Enhanced Animations
// =======================
const GlobalStyles = () => {
    return (
        <style>{`
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #eef1f5;
              color: #333;
            }

            .main-content {
              padding: 2rem;
              max-width: 1200px;
              margin: 0 auto;
            }

            .nav {
              background-color: #2c3e50;
              color: #ecf0f1;
              padding: 1rem 2rem;
              display: flex;
              justify-content: space-between;
              align-items: center;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .nav-title {
              font-size: 1.5rem;
              font-weight: bold;
              margin: 0;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }

            .nav-logout-btn {
              background-color: #e74c3c;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 20px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              transition: background-color 0.3s ease, transform 0.2s ease;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            .nav-logout-btn:hover {
              background-color: #c0392b;
              transform: scale(1.05);
            }

            .container {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }

            .form-container {
              background-color: #ffffff;
              padding: 3rem;
              border-radius: 10px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
              width: 100%;
              max-width: 450px;
              animation: fadeIn 0.5s ease-in-out;
            }

            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(-20px); }
              to { opacity: 1; transform: translateY(0); }
            }

            .form-title {
              text-align: center;
              font-size: 2.2rem;
              font-weight: bold;
              margin-bottom: 2rem;
              color: #2c3e50;
            }

            .form-group {
              margin-bottom: 1.5rem;
            }

            .form-label {
              display: block;
              font-weight: 600;
              margin-bottom: 0.5rem;
              color: #555;
            }

            .form-input {
              width: 100%;
              padding: 0.9rem 1.2rem;
              border: 1px solid #ddd;
              border-radius: 5px;
              box-sizing: border-box;
              font-size: 1rem;
              transition: border-color 0.3s ease, box-shadow 0.3s ease;
            }

            .form-input:focus {
              outline: none;
              border-color: #3498db;
              box-shadow: 0 0 8px rgba(52, 152, 219, 0.6);
            }

            .form-submit-btn {
              width: 100%;
              padding: 1rem;
              border: none;
              border-radius: 25px;
              font-size: 1.1rem;
              font-weight: bold;
              cursor: pointer;
              color: white;
              background-color: #3498db;
              transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .form-submit-btn:hover {
              background-color: #2980b9;
              transform: translateY(-3px);
            }

            .register-btn {
              background-color: #2ecc71;
            }

            .register-btn:hover {
              background-color: #27ae60;
            }

            .form-link-text {
              text-align: center;
              margin-top: 1.5rem;
              color: #777;
            }

            .form-link {
              color: #3498db;
              text-decoration: none;
              font-weight: 600;
              transition: color 0.2s ease;
            }
            .form-link:hover {
              color: #2980b9;
            }

            .error-message {
              color: #e74c3c;
              text-align: center;
              margin-bottom: 1rem;
              background-color: #fce7e7;
              padding: 0.75rem;
              border-radius: 5px;
              border: 1px solid #e74c3c;
            }

            .success-message {
              color: #2ecc71;
              text-align: center;
              margin-bottom: 1rem;
              background-color: #e7f7e7;
              padding: 0.75rem;
              border-radius: 5px;
              border: 1px solid #2ecc71;
            }

            .dashboard-container {
              padding: 2rem;
              background-color: #eef1f5;
              border-radius: 10px;
            }

            .dashboard-title {
              font-size: 2.5rem;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 2rem;
              text-align: center;
            }

            .dashboard-tabs {
              display: flex;
              gap: 1rem;
              margin-bottom: 2rem;
              justify-content: center;
              flex-wrap: wrap; 
            }

            .tab-btn {
              background-color: #f8f9fa;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 20px;
              cursor: pointer;
              transition: background-color 0.3s ease, color 0.3s ease, transform 0.2s ease;
              font-weight: 600;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }

            .tab-btn:hover {
              background-color: #e0e4e8;
              transform: translateY(-2px);
            }

            .tab-btn.active {
              background-color: #3498db;
              color: white;
              box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
            }

            .stat-card {
              background-color: #ffffff;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .stat-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
            }

            .stat-title {
              font-size: 1.1rem;
              color: #7f8c8d;
              margin-bottom: 0.5rem;
            }

            .stat-value {
              font-size: 3rem;
              font-weight: bold;
              color: #2c3e50;
            }

            .dashboard-stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 1.5rem;
            }

            .list-container {
              background-color: #ffffff;
              padding: 2rem;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              margin-top: 2rem;
              animation: fadeIn 0.5s ease-in-out;
            }

            .list-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .add-btn {
                background-color: #2ecc71;
                color: white;
                border: none;
                padding: 0.6rem 1.2rem;
                border-radius: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-weight: bold;
                transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .add-btn:hover {
                background-color: #27ae60;
                transform: scale(1.05);
            }

            .list-title {
              font-size: 1.8rem;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 1rem;
            }

            .list-filter-input {
              width: 100%;
              padding: 0.9rem 1.2rem;
              border: 1px solid #ddd;
              border-radius: 5px;
              margin-bottom: 1.5rem;
              font-size: 1rem;
            }

            .data-table {
              width: 100%;
              border-collapse: collapse;
            }

            .data-table th,
            .data-table td {
              padding: 1rem;
              text-align: left;
              border-bottom: 1px solid #eee;
            }

            .table-header {
              background-color: #f8f9fa;
              cursor: pointer;
              font-weight: bold;
              color: #555;
              transition: background-color 0.2s ease;
            }

            .table-header:hover {
              background-color: #eef1f5;
            }

            .table-row {
                transition: background-color 0.2s ease;
            }
            .table-row:hover {
              background-color: #f0f4f8;
            }

            .table-cell {
              color: #555;
            }

            .dashboard-actions {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 1.5rem;
              flex-wrap: wrap; 
            }

            .search-input {
              flex: 1;
              padding: 0.9rem 1.2rem;
              border: 1px solid #ddd;
              border-radius: 5px;
              margin-right: 1rem;
              font-size: 1rem;
            }

            .filter-sort-group {
              display: flex;
              gap: 1rem;
              align-items: center;
              flex-wrap: wrap;
            }

            .sort-select {
              padding: 0.75rem;
              border: 1px solid #ddd;
              border-radius: 5px;
            }

            .password-btn {
              background-color: #95a5a6;
              color: white;
              border: none;
              padding: 0.75rem 1rem;
              border-radius: 5px;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 0.5rem;
              font-weight: bold;
              transition: background-color 0.3s ease, transform 0.2s ease;
            }
            .password-btn:hover {
                background-color: #7f8c8d;
                transform: scale(1.05);
            }

            .update-password-form {
              background-color: #ffffff;
              padding: 1.5rem;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              margin-bottom: 1.5rem;
              animation: fadeIn 0.5s ease-in-out;
            }

            .form-subtitle {
              font-size: 1.5rem;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 1rem;
            }

            .store-list-grid {
              display: flex;
              flex-direction: column;
              gap: 1.5rem;
            }

            .store-card {
              background-color: #ffffff;
              padding: 1.5rem;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              border-left: 5px solid #3498db;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .store-card:hover {
              transform: translateY(-8px);
              box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
            }

            .store-name {
              font-size: 1.5rem;
              font-weight: bold;
              color: #2c3e50;
            }

            .store-address {
              color: #7f8c8d;
              font-size: 0.9rem;
              margin-top: 0.25rem;
            }

            .store-rating-overall {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-top: 1rem;
              color: #7f8c8d;
            }

            .rating-label {
              font-weight: 600;
            }

            .star-icon {
              color: #ccc;
              cursor: pointer;
              transition: color 0.2s ease, transform 0.2s ease;
            }
            .star-icon:hover {
                transform: scale(1.2);
            }

            .star-icon.filled {
              color: #f1c40f;
            }

            .store-rating-user {
              margin-top: 1rem;
            }

            .star-rating-icons {
              display: flex;
              gap: 0.25rem;
              margin-top: 0.5rem;
            }

            .owner-dashboard-content {
              background-color: #ffffff;
              padding: 1.5rem;
              border-radius: 10px;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
              animation: fadeIn 0.5s ease-in-out;
            }

            .content-title {
              font-size: 1.8rem;
              font-weight: bold;
              color: #2c3e50;
            }

            .content-text {
              margin-top: 0.5rem;
              color: #555;
              font-size: 1.2rem;
            }

            .content-subtitle {
              font-size: 1.4rem;
              font-weight: bold;
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
              color: #2c3e50;
            }

            .ratings-list {
              list-style: none;
              padding: 0;
              margin: 0;
            }

            .ratings-list-item {
              border-bottom: 1px solid #eee;
              padding: 0.75rem 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .rating-user-name {
              font-weight: 600;
              color: #555;
            }

            .rating-value {
              font-weight: bold;
              color: #3498db;
            }

            .not-found-message {
              text-align: center;
              font-size: 2rem;
              color: #e74c3c;
              margin-top: 5rem;
            }

            .app-rating-container {
                background-color: #fff;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                text-align: center;
                margin-bottom: 2rem;
            }

            .app-rating-title {
                font-size: 1.5rem;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 1rem;
            }

            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.6);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }

            .modal-content {
                background-color: #fff;
                padding: 2rem;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 500px;
                animation: fadeIn 0.3s ease-in-out;
            }

            .modal-title {
                font-size: 1.8rem;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 1.5rem;
            }

            .modal-actions {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 2rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border-radius: 25px;
                border: none;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease, transform 0.2s ease;
            }

            .btn-primary {
                background-color: #3498db;
                color: white;
            }
            .btn-primary:hover {
                background-color: #2980b9;
                transform: translateY(-2px);
            }
            .btn-primary:disabled {
                background-color: #a9cce3;
                cursor: not-allowed;
            }

            .btn-secondary {
                background-color: #ecf0f1;
                color: #333;
            }
            .btn-secondary:hover {
                background-color: #bdc3c7;
            }


            @media (max-width: 768px) {
              .dashboard-actions {
                flex-direction: column;
                align-items: stretch;
              }
              
              .filter-sort-group {
                flex-direction: column;
                align-items: stretch;
              }

              .search-input {
                margin-right: 0;
                margin-bottom: 1rem;
              }

              .sort-select {
                width: 100%;
                margin-bottom: 1rem;
              }

              .password-btn {
                width: 100%;
              }

              .store-card {
                padding: 1rem;
              }

              .nav {
                flex-direction: column;
                gap: 1rem;
              }
            }
        `}</style>
    );
};

// =======================
// Shared Components
// =======================

const Nav = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };
  return (
    <nav className="nav">
      <h1 className="nav-title">Store Ratings Management System</h1>
      <div className="nav-actions">
        {localStorage.getItem('token') && (
          <button onClick={handleLogout} className="nav-logout-btn">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (userRole !== role) {
      navigate('/unauthorized');
    }
  }, [token, userRole, navigate, role]);

  return token && userRole === role ? children : null;
};


// =======================
// NEW: Add Store Modal Component
// =======================
const AddStoreModal = ({ onClose, onStoreAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        ownerId: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await axios.post(`${API_URL}/admin/add-store`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onStoreAdded(); // This will refresh the store list in the dashboard
            onClose(); // This will close the modal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add store.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Add New Store</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Store Name</label>
                        <input type="text" name="name" onChange={handleChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Store Email</label>
                        <input type="email" name="email" onChange={handleChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Store Address</label>
                        <input type="text" name="address" onChange={handleChange} className="form-input" required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Owner ID (Optional)</label>
                        <input type="text" name="ownerId" onChange={handleChange} className="form-input" placeholder="Enter a User ID for the owner" />
                    </div>
                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Adding...' : 'Add Store'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


// =======================
// Auth Pages
// =======================

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId); // Store userId for later use
      switch (response.data.role) {
        case 'Admin':
          navigate('/admin/dashboard');
          break;
        case 'Normal User':
          navigate('/user/dashboard');
          break;
        case 'Store Owner':
          navigate('/store-owner/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="form-container">
        <h2 className="form-title">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" required />
        </div>
        <button type="submit" className="form-submit-btn">Login</button>
        <p className="form-link-text">
          New user? <Link to="/register" className="form-link">Register</Link>
        </p>
      </form>
    </div>
  );
};

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);
      setSuccess(response.data.message);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} className="form-container">
        <h2 className="form-title">Register as a Normal User</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="form-group">
          <label className="form-label">Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label className="form-label">Address</label>
          <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-input" required />
        </div>
        <button type="submit" className="form-submit-btn register-btn">Register</button>
        <p className="form-link-text">
          Already have an account? <Link to="/login" className="form-link">Login</Link>
        </p>
      </form>
    </div>
  );
};

// =======================
// Admin Dashboard (MODIFIED)
// =======================

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalStores, setTotalStores] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const token = localStorage.getItem('token');

  const fetchDashboardData = async () => {
    const res = await axios.get(`${API_URL}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
    setTotalUsers(res.data.totalUsers);
    setTotalStores(res.data.totalStores);
    setTotalRatings(res.data.totalRatings);
  };

  const fetchUsers = async (filter = '', sort = '') => {
    const res = await axios.get(`${API_URL}/admin/users`, {
      params: { filter, sort },
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const fetchStores = async (filter = '', sort = '') => {
    const res = await axios.get(`${API_URL}/admin/stores`, {
      params: { filter, sort },
      headers: { Authorization: `Bearer ${token}` },
    });
    setStores(res.data);
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardData();
    } else if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'stores') {
      fetchStores();
    }
  }, [activeTab]);


  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <div className="dashboard-tabs">
        <button onClick={() => setActiveTab('dashboard')} className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}>Dashboard</button>
        <button onClick={() => setActiveTab('users')} className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}>Users</button>
        <button onClick={() => setActiveTab('stores')} className={`tab-btn ${activeTab === 'stores' ? 'active' : ''}`}>Stores</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3 className="stat-title">Total Users</h3>
            <p className="stat-value">{totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Total Stores</h3>
            <p className="stat-value">{totalStores}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-title">Total Ratings</h3>
            <p className="stat-value">{totalRatings}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UserList users={users} onFilter={fetchUsers} onSort={fetchUsers} />
      )}

      {activeTab === 'stores' && (
        <StoreList 
            stores={stores} 
            onFilter={fetchStores} 
            onSort={fetchStores}
            onAddStoreClick={() => setIsModalOpen(true)} // Pass handler to open modal
        />
      )}
      
      {/* Conditionally render the modal */}
      {isModalOpen && <AddStoreModal onClose={() => setIsModalOpen(false)} onStoreAdded={fetchStores} />}
    </div>
  );
};

const UserList = ({ users, onFilter, onSort }) => {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    onFilter(filter);
  }, [filter]);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    onSort('', `${field}:${direction}`);
  };

  return (
    <div className="list-container">
      <h3 className="list-title">Users</h3>
      <input
        type="text"
        placeholder="Filter by Name, Email, Address, Role"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="list-filter-input"
      />
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="table-header">Name</th>
            <th onClick={() => handleSort('email')} className="table-header">Email</th>
            <th onClick={() => handleSort('address')} className="table-header">Address</th>
            <th onClick={() => handleSort('role')} className="table-header">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="table-row">
              <td className="table-cell">{user.name}</td>
              <td className="table-cell">{user.email}</td>
              <td className="table-cell">{user.address}</td>
              <td className="table-cell">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StoreList = ({ stores, onFilter, onSort, onAddStoreClick }) => {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    onFilter(filter);
  }, [filter]);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
    onSort('', `${field}:${direction}`);
  };

  return (
    <div className="list-container">
        <div className="list-header">
            <h3 className="list-title">Stores</h3>
            <button onClick={onAddStoreClick} className="add-btn">
                <Plus size={16} /> Add New Store
            </button>
        </div>
      <input
        type="text"
        placeholder="Filter by Name, Email, Address"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="list-filter-input"
      />
      <table className="data-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="table-header">Name</th>
            <th onClick={() => handleSort('email')} className="table-header">Email</th>
            <th onClick={() => handleSort('address')} className="table-header">Address</th>
            <th onClick={() => handleSort('overallRating')} className="table-header">Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id} className="table-row">
              <td className="table-cell">{store.name}</td>
              <td className="table-cell">{store.email}</td>
              <td className="table-cell">{store.address}</td>
              <td className="table-cell">{store.overallRating.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// =======================
// Normal User Dashboard
// =======================

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('name:asc');
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchStores();
  }, [filter, sort]);

  const fetchStores = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/stores`, {
        params: { filter, sort },
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const handleRate = async (storeId, rating) => {
    try {
      await axios.post(`${API_URL}/user/rate-store/${storeId}`, { rating }, { headers: { Authorization: `Bearer ${token}` } });
      fetchStores();
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/user/update-password`, { newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Password updated successfully!');
      setShowUpdatePassword(false);
      setNewPassword('');
      setPasswordError('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Password update failed.');
    }
  };
  
  // This is the new section that allows the user to rate the app itself
  const handleAppRating = async (rating) => {
      // In a real application, you would send this to a new backend endpoint
      alert(`Thank you for rating the app ${rating} stars!`);
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">User Dashboard</h1>
      <div className="dashboard-actions">
        <input
          type="text"
          placeholder="Search stores by name or address"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="search-input"
        />
        <div className="filter-sort-group">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
            <option value="name:asc">Name (A-Z)</option>
            <option value="name:desc">Name (Z-A)</option>
            <option value="overallRating:desc">Rating (High to Low)</option>
            <option value="overallRating:asc">Rating (Low to High)</option>
          </select>
          <button onClick={() => setShowUpdatePassword(!showUpdatePassword)} className="password-btn">
            <Lock size={16} />
            <span>Update Password</span>
          </button>
        </div>
      </div>

      {showUpdatePassword && (
        <form onSubmit={handleUpdatePassword} className="update-password-form">
          <h3 className="form-subtitle">Update Password</h3>
          {passwordError && <p className="error-message">{passwordError}</p>}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" required />
          </div>
          <button type="submit" className="form-submit-btn">Update</button>
        </form>
      )}

      {/* New App Rating Section */}
      <div className="app-rating-container">
        <h3 className="app-rating-title">Rate the App</h3>
        <div className="star-rating-icons">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={`app-star-${star}`}
              size={32}
              className="star-icon"
              onClick={() => handleAppRating(star)}
            />
          ))}
        </div>
      </div>
      {/* End of new section */}

      <div className="store-list-grid">
        {stores.map(store => (
          <div key={store.id} className="store-card">
            <h3 className="store-name">{store.name}</h3>
            <p className="store-address">{store.address}</p>
            <p className="store-rating-overall">
              <span className="rating-label">Overall Rating:</span>
              <Star size={16} className="star-icon filled" />
              <span>{store.overallRating ? store.overallRating.toFixed(1) : 'No Ratings'}</span>
            </p>
            <div className="store-rating-user">
              <p className="rating-label">Your Rating:</p>
              <div className="star-rating-icons">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    size={24}
                    className={`star-icon ${store.ratings && store.ratings.length > 0 && store.ratings[0].rating >= star ? 'filled' : 'empty'}`}
                    onClick={() => handleRate(store.id, star)}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =======================
// Store Owner Dashboard
// =======================

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`${API_URL}/store-owner/dashboard`, { headers: { Authorization: `Bearer ${token}` } });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/store-owner/update-password`, { newPassword }, { headers: { Authorization: `Bearer ${token}` } });
      alert('Password updated successfully!');
      setShowUpdatePassword(false);
      setNewPassword('');
      setPasswordError('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Password update failed.');
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Store Owner Dashboard</h1>
      <div className="dashboard-actions justify-end">
        <button onClick={() => setShowUpdatePassword(!showUpdatePassword)} className="password-btn">
          <Lock size={16} />
          <span>Update Password</span>
        </button>
      </div>

      {showUpdatePassword && (
        <form onSubmit={handleUpdatePassword} className="update-password-form">
          <h3 className="form-subtitle">Update Password</h3>
          {passwordError && <p className="error-message">{passwordError}</p>}
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-input" required />
          </div>
          <button type="submit" className="form-submit-btn">Update</button>
        </form>
      )}

      {dashboardData && (
        <div className="owner-dashboard-content">
          <h3 className="content-title">Your Store's Performance</h3>
          <p className="content-text">Average Rating: {dashboardData.averageRating ? dashboardData.averageRating.toFixed(1) : 'No Ratings Yet'}</p>
          <h4 className="content-subtitle">User Ratings</h4>
          <ul className="ratings-list">
            {dashboardData.ratings.map(rating => (
              <li key={rating.id} className="ratings-list-item">
                <span className="rating-user-name">{rating.user.name}</span> rated it <span className="rating-value">{rating.rating}</span> stars.
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// =======================
// Main App Component
// =======================

const App = () => {
  return (
    <Router>
      <GlobalStyles />
      <Nav />
      <div className="main-content">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/user/dashboard" element={<ProtectedRoute role="Normal User"><UserDashboard /></ProtectedRoute>} />
          <Route path="/store-owner/dashboard" element={<ProtectedRoute role="Store Owner"><StoreOwnerDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<div className="not-found-message">404 - Page Not Found</div>} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      navigate(`/${role.toLowerCase().replace(' ', '-')}/dashboard`);
    } else {
      navigate('/login');
    }
  }, [navigate]);
  return null;
};

export default App;  