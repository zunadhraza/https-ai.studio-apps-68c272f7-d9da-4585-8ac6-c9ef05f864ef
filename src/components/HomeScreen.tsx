import React from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import { NoticeCard } from './NoticeCard';
import { Department } from '../types/notice';
import {
  Search,
  X,
  RefreshCw,
  Plus,
  AlertCircle,
  FileQuestion,
  Filter,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';

const DEPARTMENTS_LIST: (Department | 'ALL')[] = [
  'ALL',
  'CSE',
  'ECE',
  'EEE',
  'MECH',
  'CIVIL',
  'GENERAL',
];

export const HomeScreen: React.FC = () => {
  const {
    filteredNotices,
    selectedDepartment,
    searchQuery,
    sortBy,
    isLoading,
    errorMessage,
    setSelectedDepartment,
    setSearchQuery,
    setSortBy,
    navigateTo,
    refreshNotices,
    retry,
    resetAllData,
    simulateError,
  } = useNoticeContext();

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Search Bar & Utility Bar */}
      <div className="p-4 sm:p-5 pb-2 space-y-3">
        {/* Search Input Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notices by title, department, or keyword..."
            className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Chips Carousel & Sort Control */}
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          {/* Scrollable Department Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-xs">
            {DEPARTMENTS_LIST.map((dept) => {
              const isSelected = selectedDepartment === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {dept === 'ALL' && <Filter className="w-3 h-3" />}
                  {dept}
                </button>
              );
            })}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'urgent')}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-lg shadow-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-600"
              aria-label="Sort notices"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="urgent">Urgent</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* State simulation test helpers */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 px-1">
          <div className="flex items-center gap-1">
            <span>Showing:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {filteredNotices.length} notices
            </span>
            {selectedDepartment !== 'ALL' && (
              <span className="text-blue-600 dark:text-blue-400">({selectedDepartment})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refreshNotices()}
              className="hover:text-blue-600 inline-flex items-center gap-1 transition-colors"
              title="Trigger pull-to-refresh"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={simulateError}
              className="hover:text-rose-600 transition-colors"
              title="Test error state with Retry button"
            >
              Simulate Error
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area Handling 4 States */}
      <div className="flex-1 p-4 sm:p-5 pt-1">
        {/* State 1: LOADING STATE (Circular Progress Indicator) */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Fetching college notices...
            </p>
            <p className="text-xs text-slate-400 mt-1">Checking official circulars</p>
          </div>
        )}

        {/* State 2: ERROR STATE (With Retry Button) */}
        {!isLoading && errorMessage && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/50 rounded-2xl flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              Unable to Load Notices
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Connection
            </button>
          </div>
        )}

        {/* State 3: EMPTY STATE (When no notices match filter/search or list is empty) */}
        {!isLoading && !errorMessage && filteredNotices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <FileQuestion className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
              No Notices Found
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">
              {searchQuery
                ? `No announcements match "${searchQuery}". Check the spelling or try searching for a different branch.`
                : `There are currently no active circulars posted for ${selectedDepartment}.`}
            </p>
            <div className="flex items-center gap-3">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Clear Search
                </button>
              )}
              {selectedDepartment !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedDepartment('ALL')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  View All Departments
                </button>
              )}
              <button
                type="button"
                onClick={resetAllData}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-medium transition-colors"
              >
                Reset Default Notices
              </button>
            </div>
          </div>
        )}

        {/* State 4: DATA STATE (Displaying available notices) */}
        {!isLoading && !errorMessage && filteredNotices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
            {filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                notice={notice}
                onSelect={() => navigateTo('detail', notice.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) to Post Notice */}
      <button
        type="button"
        onClick={() => navigateTo('add')}
        aria-label="Post a new notice"
        className="fixed bottom-20 right-6 sm:bottom-8 sm:right-8 z-30 inline-flex items-center gap-2 px-5 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-sm rounded-2xl shadow-lg shadow-blue-600/30 transition-all group"
      >
        <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-200" />
        <span>Post Notice</span>
      </button>
    </div>
  );
};
