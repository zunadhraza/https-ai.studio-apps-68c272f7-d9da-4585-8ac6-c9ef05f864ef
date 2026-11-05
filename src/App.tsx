import React from 'react';
import { NoticeProvider, useNoticeContext } from './context/NoticeContext';
import { MaterialNavBar } from './components/MaterialNavBar';
import { Material3Simulator } from './components/Material3Simulator';
import { PortalView } from './components/PortalView';
import { Smartphone, Monitor, Code, ShieldCheck, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { deviceMode, setDeviceMode } = useNoticeContext();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar adhering to the Top Bar Contract */}
      <MaterialNavBar />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {deviceMode === 'mobile' ? <Material3Simulator /> : <PortalView />}
      </main>

      {/* Subtle, professional Academic Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              College Notice Board
            </span>
            <span aria-hidden="true">·</span>
            <span>Material 3 Design</span>
            <span aria-hidden="true">·</span>
            <span>Flutter & Dart Provider Architecture</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span>CSE · ECE · EEE · MECH · CIVIL · GENERAL</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Local Storage Persistent
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <NoticeProvider>
      <AppContent />
    </NoticeProvider>
  );
}
