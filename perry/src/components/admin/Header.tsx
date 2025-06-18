import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.scss';
import { ADMIN_TOKEN, clearAuth } from '@/utils/auth/authToken';
import LogoIcon from "@/assets/icons/logo.svg";
import UsersIcon from "@/assets/icons/users.svg";
import CategoryIcon from "@/assets/icons/category.svg";
import ProductsIcon from "@/assets/icons/products.svg";
import OrdersIcon from "@/assets/icons/orders.svg";
import ReviewsIcon from "@/assets/icons/reviews.svg";
import ExitIcon from "@/assets/icons/exit.svg";


export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration-eps10_268834-1920.jpg?semt=ais_hybrid&w=740');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/account/users/me`, {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error('Ошибка при получении данных пользователя');
        }

        const data = await response.json();
        setUserName(`${data.firstName} ${data.lastName}`);
        if (data.imageUrl) {
          setUserImage(data.imageUrl);
        }
      } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearAuth();
    setIsMenuOpen(false);
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    return location.pathname === `/admin/${path}`;
  };

  return (
    <header className="admin-header">
      <div className="admin-header__content">
        <div className="admin-header__left">
          <button 
            className={`admin-header__menu-button ${isMenuOpen ? 'admin-header__menu-button--active' : ''}`}
            onClick={handleMenuClick}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 10H26" stroke="#F2F4F8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 16H26" stroke="#F2F4F8" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 22H26" stroke="#F2F4F8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <div className="admin-header__logo">
            <img src={LogoIcon} alt="Amazon Logo" />
          </div>
        </div>
      </div>
      <div className={`admin-header__menu ${isMenuOpen ? 'admin-header__menu--open' : ''}`}>
        <div className="admin-header__menu-content">
          <div className="admin-header__profile">
            <div className="admin-header__profile-image">
              <img src={userImage} alt="Admin profile" />
            </div>
            <div className="admin-header__profile-info">
              <h2 className="admin-header__profile-name">{userName}</h2>
              <p className="admin-header__profile-role">Administrator</p>
            </div>
          </div>
          <div className="admin-header__divider" />
          <nav className="admin-header__nav">
            <Link 
              to="/admin/users" 
              className={`admin-header__nav-item ${isActive('users') ? 'admin-header__nav-item--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={UsersIcon} alt="Users" width="32" height="32" />
              Users
            </Link>
            <Link 
              to="/admin/category" 
              className={`admin-header__nav-item ${isActive('category') ? 'admin-header__nav-item--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={CategoryIcon} alt="Category" width="32" height="32" />
              Category
            </Link>
            <Link 
              to="/admin/products" 
              className={`admin-header__nav-item ${isActive('products') ? 'admin-header__nav-item--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={ProductsIcon} alt="Products" width="32" height="32" />
              Products
            </Link>
            <Link 
              to="/admin/orders" 
              className={`admin-header__nav-item ${isActive('orders') ? 'admin-header__nav-item--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={OrdersIcon} alt="Orders" width="32" height="32" />
              Orders
            </Link>
            <Link 
              to="/admin/reviews" 
              className={`admin-header__nav-item ${isActive('reviews') ? 'admin-header__nav-item--active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <img src={ReviewsIcon} alt="Reviews" width="32" height="32" />
              Reviews
            </Link>
          </nav>
          <button className="admin-header__logout" onClick={handleLogout}>
            <img src={ExitIcon} alt="Log out" width="32" height="32" />
            Log out
          </button>
        </div>
      </div>
      {isMenuOpen && <div className="admin-header__overlay" onClick={handleMenuClick} />}
    </header>
  );
}; 