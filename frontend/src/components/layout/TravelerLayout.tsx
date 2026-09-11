import { Outlet } from 'react-router-dom';
import Navbar from '../navigation/Navbar';
import Footer from '../navigation/Footer';
import Sidebar from '../navigation/Sidebar';

const TravelerLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }} className="page-wrapper">
        <div className="dashboard-grid">
          <Sidebar />
          <div className="fade-in">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TravelerLayout;
