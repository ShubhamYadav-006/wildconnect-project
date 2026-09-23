import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import PartnerSidebar from '../components/navigation/PartnerSidebar';

const PartnerLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }} className="page-wrapper">
        <div className="dashboard-grid">
          <PartnerSidebar />
          <div className="fade-in">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartnerLayout;
