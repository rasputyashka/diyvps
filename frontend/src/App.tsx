import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { BookPage } from './pages/BookPage';
import { MyServersPage } from './pages/MyServersPage';
import { AdminLayout } from './pages/admin/AdminLayout';
import { OverallPage } from './pages/admin/OverallPage';
import { ConfigPage } from './pages/admin/ConfigPage';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/book" element={<BookPage />} />
              <Route path="/my-servers" element={<PrivateRoute><MyServersPage /></PrivateRoute>} />
              <Route path="/admin/:serverId" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
                <Route index element={<OverallPage />} />
                <Route path="config" element={<ConfigPage />} />
              </Route>
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}