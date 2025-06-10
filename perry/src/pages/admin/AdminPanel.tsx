import React from 'react';
import { CategoryPanel } from '../../components/admin/CategoryPanel';
import { Header } from '../../components/admin/Header';
import './AdminPanel.scss';

export const AdminPanel: React.FC = () => {
  return (
    <div className="admin-panel">
      <Header />
      <div className="admin-panel__content">
        <CategoryPanel />
      </div>
    </div>
  );
};

export default AdminPanel; 