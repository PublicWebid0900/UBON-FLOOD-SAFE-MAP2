import React from 'react';
import { AlertTriangle, ShieldCheck, Info, Compass, History, Activity } from 'lucide-react';

interface NavbarProps {
  onOpenReportModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenProjectModal: () => void;
  onOpenRoutePlanner: () => void;
  onOpenOfficerPortal: () => void;
  pendingReportsCount: number;
  currentWaterLevel: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReportModal,
  onOpenHistoryModal,
  onOpenProjectModal,
  onOpenRoutePlanner,
  onOpenOfficerPortal,
  pendingReportsCount,
  currentWaterLevel
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Title (Single text element wordmark) */}
        <a 
          href="#map" 
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
          UBON FLOOD SAFE MAP
        </a>

        {/* Zone 2: 4–5 single-line clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a 
            href="#map" 
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Activity className="w-4 h-4 text-slate-400" />
            แผนที่จุดเสี่ยง
          </a>
          <button 
            onClick={onOpenRoutePlanner}
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            เส้นทางปลอดภัย
          </button>
          <button 
            onClick={onOpenHistoryModal}
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
          >
            <History className="w-4 h-4 text-slate-400" />
            ประวัติน้ำท่วม 2562
          </button>
          <button 
            onClick={onOpenProjectModal}
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900"
          >
            <Info className="w-4 h-4 text-slate-400" />
            เกี่ยวกับนวัตกรรม
          </button>
          <button 
            onClick={onOpenOfficerPortal}
            className="hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer text-slate-600 hover:text-slate-900 relative"
          >
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            ระบบเจ้าหน้าที่
            {pendingReportsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-xs font-semibold tabular-nums">
                {pendingReportsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono tabular-nums mr-1">
            <span>สถานี M.7</span>
            <span className="font-semibold text-slate-800">{currentWaterLevel.toFixed(2)} ม.</span>
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            พบจุดเสี่ยง? แจ้งเรา
          </button>
        </div>
      </div>
    </header>
  );
};
