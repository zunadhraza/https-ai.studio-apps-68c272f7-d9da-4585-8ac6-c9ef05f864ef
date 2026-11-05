import React, { useState, useEffect } from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import { HomeScreen } from './HomeScreen';
import { NoticeDetailScreen } from './NoticeDetailScreen';
import { AddNoticeScreen } from './AddNoticeScreen';
import { SavedNoticesScreen } from './SavedNoticesScreen';
import { FlutterCodeViewer } from './FlutterCodeViewer';
import {
  Bell,
  Bookmark,
  PlusCircle,
  Code,
  Wifi,
  BatteryMedium,
  Sparkles,
  Signal,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

export const Material3Simulator: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    savedNotices,
    orientation,
    refreshNotices,
  } = useNoticeContext();

  const [currentTime, setCurrentTime] = useState<string>('10:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'detail':
        return <NoticeDetailScreen />;
      case 'add':
        return <AddNoticeScreen />;
      case 'saved':
        return <SavedNoticesScreen />;
      case 'flutter_code':
        return <FlutterCodeViewer />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  const isLandscape = orientation === 'landscape';

  return (
    <div className="flex flex-col items-center justify-center py-6 px-2 min-h-[calc(100vh-4rem)]">
      {/* Device Frame */}
      <div
        className={`relative bg-slate-950 rounded-[44px] p-3 shadow-2xl ring-1 ring-slate-800 transition-all duration-300 ${
          isLandscape
            ? 'w-full max-w-[860px] h-[480px]'
            : 'w-full max-w-[420px] h-[820px]'
        }`}
      >
        {/* Outer Titanium Trim / Volume & Power buttons indicator */}
        <div className="absolute -left-1 top-24 w-1 h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -left-1 top-40 w-1 h-12 bg-slate-700 rounded-l-sm" />
        <div className="absolute -right-1 top-32 w-1 h-16 bg-slate-700 rounded-r-sm" />

        {/* Screen Display Container */}
        <div className="relative w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[34px] overflow-hidden flex flex-col border border-slate-800/80 shadow-inner">
          {/* Android Status Bar */}
          <div className="h-8 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 flex items-center justify-between text-[11px] font-semibold text-slate-700 dark:text-slate-300 shrink-0 select-none z-30 border-b border-slate-100 dark:border-slate-800/50">
            <span>{currentTime}</span>

            {/* Camera cutout / punch hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 ring-2 ring-slate-800/50 mx-auto" />

            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <span className="text-[10px]">5G</span>
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Flutter Material 3 Top AppBar (When on home screen or saved screen) */}
          {(currentScreen === 'home' || currentScreen === 'flutter_code') && (
            <div className="h-14 bg-white dark:bg-slate-900 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 z-20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-none">
                    College Notice Board
                  </h1>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">
                    Live Campus Circulars
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => refreshNotices()}
                  className="p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Refresh Notices"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('saved')}
                  className="relative p-2 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Saved Notices"
                >
                  <Bookmark className="w-4 h-4" />
                  {savedNotices.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {savedNotices.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Screen Scrollable Body */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {renderActiveScreen()}
          </div>

          {/* Flutter Material 3 Bottom Navigation Bar */}
          <nav
            aria-label="Mobile Navigation"
            className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 items-center px-2 shrink-0 z-20"
          >
            {/* Nav Item: Home Notices */}
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentScreen === 'home' || currentScreen === 'detail'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  currentScreen === 'home' || currentScreen === 'detail'
                    ? 'bg-blue-100/70 dark:bg-blue-950/70'
                    : ''
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">Notices</span>
            </button>

            {/* Nav Item: Saved */}
            <button
              type="button"
              onClick={() => navigateTo('saved')}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                currentScreen === 'saved'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all relative ${
                  currentScreen === 'saved' ? 'bg-blue-100/70 dark:bg-blue-950/70' : ''
                }`}
              >
                <Bookmark className="w-5 h-5" />
                {savedNotices.length > 0 && (
                  <span className="absolute -top-0.5 right-2 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                    {savedNotices.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">Saved</span>
            </button>

            {/* Nav Item: Add Notice */}
            <button
              type="button"
              onClick={() => navigateTo('add')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentScreen === 'add'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  currentScreen === 'add' ? 'bg-blue-100/70 dark:bg-blue-950/70' : ''
                }`}
              >
                <PlusCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">Post Notice</span>
            </button>

            {/* Nav Item: Flutter Code */}
            <button
              type="button"
              onClick={() => navigateTo('flutter_code')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                currentScreen === 'flutter_code'
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div
                className={`px-4 py-1 rounded-full transition-all ${
                  currentScreen === 'flutter_code' ? 'bg-blue-100/70 dark:bg-blue-950/70' : ''
                }`}
              >
                <Code className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold tracking-tight mt-0.5">Dart Code</span>
            </button>
          </nav>

          {/* Bottom Home Indicator Bar */}
          <div className="h-3 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
            <div className="w-28 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
