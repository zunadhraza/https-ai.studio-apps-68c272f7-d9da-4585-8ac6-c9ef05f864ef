import React from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import { NoticeCard } from './NoticeCard';
import { ArrowLeft, Bookmark, BookmarkX, ArrowRight } from 'lucide-react';

export const SavedNoticesScreen: React.FC = () => {
  const { savedNotices, navigateTo, toggleBookmark } = useNoticeContext();

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to notices"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Saved Notices</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold">
                {savedNotices.length}
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-5 flex-1">
        {savedNotices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-sm mx-auto">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4 text-slate-400">
              <BookmarkX className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              No Saved Notices
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Tap the bookmark ribbon icon on any notice card or detail screen to store it here for rapid offline reference.
            </p>
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              Explore College Notices
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Notices saved on this device. Click bookmark icon to unsave.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {savedNotices.map((notice) => (
                <div key={notice.id} className="relative group">
                  <NoticeCard
                    notice={notice}
                    onSelect={() => navigateTo('detail', notice.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
