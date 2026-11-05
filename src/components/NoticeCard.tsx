import React from 'react';
import { Notice } from '../types/notice';
import { useNoticeContext } from '../context/NoticeContext';
import { Bookmark, Calendar, User, ArrowRight, AlertTriangle } from 'lucide-react';

interface NoticeCardProps {
  notice: Notice;
  onSelect: () => void;
}

export const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onSelect }) => {
  const { toggleBookmark } = useNoticeContext();

  const getDepartmentBadge = (dept: string) => {
    switch (dept.toUpperCase()) {
      case 'CSE':
        return 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'ECE':
        return 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
      case 'EEE':
        return 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'MECH':
        return 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'CIVIL':
        return 'text-stone-700 bg-stone-100 dark:bg-stone-900/60 dark:text-stone-300 border-stone-200 dark:border-stone-800';
      default:
        return 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article
      onClick={onSelect}
      className="group relative bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 hover:border-blue-400 dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left flex flex-col justify-between"
    >
      <div>
        {/* Top metadata row: Department, Date, Urgent Flag, and Bookmark Button */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getDepartmentBadge(
                notice.department
              )}`}
            >
              {notice.department}
            </span>

            {notice.priority === 'urgent' && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-900">
                <AlertTriangle className="w-3 h-3" />
                Urgent
              </span>
            )}

            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{formatDate(notice.publishedDate)}</span>
            </div>
          </div>

          {/* Bookmark Button (44px touch target) */}
          <button
            type="button"
            aria-label={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark notice'}
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(notice.id);
            }}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Bookmark
              className={`w-5 h-5 transition-transform active:scale-90 ${
                notice.isBookmarked
                  ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400'
                  : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Notice Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug mb-2">
          {notice.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {notice.description}
        </p>
      </div>

      {/* Author and Read Action Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate font-medium">{notice.author}</span>
        </div>

        <span className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
          Read Full
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </article>
  );
};
