import { useState, useEffect } from 'react';
import { ServerCard } from '../components/ServerCard';
import { machines } from '../api';
import { toast } from 'react-hot-toast';
import type { Machine } from '../api';

export function MyServersPage() {
  const [servers, setServers] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyServers = async () => {
      try {
        setLoading(true);
        const data = await machines.getMyMachines();
        setServers(data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServers();
  }, []);

  const handleReinstall = async (pk: number) => {
    try {
      const response = await machines.reinstall(pk);
      toast.success(response.message);
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Мои бронирования</h1>
      
      {servers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">У вас еще нет бронирований.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {servers.map((server) => (
            <ServerCard
              key={server.pk}
              server={server}
              onReinstall={() => handleReinstall(server.pk)}
              showReinstall
              showPassword
            />
          ))}
        </div>
      )}
    </div>
  );
}