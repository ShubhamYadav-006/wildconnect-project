import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import PrimaryButton from '../../components/buttons/PrimaryButton';

export const Unauthorized = () => {
  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: '2rem'
      }}
    >
      <ShieldAlert
        size={80}
        style={{ color: '#ef4444', marginBottom: '1.5rem' }}
      />
      <h1 className="h1-title" style={{ marginBottom: '0.5rem' }}>Access Denied</h1>
      <p className="text-muted" style={{ maxWidth: '28rem', marginBottom: '2rem' }}>
        You do not have the required permissions to view this section of the portal. Please log in with the correct role or head back to the dashboard.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/login">
          <PrimaryButton size="md">Login</PrimaryButton>
        </Link>
        <Link to="/dashboard" className="btn btn-outline btn-md">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
