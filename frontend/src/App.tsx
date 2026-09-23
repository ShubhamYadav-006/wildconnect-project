import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
