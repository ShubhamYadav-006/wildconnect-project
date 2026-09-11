import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, Calendar } from 'lucide-react';
import { authService, type User } from '../../services/auth.service';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminUsers.css';
import '../../styles/globals/tables.css';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await authService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load user list');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <span className="admin-badge success">Admin</span>;
      case 'TOURIST':
        return <span className="admin-badge info">Traveler</span>;
      case 'BUSINESS_PARTNER':
        return <span className="admin-badge warning">Partner</span>;
      default:
        return <span className="admin-badge neutral">{role}</span>;
    }
  };

  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Management</h1>
          <p className="admin-page-subtitle">View and audit registered travelers and admins.</p>
        </div>
      </div>

      {isLoading ? (
        <div style={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)' }}>
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="admin-card">
          <div className="admin-user-empty-state">
            <Users className="admin-user-empty-icon" />
            <h3 className="admin-user-empty-title">No Users Found</h3>
            <p className="admin-user-empty-desc">The user list is currently empty.</p>
          </div>
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Registered On</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="admin-user-info-cell">
                      <div className="admin-user-avatar">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <div className="admin-user-name">{u.firstName} {u.lastName}</div>
                        <div className="admin-user-id">ID: {u.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="admin-user-contact-item">
                      <Mail size={16} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    {u.phoneNumber ? (
                      <div className="admin-user-contact-item">
                        <Phone size={16} />
                        {u.phoneNumber}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>-</span>
                    )}
                  </td>
                  <td>
                    {getRoleBadge(u.role)}
                  </td>
                  <td>
                    <div className="admin-user-contact-item">
                      <Calendar size={16} />
                      {new Date((u as any).createdAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
