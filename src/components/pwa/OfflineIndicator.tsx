import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50 flex items-center gap-3 rounded-xl bg-[#003B2E] border border-[#E0B030]/40 px-4 py-3 text-xs text-[#FFFEFA] shadow-xl"
    >
      <div className="w-2.5 h-2.5 rounded-full bg-[#E0B030] flex-shrink-0" />
      <div className="flex-1">
        <p className="font-semibold flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5 text-[#E0B030]" />
          Mode Luar Jaringan (Offline)
        </p>
        <p className="text-[11px] text-[#F5F0D5]/90 mt-0.5">
          Menampilkan surat dan data yang telah tersimpan di cache perangkat Anda.
        </p>
      </div>
    </div>
  );
};
