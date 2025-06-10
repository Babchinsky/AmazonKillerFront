import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UsersPanel.scss';
import { SearchIcon, ArrowDownIcon, ArrowsUpDownIcon, MoreIcon } from '../../icons';
import { ConfirmModal } from '../common/ConfirmModal';
import { ADMIN_TOKEN, REFRESH_TOKEN } from '../../utils/authToken';

interface User {
  id: number;
  name: string;
  role: 'Administrator' | 'Customer';
  status: 'active' | 'deleted';
  date: string;
  email: string;
  avatar: string;
}

type Role = 'All' | 'Administrator' | 'Customer';

interface DropdownState {
  isOpen: boolean;
  userId: number | null;
  position?: { top: number; left: number };
}

interface ModalState {
  isOpen: boolean;
  message: string;
  action: () => void;
  type: 'delete' | 'redirect';
}

interface ColumnVisibility {
  status: boolean;
  registrationDate: boolean;
  email: boolean;
}

export const UsersPanel: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>('All');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isColumnsDropdownOpen, setIsColumnsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownMenu, setDropdownMenu] = useState<DropdownState>({ isOpen: false, userId: null });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    status: true,
    registrationDate: true,
    email: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const itemsPerPage = 10;

  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    message: '',
    action: () => {},
    type: 'redirect'
  });

  const filteredUsers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return users.filter(user => {
      const roleMatch = selectedRole === 'All' || user.role === selectedRole;
      const searchMatch = 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      return roleMatch && searchMatch;
    });
  }, [selectedRole, searchQuery, users]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDropdownOpen(false);
  };

  const toggleColumn = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const getGridTemplateColumns = () => {
    let template = '2fr';
    if (columnVisibility.status) template += ' 1fr';
    if (columnVisibility.registrationDate) template += ' 1.5fr';
    if (columnVisibility.email) template += ' 1.5fr';
    template += ' 48px';
    return template;
  };

  const handleMoreClick = (userId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setDropdownMenu(prev => ({
      isOpen: prev.userId === userId ? !prev.isOpen : true,
      userId: userId,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      }
    }));
  };

  const handleRoleChange = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newRole = user.role === 'Administrator' ? 'Customer' : 'Administrator';
      setModal({
        isOpen: true,
        message: `This user will ${user.role === 'Administrator' ? 'lose administrator privileges' : 'become an administrator'}.`,
        action: async () => {
          try {
            if (user.role === 'Administrator') {
              await demoteUser(user.id.toString());
            } else {
              await promoteUser(user.id.toString());
            }
            setUsers(prevUsers => 
              prevUsers.map(u => 
                u.id.toString() === userId.toString() ? { ...u, role: newRole } : u
              )
            );
          } catch (error) {
            console.error('Ошибка при изменении роли пользователя:', error);
          }
          setDropdownMenu({ isOpen: false, userId: null });
        },
        type: 'redirect'
      });
    }
  };

  const handleStatusChange = (userId: string) => {
    const user = users.find(u => u.id.toString() === userId);
    if (user) {
      const newStatus = user.status === 'active' ? 'deleted' : 'active';
      setModal({
        isOpen: true,
        message: `Are you sure you want to ${user.status === 'active' ? 'delete' : 'restore'} this user?`,
        action: async () => {
          try {
            if (user.status === 'active') {
              await deleteUser(userId);
            } else {
              await restoreUser(userId);
            }
            setUsers(prevUsers => 
              prevUsers.map(u => 
                u.id.toString() === userId ? { ...u, status: newStatus } : u
              )
            );
          } catch (error) {
            console.error('Ошибка при изменении статуса пользователя:', error);
          }
          setModal(prev => ({ ...prev, isOpen: false }));
        },
        type: 'redirect'
      });
    }
  };

  const handleViewOrders = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setModal({
        isOpen: true,
        message: 'You will be redirected to user orders page.',
        action: () => {
          navigate(`/admin/orders?search=${encodeURIComponent(user.email)}`);
          setDropdownMenu({ isOpen: false, userId: null });
        },
        type: 'redirect'
      });
    }
  };

  const handleViewReviews = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setModal({
        isOpen: true,
        message: 'You will be redirected to user reviews page.',
        action: () => {
          navigate(`/admin/reviews?search=${encodeURIComponent(user.email)}`);
          setDropdownMenu({ isOpen: false, userId: null });
        },
        type: 'redirect'
      });
    }
  };

  const handleModalCancel = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleModalConfirm = () => {
    modal.action();
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setDropdownMenu({ isOpen: false, userId: null });
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${ADMIN_TOKEN}`,
            'Content-Type': 'application/json',
          }
        });

        // Логирование статуса и текста ответа
        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = JSON.parse(responseText);
        const usersFromApi = data.items.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role === 'Admin' ? 'Administrator' : 'Customer',
          status: user.status.toLowerCase(),
          date: new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          email: user.email,
          avatar: user.imageUrl || 'https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration-eps10_268834-1920.jpg?semt=ais_hybrid&w=740'
        }));
        setUsers(usersFromApi);
      } catch (error) {
        console.error('Ошибка при загрузке пользователей:', error);
      }
    };

    fetchUsers();
  }, []);

  const promoteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/role/promote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновление роли пользователя в состоянии
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id.toString() === userId ? { ...user, role: 'Administrator' } : user
        )
      );
    } catch (error) {
      console.error('Ошибка при повышении пользователя:', error);
    }
  };

  const demoteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/admin/users/${userId}/role/demote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Обновление роли пользователя в состоянии
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id.toString() === userId ? { ...user, role: 'Customer' } : user
        )
      );
    } catch (error) {
      console.error('Ошибка при понижении пользователя:', error);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const body = JSON.stringify({ userIds: [userId] });
      console.log('Request body:', body); // Логирование тела запроса

      const response = await fetch('http://localhost:8080/api/admin/users/delete-many', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Изменение статуса пользователя через handleStatusChange
      handleStatusChange(userId);
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
    }
  };

  const restoreUser = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/users/restore-many', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${ADMIN_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIds: [userId] })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Восстановление пользователя в состоянии
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id.toString() === userId ? { ...user, status: 'active' } : user
        )
      );
    } catch (error) {
      console.error('Ошибка при восстановлении пользователя:', error);
    }
  };

  return (
    <div className="users-panel">
      <div className="users-panel__filters">
        <div className="role-filter">
          <span>Role</span>
          <div className="role-select" onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}>
            <span>{selectedRole}</span>
            <ArrowDownIcon className={isRoleDropdownOpen ? 'rotated' : ''} />
            {isRoleDropdownOpen && (
              <div className="role-dropdown">
                <div 
                  className={`role-option ${selectedRole === 'All' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect('All');
                  }}
                >
                  All
                </div>
                <div 
                  className={`role-option ${selectedRole === 'Administrator' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect('Administrator');
                  }}
                >
                  Administrator
                </div>
                <div 
                  className={`role-option ${selectedRole === 'Customer' ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect('Customer');
                  }}
                >
                  Customer
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="search-input">
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="columns-filter">
          <div className="columns-select" onClick={() => setIsColumnsDropdownOpen(!isColumnsDropdownOpen)}>
            <span>Filters</span>
            <ArrowDownIcon className={isColumnsDropdownOpen ? 'rotated' : ''} />
            {isColumnsDropdownOpen && (
              <div className="columns-dropdown">
                <div 
                  className={`column-option ${columnVisibility.status ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumn('status');
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={columnVisibility.status}
                    onChange={() => toggleColumn('status')}
                  />
                  Status
                </div>
                <div 
                  className={`column-option ${columnVisibility.registrationDate ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumn('registrationDate');
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={columnVisibility.registrationDate}
                    onChange={() => toggleColumn('registrationDate')}
                  />
                  Registration date
                </div>
                <div 
                  className={`column-option ${columnVisibility.email ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleColumn('email');
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={columnVisibility.email}
                    onChange={() => toggleColumn('email')}
                  />
                  Email
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredUsers.length > 0 ? (
        <div className="users-panel__table">
          <div className="users-panel__table-header" style={{ gridTemplateColumns: getGridTemplateColumns() }}>
            <div className="header-cell">User</div>
            {columnVisibility.status && <div className="header-cell">Status</div>}
            {columnVisibility.registrationDate && <div className="header-cell">Registration date</div>}
            {columnVisibility.email && <div className="header-cell">Email</div>}
            <div className="header-cell"></div>
          </div>

          <div className="users-panel__table-body">
            {currentUsers.map(user => (
              <div key={user.id} className="user-row" style={{ gridTemplateColumns: getGridTemplateColumns() }}>
                <div className="user-info">
                  <div className="avatar">
                    <img src={user.avatar} alt={user.name} />
                  </div>
                  <div className="details">
                    <span className="name">{user.name}</span>
                    <span className="role">{user.role}</span>
                  </div>
                </div>
                {columnVisibility.status && (
                  <div className={`status ${user.status}`}>
                    {user.status === 'active' ? 'Active' : 'Deleted'}
                  </div>
                )}
                {columnVisibility.registrationDate && <span className="date">{user.date}</span>}
                {columnVisibility.email && <span className="email">{user.email}</span>}
                <div className="more-menu">
                  <div className="more-icon" onClick={(e) => handleMoreClick(user.id, e)}>
                    <MoreIcon />
                  </div>
                  {dropdownMenu.isOpen && dropdownMenu.userId === user.id && (
                    <div className="dropdown-menu">
                      <div className="dropdown-item" onClick={() => handleRoleChange(user.id)}>
                        Make {user.role === 'Administrator' ? 'customer' : 'administrator'}
                      </div>
                      <div className="dropdown-item" onClick={() => handleStatusChange(user.id.toString())}>
                        {user.status === 'active' ? 'Delete' : 'Restore'}
                      </div>
                      <div className="separator" />
                      <div className="dropdown-item" onClick={() => handleViewOrders(user.id)}>
                        View orders
                      </div>
                      <div className="dropdown-item" onClick={() => handleViewReviews(user.id)}>
                        View reviews
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="users-panel__empty-state">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            {searchQuery ? (
              <path d="M22 40C32.4934 40 41 31.4934 41 21C41 10.5066 32.4934 2 22 2C11.5066 2 3 10.5066 3 21C3 31.4934 11.5066 40 22 40ZM36.7682 37.7682L45 46" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <path d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            )}
          </svg>
          <p>
            {searchQuery 
              ? "No users match your search"
              : "No users found"}
          </p>
        </div>
      )}

      {filteredUsers.length > itemsPerPage && (
        <div className="users-panel__pagination">
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

      <ConfirmModal
        isOpen={modal.isOpen}
        message={modal.message}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        type={modal.type}
      />
    </div>
  );
}; 