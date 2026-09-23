import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, Calendar, Check, UserCheck } from 'lucide-react';
import { authService, type User } from '../../services/auth.service';
import toast from 'react-hot-toast';
import '../../styles/admin/AdminCommon.css';
import '../../styles/admin/AdminUsers.css';
import '../../styles/globals/tables.css';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING_PARTNERS' | 'BUSINESS_PARTNER' | 'TOURIST' | 'ADMIN'>('ALL');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
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

  const handleUpdateRole = async (userId: string, newRole: 'TOURIST' | 'BUSINESS_PARTNER' | 'ADMIN') => {
    try {
      setUpdatingUserId(userId);
      const res = await authService.updateUserRole(userId, newRole);
      if (res.success) {
        toast.success(
          newRole === 'BUSINESS_PARTNER'
            ? 'User approved as Business Partner!'
            : `User role updated to ${newRole}`
        );
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Failed to update role', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const getRoleBadge = (user: User) => {
    const isPendingPartner = user.role === 'TOURIST' && user.partnerKyc?.status === 'KYC_PENDING';

    if (isPendingPartner) {
      return <span className="admin-badge status-pending-partner">Pending Partner Review</span>;
    }

    switch (user.role) {
      case 'ADMIN':
        return <span className="admin-badge success">Admin</span>;
      case 'TOURIST':
        return <span className="admin-badge info">Traveler</span>;
      case 'BUSINESS_PARTNER':
        return <span className="admin-badge warning">Partner</span>;
      default:
        return <span className="admin-badge neutral">{user.role}</span>;
    }
  };

  const pendingPartnerCount = users.filter(
    (u) => u.role === 'TOURIST' && u.partnerKyc?.status === 'KYC_PENDING'
  ).length;

  const displayedUsers = activeTab === 'ALL'
    ? users
    : activeTab === 'PENDING_PARTNERS'
    ? users.filter((u) => u.role === 'TOURIST' && u.partnerKyc?.status === 'KYC_PENDING')
    : activeTab === 'BUSINESS_PARTNER'
    ? users.filter((u) => u.role === 'BUSINESS_PARTNER')
    : activeTab === 'TOURIST'
    ? users.filter((u) => u.role === 'TOURIST' && u.partnerKyc?.status !== 'KYC_PENDING')
    : users.filter((u) => u.role === 'ADMIN');

  return (
    <div className="admin-page-container fade-in">
      <Link to="/admin" className="admin-back-link">
        <ArrowLeft size={16} style={{ marginRight: '0.5rem' }} /> Back to Admin Dashboard
      </Link>

      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">User Management & Partner Approvals</h1>
          <p className="admin-page-subtitle">Review, approve, and manage registered travelers, partner applications, and platform admins.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-user-tabs">
        <button
          className={`tab-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'PENDING_PARTNERS' ? 'active' : ''}`}
          onClick={() => setActiveTab('PENDING_PARTNERS')}
        >
          Partner Requests ({pendingPartnerCount})
        </button>
        <button
          className={`tab-btn ${activeTab === 'BUSINESS_PARTNER' ? 'active' : ''}`}
          onClick={() => setActiveTab('BUSINESS_PARTNER')}
        >
          Approved Partners ({users.filter((u) => u.role === 'BUSINESS_PARTNER').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'TOURIST' ? 'active' : ''}`}
          onClick={() => setActiveTab('TOURIST')}
        >
          Travelers ({users.filter((u) => u.role === 'TOURIST' && u.partnerKyc?.status !== 'KYC_PENDING').length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'ADMIN' ? 'active' : ''}`}
          onClick={() => setActiveTab('ADMIN')}
        >
          Admins ({users.filter((u) => u.role === 'ADMIN').length})
        </button>
      </div>

      {isLoading ? (
        <div style={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--color-text-muted)' }}>
          Loading users...
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className="admin-card">
          <div className="admin-user-empty-state">
            <Users className="admin-user-empty-icon" />
            <h3 className="admin-user-empty-title">No Users Found</h3>
            <p className="admin-user-empty-desc">There are currently no users in this category.</p>
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
                <th>Role / Status</th>
                <th>Registered On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((u) => {
                const isPendingPartner = u.role === 'TOURIST' && u.partnerKyc?.status === 'KYC_PENDING';
                const isUpdating = updatingUserId === u.id;

                return (
                  <tr key={u.id}>
                    <td>
                      <div className="admin-user-info-cell">
                        <div className="admin-user-avatar">
                          {u.firstName?.[0] || 'U'}{u.lastName?.[0] || ''}
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
                      {u.phone || u.phoneNumber ? (
                        <div className="admin-user-contact-item">
                          <Phone size={16} />
                          {u.phone || u.phoneNumber}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>-</span>
                      )}
                    </td>
                    <td>
                      {getRoleBadge(u)}
                    </td>
                    <td>
                      <div className="admin-user-contact-item">
                        <Calendar size={16} />
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </div>
                    </td>
                    <td>
                      <div className="user-action-cell">
                        {isPendingPartner ? (
                          <button
                            className="btn-approve-partner"
                            onClick={() => handleUpdateRole(u.id, 'BUSINESS_PARTNER')}
                            disabled={isUpdating}
                          >
                            <Check size={14} />
                            <span>{isUpdating ? 'Approving...' : 'Approve Partner'}</span>
                          </button>
                        ) : u.role === 'TOURIST' ? (
                          <button
                            className="btn-upgrade-partner"
                            onClick={() => handleUpdateRole(u.id, 'BUSINESS_PARTNER')}
                            disabled={isUpdating}
                          >
                            <UserCheck size={14} />
                            <span>Make Partner</span>
                          </button>
                        ) : u.role === 'BUSINESS_PARTNER' ? (
                          <button
                            className="btn-revoke-partner"
                            onClick={() => handleUpdateRole(u.id, 'TOURIST')}
                            disabled={isUpdating}
                          >
                            <span>Set as Traveler</span>
                          </button>
                        ) : (
                          <span className="admin-system-tag">Platform Admin</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
