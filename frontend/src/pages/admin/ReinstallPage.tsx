import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Server } from '../../types';

interface AdminContext {
  server: Server;
}

const operatingSystems = [
  { id: 'ubuntu-22.04', name: 'Ubuntu 22.04' },
  { id: 'debian-12', name: 'Debian 12' }
];

export function ReinstallPage() {
  const { server } = useOutletContext<AdminContext>();
  const [selectedOS, setSelectedOS] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      alert('Please confirm that you understand the data will be erased');
      return;
    }
    // TODO: Implement reinstall logic
    console.log('Reinstalling server:', server.id, 'with OS:', selectedOS);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        Переустановить операционную систему на {server.id}
      </h1>

      <div className="max-w-2xl bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="os" className="block text-sm font-medium text-gray-700">
              Выберите операционную систему
            </label>
            <select
              id="os"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={selectedOS}
              onChange={(e) => setSelectedOS(e.target.value)}
              required
            >
              <option value="">Выберите ОС</option>
              {operatingSystems.map((os) => (
                <option key={os.id} value={os.id}>
                  {os.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Внимеание: нажимая эту кнопку, вы понимаете, что все данные на диске будут утеряны
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="confirm"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
            />
            <label htmlFor="confirm" className="ml-2 block text-sm text-gray-900">
              Я понимаю, что все данные будут утеряны
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Переустановить операционную систему
          </button>
        </form>
      </div>
    </div>
  );
}