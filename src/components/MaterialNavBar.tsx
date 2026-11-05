import React from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import {
  Bell,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  Code,
  Bookmark,
  PlusCircle,
  RotateCw,
} from 'lucide-react';

export const MaterialNavBar: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    savedNotices,
    deviceMode,
    setDeviceMode,
    orientation,
    setOrientation,
    isDarkMode,
    toggleDarkMode,
  } = useNoticeContext();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark (One-line) */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30 group-hover:scale-105 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap">
              College Notice Board
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean, single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              currentScreen === 'home'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : ''
            }`}
          >
            All Notices
          </button>

          <button
            type="button"
            onClick={() => navigateTo('saved')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ${
              currentScreen === 'saved'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : ''
            }`}
          >
            <span>Saved</span>
            {savedNotices.length > 0 && (
              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                {savedNotices.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigateTo('add')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
              currentScreen === 'add'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : ''
            }`}
          >
            Post Notice
          </button>

          <button
            type="button"
            onClick={() => navigateTo('flutter_code')}
            className={`whitespace-nowrap transition-colors hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 ${
              currentScreen === 'flutter_code'
                ? 'text-blue-600 dark:text-blue-400 font-bold'
                : ''
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Flutter Code</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & View Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Simulator / Portal View Mode Segmented Switch */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                deviceMode === 'mobile'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Mobile App Simulator (Flutter View)"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile App</span>
            </button>
            <button
              type="button"
              onClick={() => setDeviceMode('portal')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                deviceMode === 'portal'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
              title="Full Portal Responsive View"
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Portal View</span>
            </button>
          </div>

          {/* Orientation switch when in mobile mode */}
          {deviceMode === 'mobile' && (
            <button
              type="button"
              onClick={() =>
                setOrientation(orientation === 'portrait' ? 'landscape' : 'portrait')
              }
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
              title={`Switch orientation (Current: ${orientation})`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
