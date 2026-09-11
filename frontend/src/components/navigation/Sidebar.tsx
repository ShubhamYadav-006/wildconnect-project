import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Map, Tent, FileText, Users, MapPin, Calendar, Bell, Shield, User, Compass, Settings, LogOut, Briefcase } from 'lucide-react';
import '../../styles/components/Sidebar.css';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <Shield size={18} />, end: true },
    { to: '/admin/destinations', label: 'Destinations', icon: <Map size={18} /> },
    { to: '/admin/resorts', label: 'Resorts', icon: <Tent size={18} /> },
    { to: '/admin/trip-requests', label: 'Trip Requests', icon: <Calendar size={18} /> },
    { to: '/admin/bookings', label: 'Bookings', icon: <MapPin size={18} /> },
    { to: '/admin/businesses', label: 'Businesses', icon: <Briefcase size={18} /> },
    { to: '/admin/articles', label: 'Articles', icon: <FileText size={18} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={18} /> },
  ];

  const touristLinks = [
    { to: '/dashboard', label: 'Overview', icon: <Compass size={18} />, end: true },
    { to: '/dashboard/requests', label: 'Trip Requests', icon: <Calendar size={18} /> },
    { to: '/dashboard/bookings', label: 'Bookings', icon: <MapPin size={18} /> },
    { to: '/dashboard/notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { to: '/dashboard/profile', label: 'My Profile', icon: <User size={18} /> },
    { to: '/dashboard/settings', label: 'Security Settings', icon: <Settings size={18} /> },
  ];


  const links = user?.role === 'ADMIN' ? adminLinks : touristLinks;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-menu">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="sidebar-footer">
        <button onClick={logout} className="sidebar-logout-btn">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
