import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Notice, Department, ScreenView, DeviceMode, Orientation } from '../types/notice';
import { INITIAL_NOTICES } from '../data/initialNotices';

const STORAGE_KEY_NOTICES = 'college_notices_storage_v1';
const STORAGE_KEY_BOOKMARKS = 'college_bookmarks_storage_v1';
const STORAGE_KEY_THEME = 'college_theme_mode_v1';

interface NoticeContextType {
  notices: Notice[];
  savedNotices: Notice[];
  filteredNotices: Notice[];
  selectedDepartment: Department | 'ALL';
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'urgent';
  isLoading: boolean;
  errorMessage: string | null;
  currentScreen: ScreenView;
  activeNoticeId: string | null;
  deviceMode: DeviceMode;
  orientation: Orientation;
  isDarkMode: boolean;
  
  // Actions
  setSelectedDepartment: (dept: Department | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'urgent') => void;
  navigateTo: (screen: ScreenView, noticeId?: string | null) => void;
  toggleBookmark: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'isBookmarked' | 'views'>) => boolean;
  deleteNotice: (id: string) => void;
  refreshNotices: () => Promise<void>;
  simulateError: () => void;
  retry: () => void;
  resetAllData: () => void;
  setDeviceMode: (mode: DeviceMode) => void;
  setOrientation: (orientation: Orientation) => void;
  toggleDarkMode: () => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

export const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgent'>('newest');
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [currentScreen, setCurrentScreen] = useState<ScreenView>('home');
  const [activeNoticeId, setActiveNoticeId] = useState<string | null>(null);
  
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('mobile');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY_THEME);
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(STORAGE_KEY_THEME, 'light');
      }
      return next;
    });
  };

  // Load from local storage
  const loadNotices = useCallback(() => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const storedNotices = localStorage.getItem(STORAGE_KEY_NOTICES);
      const storedBookmarks = localStorage.getItem(STORAGE_KEY_BOOKMARKS);

      let parsedBookmarks: string[] = [];
      if (storedBookmarks) {
        try {
          parsedBookmarks = JSON.parse(storedBookmarks);
        } catch {
          parsedBookmarks = [];
        }
      } else {
        // default bookmarked
        parsedBookmarks = ['notice-1', 'notice-2'];
        localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(parsedBookmarks));
      }
      setBookmarkedIds(parsedBookmarks);

      if (storedNotices) {
        try {
          const parsed = JSON.parse(storedNotices) as Notice[];
          setNotices(parsed);
        } catch {
          setNotices(INITIAL_NOTICES);
          localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(INITIAL_NOTICES));
        }
      } else {
        setNotices(INITIAL_NOTICES);
        localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(INITIAL_NOTICES));
      }
    } catch {
      setErrorMessage('Failed to read notices from local storage');
    } finally {
      // Simulate realistic slight network/DB latency for Material 3 Loading state
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  // Persist notices helper
  const persistNotices = (updatedNotices: Notice[]) => {
    setNotices(updatedNotices);
    localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(updatedNotices));
  };

  // Persist bookmarks helper
  const persistBookmarks = (updatedBookmarks: string[]) => {
    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(updatedBookmarks));
  };

  // Navigation
  const navigateTo = (screen: ScreenView, noticeId: string | null = null) => {
    setCurrentScreen(screen);
    if (noticeId !== undefined) {
      setActiveNoticeId(noticeId);
    }
    // Scroll to top of active container
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((bId) => bId !== id) : [...prev, id];
      persistBookmarks(updated);
      return updated;
    });

    setNotices((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, isBookmarked: !n.isBookmarked } : n));
      localStorage.setItem(STORAGE_KEY_NOTICES, JSON.stringify(updated));
      return updated;
    });
  };

  // Add Notice
  const addNotice = (noticeData: Omit<Notice, 'id' | 'isBookmarked' | 'views'>): boolean => {
    try {
      const newNotice: Notice = {
        ...noticeData,
        id: `notice-${Date.now()}`,
        isBookmarked: false,
        views: 1,
      };

      const updated = [newNotice, ...notices];
      persistNotices(updated);
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  // Delete Notice
  const deleteNotice = (id: string) => {
    const updated = notices.filter((n) => n.id !== id);
    persistNotices(updated);
    if (bookmarkedIds.includes(id)) {
      persistBookmarks(bookmarkedIds.filter((bId) => bId !== id));
    }
    if (activeNoticeId === id) {
      navigateTo('home');
    }
  };

  // Refresh
  const refreshNotices = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    await new Promise((r) => setTimeout(r, 600));
    loadNotices();
  };

  // Simulation controls for required states
  const simulateError = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setErrorMessage('Unable to synchronize with College Notice database. Connection timed out.');
    }, 400);
  };

  const retry = () => {
    loadNotices();
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_NOTICES);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
    loadNotices();
  };

  // Filtered and sorted notices
  const filteredNotices = notices
    .filter((n) => {
      const matchesDept = selectedDepartment === 'ALL' || n.department.toUpperCase() === selectedDepartment.toUpperCase();
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'urgent') {
        const priorityOrder = { urgent: 3, high: 2, normal: 1 };
        const pA = priorityOrder[a.priority || 'normal'] || 1;
        const pB = priorityOrder[b.priority || 'normal'] || 1;
        if (pA !== pB) return pB - pA;
      }
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();
      if (sortBy === 'oldest') {
        return dateA - dateB;
      }
      return dateB - dateA; // default newest first
    });

  // Saved notices
  const savedNotices = notices
    .filter((n) => bookmarkedIds.includes(n.id) || n.isBookmarked)
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  return (
    <NoticeContext.Provider
      value={{
        notices,
        savedNotices,
        filteredNotices,
        selectedDepartment,
        searchQuery,
        sortBy,
        isLoading,
        errorMessage,
        currentScreen,
        activeNoticeId,
        deviceMode,
        orientation,
        isDarkMode,
        setSelectedDepartment,
        setSearchQuery,
        setSortBy,
        navigateTo,
        toggleBookmark,
        addNotice,
        deleteNotice,
        refreshNotices,
        simulateError,
        retry,
        resetAllData,
        setDeviceMode,
        setOrientation,
        toggleDarkMode,
      }}
    >
      {children}
    </NoticeContext.Provider>
  );
};

export const useNoticeContext = () => {
  const context = useContext(NoticeContext);
  if (!context) {
    throw new Error('useNoticeContext must be used within a NoticeProvider');
  }
  return context;
};
