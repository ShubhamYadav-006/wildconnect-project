import LoadingSpinner from '../../components/ui/LoadingSpinner';

export const Loading = () => {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <LoadingSpinner message="Venturing into the wild..." />
    </div>
  );
};

export default Loading;
