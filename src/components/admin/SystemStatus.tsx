import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, XCircle, Clock, Server, Database } from 'lucide-react';
import { profileAPI } from '@/services/api';

export const SystemStatus = () => {
  const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setStatus('checking');
    const start = performance.now();
    try {
      // Use profile API as a health check since it's a core endpoint
      await profileAPI.get();
      const end = performance.now();
      setLatency(Math.round(end - start));
      setStatus('online');
      setLastChecked(new Date());
    } catch (error) {
      console.error('System status check failed:', error);
      setStatus('offline');
      setLatency(null);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    // Auto check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Status Sistem API</h3>
            <p className="text-xs text-muted-foreground">Monitoring kesehatan backend</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${
          status === 'online' 
            ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
            : status === 'offline'
            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
            : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
        }`}>
          {status === 'online' ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Online
            </>
          ) : status === 'offline' ? (
            <>
              <XCircle className="h-3 w-3" />
              Offline
            </>
          ) : (
            <>
              <Activity className="h-3 w-3 animate-spin" />
              Checking...
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span className="text-xs">Latensi</span>
          </div>
          <p className={`text-lg font-bold ${latency && latency > 500 ? 'text-yellow-500' : 'text-foreground'}`}>
            {latency ? `${latency}ms` : '-'}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1 text-muted-foreground">
            <Server className="h-3 w-3" />
            <span className="text-xs">Backend</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            Django REST
          </p>
        </div>
      </div>

      {lastChecked && (
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <span>Terakhir diperbarui:</span>
          <span>{lastChecked.toLocaleTimeString()}</span>
        </div>
      )}
    </motion.div>
  );
};
