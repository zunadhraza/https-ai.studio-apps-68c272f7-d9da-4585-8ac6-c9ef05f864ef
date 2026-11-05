import React, { useState } from 'react';
import { useNoticeContext } from '../context/NoticeContext';
import { Department } from '../types/notice';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  Building2,
  User,
  FileText,
} from 'lucide-react';

const DEPARTMENTS: { id: Department; name: string }[] = [
  { id: 'CSE', name: 'CSE - Computer Science & Engineering' },
  { id: 'ECE', name: 'ECE - Electronics & Communication' },
  { id: 'EEE', name: 'EEE - Electrical & Electronics' },
  { id: 'MECH', name: 'MECH - Mechanical Engineering' },
  { id: 'CIVIL', name: 'CIVIL - Civil Engineering' },
  { id: 'GENERAL', name: 'GENERAL - College Administration' },
];

export const AddNoticeScreen: React.FC = () => {
  const { addNotice, navigateTo } = useNoticeContext();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [publishedDate, setPublishedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal');

  // Validation errors state
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    author?: string;
    publishedDate?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Template autofill for swift evaluation
  const loadTemplate = (type: 'exam' | 'placement' | 'hackathon') => {
    if (type === 'exam') {
      setTitle('Mid-Term Lab Practical & Viva Examination Schedule');
      setDepartment('CSE');
      setAuthor('Department Examination Committee');
      setDescription(
        'All B.Tech Computer Science students are hereby notified that Mid-Term practical lab assessments will commence from next Monday. Students must bring signed lab observation notebooks and student identity cards. Batch allotments are available on the department notice board.'
      );
      setPriority('high');
    } else if (type === 'placement') {
      setTitle('Amazon & Goldman Sachs Summer Internship Coding Challenge');
      setDepartment('GENERAL');
      setAuthor('Prof. S. Narayanan (Head Placement)');
      setDescription(
        'Online registration is now open for pre-final year engineering students (all disciplines) for the 2026 Summer Internship recruitment drive. The initial HackerRank algorithmic assessment will take place on Saturday at 10:00 AM.'
      );
      setPriority('urgent');
    } else {
      setTitle('National Level 36-Hour Autonomous Robotics Hackathon');
      setDepartment('ECE');
      setAuthor('Robotics & AI Student Chapter');
      setDescription(
        'Registrations are invited for the inter-collegiate 36-Hour Hardware & Embedded AI hackathon. Track themes include smart agriculture drones, autonomous rovers, and wearable biomedical devices. Cash prizes worth ₹1,50,000 for top 3 teams.'
      );
      setPriority('normal');
    }
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = 'Title must not be empty';
    } else if (title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!author.trim()) {
      newErrors.author = 'Author / Issuing Authority is required';
    } else if (author.trim().length < 3) {
      newErrors.author = 'Author name must be at least 3 characters';
    }

    if (!publishedDate) {
      newErrors.publishedDate = 'Published date is required';
    }

    if (!description.trim()) {
      newErrors.description = 'Description must not be empty';
    } else if (description.trim().length < 15) {
      newErrors.description = 'Description must be at least 15 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = addNotice({
        title: title.trim(),
        department,
        description: description.trim(),
        author: author.trim(),
        publishedDate,
        priority,
      });

      setIsSubmitting(false);

      if (success) {
        setShowSuccessToast(true);
        setTimeout(() => {
          navigateTo('home');
        }, 1200);
      }
    }, 400);
  };

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
          <span className="font-bold text-base text-slate-900 dark:text-slate-100">
            Post New Notice
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="m-4 p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 shadow-sm transition-all animate-in fade-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">Notice Submitted Successfully!</p>
            <p className="text-xs text-emerald-700 dark:text-emerald-300">
              Your circular has been published to the college notice board.
            </p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {/* Quick autofill sample templates */}
        <div className="mb-6 p-4 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 dark:text-blue-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Fill Templates (Optional)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadTemplate('exam')}
              className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100/50 transition-colors"
            >
              📝 Lab Exam Schedule
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('placement')}
              className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100/50 transition-colors"
            >
              💼 Campus Placement
            </button>
            <button
              type="button"
              onClick={() => loadTemplate('hackathon')}
              className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100/50 transition-colors"
            >
              🤖 Tech Hackathon
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Notice Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Notice Title <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="e.g. Schedule for End Semester Examinations"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.title
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Department Selection Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Department <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer transition-all"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Published Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Published Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => {
                    setPublishedDate(e.target.value);
                    if (errors.publishedDate)
                      setErrors((prev) => ({ ...prev, publishedDate: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                    errors.publishedDate
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
              </div>
              {errors.publishedDate && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.publishedDate}
                </p>
              )}
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Author / Issuing Authority <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                }}
                placeholder="e.g. Dean of Academics / Head of Dept"
                className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                  errors.author
                    ? 'border-rose-400 focus:ring-rose-500'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              />
            </div>
            {errors.author && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.author}
              </p>
            )}
          </div>

          {/* Priority Flag */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Urgency / Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'high', 'urgent'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize border transition-all ${
                    priority === level
                      ? level === 'urgent'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950 dark:border-rose-800 dark:text-rose-300'
                        : level === 'high'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                        : 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Notice Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Notice Full Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Provide complete circular information, eligibility criteria, venue, instructions for students, or deadlines..."
              className={`w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all ${
                errors.description
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              Minimum 15 characters. Supports multi-paragraph text.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-600/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing Notice...</span>
                </>
              ) : (
                <span>Submit Notice</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
