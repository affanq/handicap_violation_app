import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import AnalysisResultPage from './pages/AnalysisResultPage';
import AdminDashboard from './pages/AdminDashboard';
import ViolationDetail from './pages/ViolationDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="upload" element={<UploadPage />} />
        <Route path="result" element={<AnalysisResultPage />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/violation/:id" element={<ViolationDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
