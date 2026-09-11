import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import PrimaryButton from '../../components/buttons/PrimaryButton';

export const NotFound = () => {
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
      <Compass
        size={80}
        style={{ color: 'var(--color-primary)', marginBottom: '1.5rem', animation: 'spin 10s linear infinite' }}
      />
      <h1 className="h1-title" style={{ marginBottom: '0.5rem' }}>404 - Lost in the Wilderness</h1>
      <p className="text-muted" style={{ maxWidth: '28rem', marginBottom: '2rem' }}>
        The page you are looking for has wandered off, or does not exist. Let's get you back on track to exploring India's wild trails.
      </p>
      <Link to="/">
        <PrimaryButton size="md">Go Back Home</PrimaryButton>
      </Link>
    </div>
  );
};

export default NotFound;
