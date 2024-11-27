import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Server, Menu, X, Home, LogIn, UserPlus, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    await logout();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          <Link 
            to="/" 
            className="flex items-center space-x-2 transition-transform hover:scale-105"
          >
            <Server className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">
              DIY VPS
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex space-x-2">
              <Link
                to="/"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActivePath('/')
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Главная
              </Link>
              <Link
                to="/book"
                className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                  isActivePath('/book')
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Server className="w-4 h-4 mr-2" />
                Забронировать
              </Link>
              {isAuthenticated && (
                <Link
                  to="/my-servers"
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg ${
                    isActivePath('/my-servers')
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Database className="w-4 h-4 mr-2" />
                  Мои бронирования
                </Link>
              )}
            </div>

            {!isAuthenticated ? (
              <div className="flex space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Начать
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Выйти
              </button>
            )}
          </div>

          <button
            className="lg:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath('/')
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Home className="w-4 h-4 mr-2" />
              Главная
            </Link>
            <Link
              to="/book"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActivePath('/book')
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Server className="w-4 h-4 mr-2" />
              Забронировать
            </Link>
            {isAuthenticated && (
              <Link
                to="/my-servers"
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActivePath('/my-servers')
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Database className="w-4 h-4 mr-2" />
                Мои бронирования
              </Link>
            )}
            {!isAuthenticated ? (
              <div className="space-y-2 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Войти
                </Link>
                <Link
                  to="/register"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Начать
                </Link>
              </div>
            ) : (
              <button 
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Выйти
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}