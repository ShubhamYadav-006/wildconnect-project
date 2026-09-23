import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Briefcase,
  Bell,
  LogOut,
  User,
  MessageSquare,
  Layers,
  Calendar,
  ShieldCheck,
  Car,
  Camera,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import '../../styles/components/Sidebar.css';

export const PartnerSidebar = () => {
  const { logout } = useAuth();
  
  const partnerLinks = [
    { to: '/partner', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
    { to: '/partner/kyc', label: 'KYC Compliance', icon: <ShieldCheck size={18} /> },
    { to: '/partner/businesses', label: 'My Businesses', icon: <Briefcase size={18} /> },
    { to: '/partner/rooms', label: 'Rooms & Lodges', icon: <Layers size={18} /> },
    { to: '/partner/vehicles', label: 'Safari Vehicles', icon: <Car size={18} /> },
    { to: '/partner/equipment', label: 'Cameras & Gear', icon: <Camera size={18} /> },
    { to: '/partner/calendar', label: 'Availability Calendar', icon: <CalendarDays size={18} /> },
    { to: '/partner/bookings', label: 'Direct Bookings', icon: <Calendar size={18} /> },
    { to: '/partner/finances', label: 'Earnings & Payouts', icon: <CreditCard size={18} /> },
    { to: '/partner/inquiries', label: 'Customer Inquiries', icon: <MessageSquare size={18} /> },
    { to: '/partner/notifications', label: 'Notifications', icon: <Bell size={18} /> },
    { to: '/partner/profile', label: 'My Profile', icon: <User size={18} /> },
  ];

  return (
    <aside className="sidebar-container">
      <div className="sidebar-menu">
        {partnerLinks.map((link) => (
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

export default PartnerSidebar;
