import { useOutletContext } from 'react-router-dom';
import { Machine } from '../../api';

interface AdminContext {
  server: Machine;
}

export function OverallPage() {
  const { server } = useOutletContext<AdminContext>();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Server Overview</h1>
      
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Server Information</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Server Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">IP Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.ipv4}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Operating System</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.operatingSystem}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.status}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Hardware Specifications</h2>
          <dl className="grid grid-cols-1 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">CPU Cores</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.cpuCores} cores</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">RAM</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.ram} GB</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">SSD Storage</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.ssd} GB</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Network Bandwidth</dt>
              <dd className="mt-1 text-sm text-gray-900">{server.bandwidth} Gbps</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}