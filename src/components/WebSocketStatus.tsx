
import { useWebSocket } from '../hooks/useWebSocket';

interface WebSocketStatusProps {
  url?: string;
}

export const WebSocketStatus = ({ url }: WebSocketStatusProps) => {
  const { isConnected, socket } = useWebSocket({
    url: url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
    options: { autoConnect: false }
  });

  const toggleConnection = () => {
    if (isConnected) {
      socket?.disconnect();
    } else {
      socket?.connect();
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <span className="text-sm text-gray-600">
        WebSocket: {isConnected ? 'Connected' : 'Disconnected'}
      </span>
      <button
        onClick={toggleConnection}
        className={`px-3 py-1 text-xs rounded ${
          isConnected
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
      >
        {isConnected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};