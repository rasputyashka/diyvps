import { Link } from 'react-router-dom';
import { Server } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-b from-indigo-50/50">
      <div className="text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Бронирование ресурсов
          <span className="block text-indigo-600">Всего за несколько кликов</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          Бронируй ресурсы для использования
        </p>
        <Link
          to="/book"
          className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-full hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Server className="w-6 h-6 mr-2" />
          Бронирование
        </Link>
      </div>
    </div>
  );
}