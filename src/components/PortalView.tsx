import React, { useState } from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import { HomeScreen } from './HomeScreen';
import { NoticeDetailScreen } from './NoticeDetailScreen';
import { AddNoticeScreen } from './AddNoticeScreen';
import { SavedNoticesScreen } from './SavedNoticesScreen';
import { FlutterCodeViewer } from './FlutterCodeViewer';
import {
  Bell,
  Bookmark,
  Plus,
  Code2,
  Calendar,
  Layers,
  GraduationCap,
  Sparkles,
  Download,
} from 'lucide-react';

export const PortalView: React.FC = () => {
  const { currentScreen, navigateTo, savedNotices } = useNoticeContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* College Campus Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 bg-slate-900 min-h-[220px] sm:min-h-[260px] flex items-end">
        {/* Background photo */}
        <img
          src="/src/assets/images/college_campus_quad_1793901996204.jpg"
          alt="Engineering College Campus Quad"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Scrim for WCAG contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-8 w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Official Student Portal · Academic Year 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              College Notice Board
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Official circulars, semester exam schedules, placement drives, workshops, and department notices.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => navigateTo('add')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Notice</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('flutter_code')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs rounded-xl backdrop-blur-md border border-white/20 transition-all"
            >
              <Code2 className="w-4 h-4 text-blue-300" />
              <span>Flutter Source Code</span>
            </button>
          </div>
        </div>
      </div>

      {/* Screen Render Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
        {currentScreen === 'detail' && <NoticeDetailScreen />}
        {currentScreen === 'add' && <AddNoticeScreen />}
        {currentScreen === 'saved' && <SavedNoticesScreen />}
        {currentScreen === 'flutter_code' && (
          <div className="p-4 sm:p-6">
            <FlutterCodeViewer />
          </div>
        )}
        {currentScreen === 'home' && <HomeScreen />}
      </div>
    </div>
  );
};
