import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Server } from '../../types';

interface AdminContext {
  server: Server;
}

interface ServerConfig {
  ram: number;
  cpu: number;
  ssd: number;
}

export function ConfigPage() {
  const { server } = useOutletContext<AdminContext>();
  const [config, setConfig] = useState<ServerConfig>({
    ram: server.ram,
    cpu: server.cpu,
    ssd: server.ssd
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement configuration update logic
    console.log('Updating configuration for server:', server.id, config);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Выберите конфигурацию для {server.id}
      </h1>

      <div className="max-w-2xl bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ram" className="block text-sm font-medium text-gray-700">
              RAM (GB)
            </label>
            <input
              type="number"
              id="ram"
              min="8"
              step="8"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={config.ram}
              onChange={(e) => setConfig(prev => ({ ...prev, ram: parseInt(e.target.value) }))}
            />
          </div>

          <div>
            <label htmlFor="cpu" className="block text-sm font-medium text-gray-700">
              CPU Cores
            </label>
            <input
              type="number"
              id="cpu"
              min="2"
              step="2"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={config.cpu}
              onChange={(e) => setConfig(prev => ({ ...prev, cpu: parseInt(e.target.value) }))}
            />
          </div>

          <div>
            <label htmlFor="ssd" className="block text-sm font-medium text-gray-700">
              SSD Storage (GB)
            </label>
            <input
              type="number"
              id="ssd"
              min="256"
              step="256"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={config.ssd}
              onChange={(e) => setConfig(prev => ({ ...prev, ssd: parseInt(e.target.value) }))}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Обновить конфигурацию
          </button>
        </form>
      </div>
    </div>
  );
}