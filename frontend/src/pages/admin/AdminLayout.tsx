import { Link, Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Settings, Server } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Machine, machines } from '../../api';
import { toast } from 'react-hot-toast';

const navigation = [
  { name: 'Overall', href: '', icon: LayoutDashboard },
  { name: 'Change Configuration', href: '/config', icon: Settings },
];

export function AdminLayout() {
  const location = useLocation();
  const { serverId } = useParams();
  const navigate = useNavigate();
  const [servers, setServers] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setLoading(true);
        const data = await machines.getAll();
        setServers(data);
        if (!serverId && data.length > 0) {
          navigate(`/admin/${data[0].pk}`);
        }
      } catch (error) {
        toast.error('Failed to fetch servers');
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, [serverId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!serverId || servers.length === 0) return null;

  const currentServer = servers.find(s => s.pk.toString() === serverId);
  if (!currentServer) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-gray-900">Панель администратора</h1>
              </div>

              {/* Server Selection */}
              <div className="mt-5 px-4">
                <label htmlFor="server-select" className="block text-sm font-medium text-gray-700 mb-2">
                  Забронировать
                </label>
                <select
                  id="server-select"
                  value={serverId}
                  onChange={(e) => navigate(`/admin/${e.target.value}`)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {servers.map((server) => (
                    <option key={server.pk} value={server.pk}>
                      {server.name} - {server.ipv4}
                    </option>
                  ))}
                </select>
              </div>

              {/* Server Info */}
              <div className="mt-4 px-4 py-3 bg-gray-50 border-y border-gray-200">
                <div className="flex items-center space-x-2">
                  <Server className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{currentServer.ipv4}</span>
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  {currentServer.operatingSystem} • {currentServer.ram}GB RAM • {currentServer.cpuCores} Cores
                </div>
                <div className="mt-1 text-sm text-gray-500">
                  Status: <span className={currentServer.status === 'ACTIVE' ? 'text-green-600' : 'text-yellow-600'}>
                    {currentServer.status}
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === `/admin/${serverId}${item.href}`;
                  return (
                    <Link
                      key={item.name}
                      to={`/admin/${serverId}${item.href}`}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                          isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                        }`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <Outlet context={{ server: currentServer }} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}