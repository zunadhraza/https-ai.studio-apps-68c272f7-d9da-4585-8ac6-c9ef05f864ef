import React, { useState } from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  User,
  Share2,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Building,
  AlertTriangle,
  Mail,
  MapPin,
  Trash2,
} from 'lucide-react';

export const NoticeDetailScreen: React.FC = () => {
  const { notices, activeNoticeId, navigateTo, toggleBookmark, deleteNotice } = useNoticeContext();
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const notice = notices.find((n) => n.id === activeNoticeId);

  if (!notice) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 dark:text-slate-400 mb-4">Notice could not be found or was removed.</p>
        <button
          onClick={() => navigateTo('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold"
        >
          Back to Notices
        </button>
      </div>
    );
  }

  const handleCopy = () => {
    const text = `${notice.title}\nDepartment: ${notice.department}\nIssued by: ${notice.author}\nDate: ${notice.publishedDate}\n\n${notice.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      `Notice from ${notice.department} department. Title: ${notice.title}. Issued by: ${notice.author}. ${notice.description}`
    );
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header App Bar */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isSpeaking && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              navigateTo('home');
            }}
            className="p-2 -ml-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Back to notices"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-base text-slate-900 dark:text-slate-100">
            Notice Details
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleSpeak}
            className={`p-2 rounded-xl transition-colors ${
              isSpeaking
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isSpeaking ? 'Stop text-to-speech narration' : 'Listen to notice read aloud'}
          >
            {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy notice details"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => toggleBookmark(notice.id)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={notice.isBookmarked ? 'Remove bookmark' : 'Bookmark this notice'}
          >
            <Bookmark
              className={`w-5 h-5 ${
                notice.isBookmarked
                  ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400'
                  : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-6">
        {/* Department and Published Date */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 rounded-lg">
            {notice.department}
          </span>

          {notice.priority === 'urgent' && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-1 rounded-lg border border-rose-200 dark:border-rose-800">
              <AlertTriangle className="w-3.5 h-3.5" />
              URGENT NOTICE
            </span>
          )}

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(notice.publishedDate)}</span>
          </div>
        </div>

        {/* Notice Title */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
          {notice.title}
        </h1>

        {/* Issuing Authority / Author Profile Card */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0">
              {notice.author.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Issued by</p>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{notice.author}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {notice.department} Department
              </p>
            </div>
          </div>

          {notice.location && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 text-right">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{notice.location}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 dark:border-slate-800" />

        {/* Full Notice Description */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Notice Circular Body
          </h2>
          <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-base whitespace-pre-line bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            {notice.description}
          </div>
        </div>

        {/* Supplementary Information Grid if available */}
        {(notice.contactEmail || notice.location) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400">
            {notice.contactEmail && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">Contact: {notice.contactEmail}</span>
              </div>
            )}
            {notice.location && (
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">Venue: {notice.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="pt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => toggleBookmark(notice.id)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              notice.isBookmarked
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${notice.isBookmarked ? 'fill-current' : ''}`} />
            <span>{notice.isBookmarked ? 'Bookmarked' : 'Save Notice'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl border border-transparent hover:border-rose-200 transition-colors"
            title="Delete this notice"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 dark:border-slate-800 text-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Delete Notice?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
                This notice will be permanently removed from the college database.
              </p>
              <div className="flex gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteNotice(notice.id);
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700"
                >
                  Delete Notice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
