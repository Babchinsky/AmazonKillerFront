import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/admin/Header';
import './AdminLayout.scss';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <Header />
      <main className="admin-layout__content">
        <Outlet />
      </main>
    </div>
  );
}; 