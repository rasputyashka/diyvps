import { useState } from 'react';
import { Server as ServerIcon, Cpu, HardDrive, Network, CircuitBoard, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { Machine } from '../api';
import { toast } from 'react-hot-toast';

interface ServerCardProps {
  server: Machine;
  onBook?: () => void;
  onReinstall?: () => void;
  showReinstall?: boolean;
  showPassword?: boolean;
}

export function ServerCard({ 
  server, 
  onBook, 
  onReinstall,
  showReinstall = false,
  showPassword = false
}: ServerCardProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(server.password);
      setCopied(true);
      toast.success('Password copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy password');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          server.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {server.status}
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center text-gray-600">
          <Cpu className="w-5 h-5 mr-2" />
          <span>{server.cpuCores} Cores</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <CircuitBoard className="w-5 h-5 mr-2" />
          <span>{server.ram} GB RAM</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <HardDrive className="w-5 h-5 mr-2" />
          <span>{server.ssd} GB SSD</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Network className="w-5 h-5 mr-2" />
          <span>{server.ipv4}</span>
        </div>
        
        <div className="text-gray-600">
          <span className="font-medium">OS:</span> {server.operatingSystem}
        </div>

        {showPassword && (
          <div className="flex items-center justify-between bg-gray-50 rounded-md p-2">
            <div className="flex items-center flex-1 mr-2">
              <span className="font-medium text-gray-700 mr-2">Password:</span>
              <span className="font-mono text-sm">
                {isPasswordVisible ? server.password : '••••••••'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                title={isPasswordVisible ? 'Hide password' : 'Show password'}
              >
                {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopyPassword}
                className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                title="Copy password"
              >
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-2">
        {onBook && server.status === 'ACTIVE' && (
          <button
            onClick={onBook}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Book Now
          </button>
        )}
        {showReinstall && (
          <button
            onClick={onReinstall}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Reinstall OS
          </button>
        )}
      </div>
    </div>
  );
}