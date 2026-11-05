import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/notice.dart';

enum NoticeViewState { initial, loading, loaded, error }

class NoticeProvider extends ChangeNotifier {
  static const String _storageKey = 'college_notices_storage_v1';
  static const String _bookmarksKey = 'college_bookmarks_storage_v1';

  List<Notice> _notices = [];
  Set<String> _bookmarkedIds = {};
  NoticeViewState _state = NoticeViewState.initial;
  String _selectedDepartment = 'ALL';
  String _searchQuery = '';
  String _errorMessage = '';

  NoticeViewState get state => _state;
  String get selectedDepartment => _selectedDepartment;
  String get searchQuery => _searchQuery;
  String get errorMessage => _errorMessage;

  List<Notice> get allNotices => List.unmodifiable(_notices);

  /// Filtered notices based on department, search query, sorted newest first
  List<Notice> get filteredNotices {
    return _notices.where((notice) {
      final matchesDepartment = _selectedDepartment == 'ALL' ||
          notice.department.toUpperCase() == _selectedDepartment.toUpperCase();

      final matchesSearch = _searchQuery.isEmpty ||
          notice.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          notice.description.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          notice.author.toLowerCase().contains(_searchQuery.toLowerCase());

      return matchesDepartment && matchesSearch;
    }).toList()
      ..sort((a, b) => b.publishedDate.compareTo(a.publishedDate)); // Newest first
  }

  /// Bookmarked / saved notices
  List<Notice> get savedNotices {
    return _notices.where((n) => n.isBookmarked).toList()
      ..sort((a, b) => b.publishedDate.compareTo(a.publishedDate));
  }

  /// Initialize and load notices from SharedPreferences
  Future<void> initialize() async {
    _state = NoticeViewState.loading;
    notifyListeners();

    try {
      final prefs = await SharedPreferences.getInstance();
      final bookmarksList = prefs.getStringList(_bookmarksKey) ?? [];
      _bookmarkedIds = bookmarksList.toSet();

      final jsonString = prefs.getString(_storageKey);
      if (jsonString != null && jsonString.isNotEmpty) {
        final List<dynamic> decoded = jsonDecode(jsonString);
        _notices = decoded.map((item) {
          final notice = Notice.fromJson(item as Map<String, dynamic>);
          return notice.copyWith(isBookmarked: _bookmarkedIds.contains(notice.id));
        }).toList();
      } else {
        // Seed default notices if first launch
        _seedInitialNotices();
        await _persistNotices();
      }

      _state = NoticeViewState.loaded;
      _errorMessage = '';
    } catch (e) {
      _state = NoticeViewState.error;
      _errorMessage = 'Failed to load notices: ${e.toString()}';
    }
    notifyListeners();
  }

  void setDepartment(String department) {
    if (_selectedDepartment != department) {
      _selectedDepartment = department;
      notifyListeners();
    }
  }

  void setSearchQuery(String query) {
    _searchQuery = query;
    notifyListeners();
  }

  /// Add new notice with persistence
  Future<bool> addNotice({
    required String title,
    required String department,
    required String description,
    required String author,
    required DateTime publishedDate,
  }) async {
    try {
      final newNotice = Notice(
        id: 'notice_${DateTime.now().millisecondsSinceEpoch}',
        title: title.trim(),
        department: department.trim(),
        description: description.trim(),
        author: author.trim(),
        publishedDate: publishedDate,
        isBookmarked: false,
      );

      _notices.insert(0, newNotice);
      await _persistNotices();
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = 'Failed to add notice: ${e.toString()}';
      notifyListeners();
      return false;
    }
  }

