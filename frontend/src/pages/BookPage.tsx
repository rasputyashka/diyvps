import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerCard } from '../components/ServerCard';
import { Pagination } from '../components/Pagination';
import { machines } from '../api';
import { format, addWeeks } from 'date-fns';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ITEMS_PER_PAGE = 12;

export function BookPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: format(new Date(), 'yyyy-MM-dd HH:mm'),
    end: format(addWeeks(new Date(), 1), 'yyyy-MM-dd HH:mm')
  });
  const [filterValues, setFilterValues] = useState(dateRange);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchServers = async (start: string, end: string) => {
    try {
      setLoading(true);
      const apiStart = start.replace(' ', '-');
      const apiEnd = end.replace(' ', '-');
      const data = await machines.getAvailable(apiStart, apiEnd);
      setServers(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServers(dateRange.start, dateRange.end);
  }, []);

  const handleApplyFilter = () => {
    setDateRange(filterValues);
    setCurrentPage(1);
    fetchServers(filterValues.start, filterValues.end);
  };

  const totalPages = Math.ceil(servers.length / ITEMS_PER_PAGE);
  const currentServers = servers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleBook = async (pk: number) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/book' } });
      return;
    }

    try {
      await machines.book(pk, dateRange.start.replace(' ', '-'), dateRange.end.replace(' ', '-'));
      toast.success('Server booked successfully');
      fetchServers(dateRange.start, dateRange.end);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Доступные ресурсы</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Сортировать по занятости</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                Дата начала
              </label>
              <input
                type="date"
                id="start-date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterValues.start.split(' ')[0]}
                onChange={(e) => setFilterValues(prev => ({
                  ...prev,
                  start: `${e.target.value} ${prev.start.split(' ')[1]}`
                }))}
              />
              <input
                type="time"
                id="start-time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterValues.start.split(' ')[1]}
                onChange={(e) => setFilterValues(prev => ({
                  ...prev,
                  start: `${prev.start.split(' ')[0]} ${e.target.value}`
                }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                Дата окончания
              </label>
              <input
                type="date"
                id="end-date"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterValues.end.split(' ')[0]}
                onChange={(e) => setFilterValues(prev => ({
                  ...prev,
                  end: `${e.target.value} ${prev.end.split(' ')[1]}`
                }))}
              />
              <input
                type="time"
                id="end-time"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                value={filterValues.end.split(' ')[1]}
                onChange={(e) => setFilterValues(prev => ({
                  ...prev,
                  end: `${prev.end.split(' ')[0]} ${e.target.value}`
                }))}
              />
            </div>
          </div>
          <button
            onClick={handleApplyFilter}
            className="w-full md:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Фильтровать
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentServers.map((server) => (
          <ServerCard
            key={server.pk}
            server={server}
            onBook={() => handleBook(server.pk)}
          />
        ))}
      </div>

      {servers.length > ITEMS_PER_PAGE && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}