  /// Toggle bookmark status and persist
  Future<void> toggleBookmark(String noticeId) async {
    final index = _notices.indexWhere((n) => n.id == noticeId);
    if (index != -1) {
      final current = _notices[index];
      final newStatus = !current.isBookmarked;
      _notices[index] = current.copyWith(isBookmarked: newStatus);

      if (newStatus) {
        _bookmarkedIds.add(noticeId);
      } else {
        _bookmarkedIds.remove(noticeId);
      }

      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_bookmarksKey, _bookmarkedIds.toList());
      await _persistNotices();
      notifyListeners();
    }
  }

  /// Remove notice
  Future<void> deleteNotice(String noticeId) async {
    _notices.removeWhere((n) => n.id == noticeId);
    _bookmarkedIds.remove(noticeId);
    await _persistNotices();
    notifyListeners();
  }

  /// Pull to refresh simulation
  Future<void> refresh() async {
    _state = NoticeViewState.loading;
    notifyListeners();
    await Future.delayed(const Duration(milliseconds: 600));
    await initialize();
  }

  /// Retry upon error
  void retry() {
    initialize();
  }

  Future<void> _persistNotices() async {
    final prefs = await SharedPreferences.getInstance();
    final jsonString = jsonEncode(_notices.map((n) => n.toJson()).toList());
    await prefs.setString(_storageKey, jsonString);
  }

  void _seedInitialNotices() {
    _notices = [
      Notice(
        id: 'notice_1',
        title: 'Final Semester Examination Schedule & Hall Tickets',
        department: 'GENERAL',
        description: 'The Controller of Examinations announces that regular and supplementary exam timetables are posted. Hall tickets are downloadable from the ERP portal upon fee clearance.',
        author: 'Controller of Examinations',
        publishedDate: DateTime.now().subtract(const Duration(days: 1)),
        isBookmarked: true,
        priority: 'urgent',
      ),
      Notice(
        id: 'notice_2',
        title: 'Microsoft & TCS On-Campus Placement Drive for 2026 Batch',
        department: 'CSE',
        description: 'Placement Cell is hosting Microsoft and TCS. Eligible branches: CSE, ECE, EEE with CGPA >= 7.5. Online tests commence in Central Labs.',
        author: 'Head, Placement Cell',
        publishedDate: DateTime.now().subtract(const Duration(days: 2)),
        isBookmarked: true,
        priority: 'high',
      ),
      Notice(
        id: 'notice_3',
        title: 'Two-Day Workshop on Embedded Systems & Edge AI',
        department: 'ECE',
        description: 'Hands-on practical sessions on RISC-V microcontrollers, FreeRTOS, and TinyML. Hardware kits provided for registered student teams.',
        author: 'Prof. Ananya Sen',
        publishedDate: DateTime.now().subtract(const Duration(days: 4)),
        isBookmarked: false,
      ),
      Notice(
        id: 'notice_4',
        title: 'EV Battery Management Systems Guest Seminar',
        department: 'EEE',
        description: 'Expert industrial lecture on lithium-ion thermal balancing and regenerative braking test rigs. Open to 3rd & 4th year students.',
        author: 'Dr. Suresh Kumar (HOD EEE)',
        publishedDate: DateTime.now().subtract(const Duration(days: 5)),
        isBookmarked: false,
      ),
      Notice(
        id: 'notice_5',
        title: 'SAE BAJA All-Terrain Vehicle Team Selections',
        department: 'MECH',
        description: 'Team Veloce invites applications for Chassis design, Suspension analysis, and CVT tuning for national championship competition.',
        author: 'Mech Engineering Society',
        publishedDate: DateTime.now().subtract(const Duration(days: 7)),
        isBookmarked: false,
      ),
      Notice(
        id: 'notice_6',
        title: 'Metro Rail Tunneling Field Study & Site Visit',
        department: 'CIVIL',
        description: 'Mandatory soil mechanics field study to the metro underground tunnel boring machine site. College buses depart from main gate at 8:30 AM.',
        author: 'Prof. K. Venkatesh',
        publishedDate: DateTime.now().subtract(const Duration(days: 10)),
        isBookmarked: false,
      ),
    ];
  }
}
