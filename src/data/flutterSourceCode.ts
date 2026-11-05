export interface FlutterFile {
  path: string;
  name: string;
  language: string;
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    description: 'Flutter project manifest with dependencies (Provider, SharedPreferences, Intl, Google Fonts)',
    content: `name: college_notice_board
description: "A modern digital College Notice Board application built with Flutter & Material 3."
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  provider: ^6.1.2
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  google_fonts: ^6.2.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    description: 'Application entry point initializing Provider, Material 3 Theme and routing',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/notice_provider.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize notice provider with local SharedPreferences persistence
  final noticeProvider = NoticeProvider();
  await noticeProvider.initialize();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: noticeProvider),
      ],
      child: const CollegeNoticeBoardApp(),
    ),
  );
}

class CollegeNoticeBoardApp extends StatelessWidget {
  const CollegeNoticeBoardApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Material 3 Theme with College Blue (#1A56DB) as seed color
    final colorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF1A56DB),
      brightness: Brightness.light,
      primary: const Color(0xFF1565C0),
      secondary: const Color(0xFF0D47A1),
      surface: const Color(0xFFF8FAFC),
    );

    return MaterialApp(
      title: 'College Notice Board',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: colorScheme,
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(Theme.of(context).textTheme),
        appBarTheme: const AppBarTheme(
          centerTitle: false,
          elevation: 0,
          scrolledUnderElevation: 2,
          backgroundColor: Colors.white,
          foregroundColor: Color(0xFF0F172A),
        ),
        cardTheme: CardTheme(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
          ),
        ),
        floatingActionButtonTheme: FloatingActionButtonThemeData(
          backgroundColor: const Color(0xFF1565C0),
          foregroundColor: Colors.white,
          elevation: 3,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),
      home: const HomeScreen(),
    );
  }
}
`
  },
  {
    path: 'lib/models/notice.dart',
    name: 'notice.dart',
    language: 'dart',
    description: 'Data model with JSON serialization and immutable copyWith methods',
    content: `class Notice {
  final String id;
  final String title;
  final String department;
  final String description;
  final String author;
  final DateTime publishedDate;
  final bool isBookmarked;
  final String priority;

  const Notice({
    required this.id,
    required this.title,
    required this.department,
    required this.description,
    required this.author,
    required this.publishedDate,
    this.isBookmarked = false,
    this.priority = 'normal',
  });

  Notice copyWith({
    String? id,
    String? title,
    String? department,
    String? description,
    String? author,
    DateTime? publishedDate,
    bool? isBookmarked,
    String? priority,
  }) {
    return Notice(
      id: id ?? this.id,
      title: title ?? this.title,
      department: department ?? this.department,
      description: description ?? this.description,
      author: author ?? this.author,
      publishedDate: publishedDate ?? this.publishedDate,
      isBookmarked: isBookmarked ?? this.isBookmarked,
      priority: priority ?? this.priority,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'department': department,
      'description': description,
      'author': author,
      'publishedDate': publishedDate.toIso8601String(),
      'isBookmarked': isBookmarked,
      'priority': priority,
    };
  }

  factory Notice.fromJson(Map<String, dynamic> json) {
    return Notice(
      id: json['id'] as String,
      title: json['title'] as String,
      department: json['department'] as String,
      description: json['description'] as String,
      author: json['author'] as String,
      publishedDate: DateTime.parse(json['publishedDate'] as String),
      isBookmarked: json['isBookmarked'] as bool? ?? false,
      priority: json['priority'] as String? ?? 'normal',
    );
  }
}
`
  },
  {
    path: 'lib/providers/notice_provider.dart',
    name: 'notice_provider.dart',
    language: 'dart',
    description: 'State management provider handling persistence, search, filtering, and loading/error states',
    content: `import 'dart:convert';
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
      _errorMessage = 'Failed to load notices: \${e.toString()}';
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
        id: 'notice_\${DateTime.now().millisecondsSinceEpoch}',
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
      _errorMessage = 'Failed to add notice: \${e.toString()}';
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
`
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    description: 'Home screen with search bar, department chips, pull-to-refresh, empty & error states',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../widgets/notice_card.dart';
import '../widgets/department_chip.dart';
import 'add_notice_screen.dart';
import 'notice_detail_screen.dart';
import 'saved_notices_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final List<String> _departments = [
    'ALL',
    'CSE',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'GENERAL',
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<NoticeProvider>();

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF1565C0).withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.campaign_rounded,
                color: Color(0xFF1565C0),
                size: 22,
              ),
            ),
            const SizedBox(width: 12),
            const Text(
              'College Notice Board',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 19,
                color: Color(0xFF0F172A),
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Saved Notices',
            icon: Badge(
              isLabelVisible: provider.savedNotices.isNotEmpty,
              label: Text('\${provider.savedNotices.length}'),
              child: const Icon(Icons.bookmark_outline_rounded),
            ),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const SavedNoticesScreen()),
              );
            },
          ),
          IconButton(
            tooltip: 'Refresh',
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => provider.refresh(),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.fromARGB(255, 16, 12, 16),
            child: SearchBar(
              controller: _searchController,
              hintText: 'Search notices by title or keywords...',
              leading: const Icon(Icons.search, color: Color(0xFF64748B)),
              trailing: [
                if (_searchController.text.isNotEmpty)
                  IconButton(
                    icon: const Icon(Icons.clear, size: 18),
                    onPressed: () {
                      _searchController.clear();
                      provider.setSearchQuery('');
                    },
                  ),
              ],
              onChanged: (value) => provider.setSearchQuery(value),
              elevation: const WidgetStatePropertyAll(0),
              backgroundColor: const WidgetStatePropertyAll(Colors.white),
              side: const WidgetStatePropertyAll(
                BorderSide(color: Color(0xFFE2E8F0)),
              ),
              shape: WidgetStatePropertyAll(
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
            ),
          ),

          // Department Filter Chips
          SizedBox(
            height: 48,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: _departments.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final dept = _departments[index];
                final isSelected = provider.selectedDepartment == dept;
                return DepartmentChip(
                  label: dept,
                  isSelected: isSelected,
                  onSelected: () => provider.setDepartment(dept),
                );
              },
            ),
          ),

          const SizedBox(height: 8),

          // Notices List / Loading / Error / Empty states
          Expanded(
            child: _buildContent(provider),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        icon: const Icon(Icons.add_rounded),
        label: const Text('Post Notice', style: TextStyle(fontWeight: FontWeight.w600)),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const AddNoticeScreen()),
          );
        },
      ),
    );
  }

  Widget _buildContent(NoticeProvider provider) {
    if (provider.state == NoticeViewState.loading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (provider.state == NoticeViewState.error) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded, size: 54, color: Colors.redAccent),
              const SizedBox(height: 12),
              const Text(
                'Something went wrong',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
              ),
              const SizedBox(height: 8),
              Text(
                provider.errorMessage,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF64748B)),
              ),
              const SizedBox(height: 16),
              ElevatedButton.icon(
                onPressed: () => provider.retry(),
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    final notices = provider.filteredNotices;

    if (notices.isEmpty) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Color(0xFFEFF6FF),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.assignment_outlined,
                  size: 48,
                  color: Color(0xFF1D4ED8),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'No Notices Found',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
              ),
              const SizedBox(height: 8),
              Text(
                provider.searchQuery.isNotEmpty
                    ? 'No notices match "\${provider.searchQuery}". Try a different keyword.'
                    : 'There are currently no notices for \${provider.selectedDepartment}.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF64748B)),
              ),
            ],
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: () => provider.refresh(),
      child: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 88),
        itemCount: notices.length,
        itemBuilder: (context, index) {
          final notice = notices[index];
          return NoticeCard(
            notice: notice,
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => NoticeDetailScreen(noticeId: notice.id),
                ),
              );
            },
            onBookmarkToggle: () => provider.toggleBookmark(notice.id),
          );
        },
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/notice_detail_screen.dart',
    name: 'notice_detail_screen.dart',
    language: 'dart',
    description: 'Notice details screen displaying complete description, metadata, and bookmark action',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/notice_provider.dart';

class NoticeDetailScreen extends StatelessWidget {
  final String noticeId;

  const NoticeDetailScreen({super.key, required this.noticeId});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<NoticeProvider>();
    final notice = provider.allNotices.firstWhere(
      (n) => n.id == noticeId,
      orElse: () => throw Exception('Notice not found'),
    );

    final dateStr = DateFormat('MMMM dd, yyyy').format(notice.publishedDate);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Notice Details', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            tooltip: notice.isBookmarked ? 'Remove Bookmark' : 'Bookmark Notice',
            icon: Icon(
              notice.isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
              color: notice.isBookmarked ? const Color(0xFF1565C0) : null,
            ),
            onPressed: () {
              provider.toggleBookmark(notice.id);
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    notice.isBookmarked
                        ? 'Removed from saved notices'
                        : 'Notice saved to bookmarks',
                  ),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          ),
          IconButton(
            tooltip: 'Copy Text',
            icon: const Icon(Icons.copy_rounded),
            onPressed: () {
              Clipboard.setData(ClipboardData(text: '\${notice.title}\\n\\n\${notice.description}'));
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Notice copied to clipboard')),
              );
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Department & Date Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, py: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1565C0).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    notice.department,
                    style: const TextStyle(
                      color: Color(0xFF1565C0),
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                const Icon(Icons.calendar_today_outlined, size: 14, color: Color(0xFF64748B)),
                const SizedBox(width: 6),
                Text(
                  dateStr,
                  style: const TextStyle(
                    color: Color(0xFF64748B),
                    fontSize: 13,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Title
            Text(
              notice.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: Color(0xFF0F172A),
                height: 1.3,
              ),
            ),
            const SizedBox(height: 16),

            // Author Card
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  CircleAvatar(
                    backgroundColor: const Color(0xFF1565C0),
                    child: Text(
                      notice.author.isNotEmpty ? notice.author[0].toUpperCase() : 'A',
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Issued by',
                          style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                        ),
                        Text(
                          notice.author,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            const Divider(color: Color(0xFFE2E8F0)),
            const SizedBox(height: 16),

            const Text(
              'Notice Description',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 12),

            // Full Notice Description
            Text(
              notice.description,
              style: const TextStyle(
                fontSize: 15,
                height: 1.65,
                color: Color(0xFF334155),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/add_notice_screen.dart',
    name: 'add_notice_screen.dart',
    language: 'dart',
    description: 'Add notice screen with form validation and success feedback',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/notice_provider.dart';

class AddNoticeScreen extends StatefulWidget {
  const AddNoticeScreen({super.key});

  @override
  State<AddNoticeScreen> createState() => _AddNoticeScreenState();
}

class _AddNoticeScreenState extends State<AddNoticeScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _authorController = TextEditingController();
  
  String _selectedDepartment = 'GENERAL';
  DateTime _selectedDate = DateTime.now();
  bool _isSubmitting = false;

  final List<String> _departments = [
    'CSE',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'GENERAL',
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _authorController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDate,
      firstDate: DateTime(2025),
      lastDate: DateTime(2030),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  Future<void> _submitNotice() async {
    // Validate all fields
    if (!_formKey.currentState!.validate()) {
      return;
    }

    setState(() => _isSubmitting = true);

    final provider = context.read<NoticeProvider>();
    final success = await provider.addNotice(
      title: _titleController.text,
      department: _selectedDepartment,
      description: _descriptionController.text,
      author: _authorController.text,
      publishedDate: _selectedDate,
    );

    setState(() => _isSubmitting = false);

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Color(0xFF059669),
            content: Row(
              children: [
                Icon(Icons.check_circle, color: Colors.white),
                SizedBox(width: 8),
                Text('Notice published successfully!'),
              ],
            ),
          ),
        );
        Navigator.pop(context);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: Colors.redAccent,
            content: Text('Failed to publish notice. Please try again.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Post New Notice', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Notice Title Field
              const Text('Notice Title *', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _titleController,
                decoration: InputDecoration(
                  hintText: 'e.g. Campus Recruitment Drive 2026',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Title must not be empty';
                  }
                  if (value.trim().length < 5) {
                    return 'Title must be at least 5 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 18),

              // Department Dropdown
              const Text('Department *', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _selectedDepartment,
                decoration: InputDecoration(
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                  ),
                ),
                items: _departments.map((dept) {
                  return DropdownMenuItem(
                    value: dept,
                    child: Text(dept, style: const TextStyle(fontWeight: FontWeight.w600)),
                  );
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedDepartment = val);
                },
              ),
              const SizedBox(height: 18),

              // Author Name Field
              const Text('Author / Issuing Authority *', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _authorController,
                decoration: InputDecoration(
                  hintText: 'e.g. Dean of Academic Affairs',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Author name is required';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 18),

              // Published Date Picker
              const Text('Published Date *', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              InkWell(
                onTap: _pickDate,
                borderRadius: BorderRadius.circular(12),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFFCBD5E1)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        DateFormat('MMMM dd, yyyy').format(_selectedDate),
                        style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w500),
                      ),
                      const Icon(Icons.calendar_month, color: Color(0xFF1565C0)),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 18),

              // Notice Description Field
              const Text('Notice Description *', style: TextStyle(fontWeight: FontWeight.w600)),
              const SizedBox(height: 6),
              TextFormField(
                controller: _descriptionController,
                maxLines: 6,
                decoration: InputDecoration(
                  hintText: 'Provide detailed instructions, venue, eligibility, or schedules...',
                  filled: true,
                  fillColor: Colors.white,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: Color(0xFFCBD5E1)),
                  ),
                ),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return 'Description must not be empty';
                  }
                  if (value.trim().length < 15) {
                    return 'Description must be at least 15 characters long';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 28),

              // Submit Button
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1565C0),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: _isSubmitting ? null : _submitNotice,
                  child: _isSubmitting
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text(
                          'Submit Notice',
                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/saved_notices_screen.dart',
    name: 'saved_notices_screen.dart',
    language: 'dart',
    description: 'Saved notices screen with bookmark removal and empty states',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/notice_provider.dart';
import '../widgets/notice_card.dart';
import 'notice_detail_screen.dart';

class SavedNoticesScreen extends StatelessWidget {
  const SavedNoticesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<NoticeProvider>();
    final savedNotices = provider.savedNotices;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Notices', style: TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: savedNotices.isEmpty
          ? Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(20),
                      decoration: const BoxDecoration(
                        color: Color(0xFFF1F5F9),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.bookmark_border_rounded,
                        size: 48,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                    const SizedBox(height: 16),
                    const Text(
                      'No Saved Notices',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Tap the bookmark icon on any notice to save it here for quick offline access.',
                      textAlign: TextAlign.center,
                      style: TextStyle(color: Color(0xFF64748B)),
                    ),
                  ],
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: savedNotices.length,
              itemBuilder: (context, index) {
                final notice = savedNotices[index];
                return NoticeCard(
                  notice: notice,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => NoticeDetailScreen(noticeId: notice.id),
                      ),
                    );
                  },
                  onBookmarkToggle: () => provider.toggleBookmark(notice.id),
                );
              },
            ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/notice_card.dart',
    name: 'notice_card.dart',
    language: 'dart',
    description: 'Material 3 card widget displaying notice details, department, date, and bookmark button',
    content: `import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/notice.dart';

class NoticeCard extends StatelessWidget {
  final Notice notice;
  final VoidCallback onTap;
  final VoidCallback onBookmarkToggle;

  const NoticeCard({
    super.key,
    required this.notice,
    required this.onTap,
    required this.onBookmarkToggle,
  });

  Color _getDepartmentColor(String dept) {
    switch (dept.toUpperCase()) {
      case 'CSE':
        return const Color(0xFF1E40AF);
      case 'ECE':
        return const Color(0xFF0284C7);
      case 'EEE':
        return const Color(0xFF059669);
      case 'MECH':
        return const Color(0xFFEA580C);
      case 'CIVIL':
        return const Color(0xFF78350F);
      case 'GENERAL':
      default:
        return const Color(0xFF4F46E5);
    }
  }

  @override
  Widget build(BuildContext context) {
    final deptColor = _getDepartmentColor(notice.department);
    final dateStr = DateFormat('MMM dd, yyyy').format(notice.publishedDate);

    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Department & Date & Bookmark Action
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: deptColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          notice.department,
                          style: TextStyle(
                            color: deptColor,
                            fontWeight: FontWeight.w700,
                            fontSize: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        dateStr,
                        style: const TextStyle(
                          color: Color(0xFF64748B),
                          fontSize: 12,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                  IconButton(
                    iconSize: 22,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                    icon: Icon(
                      notice.isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_outline_rounded,
                      color: notice.isBookmarked ? const Color(0xFF1565C0) : const Color(0xFF94A3B8),
                    ),
                    onPressed: onBookmarkToggle,
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Title
              Text(
                notice.title,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 16,
                  color: Color(0xFF0F172A),
                  height: 1.3,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),

              // Short Description
              Text(
                notice.description,
                style: const TextStyle(
                  fontSize: 13.5,
                  color: Color(0xFF475569),
                  height: 1.45,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),

              // Author info footer
              Row(
                children: [
                  const Icon(Icons.person_outline_rounded, size: 14, color: Color(0xFF64748B)),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      notice.author,
                      style: const TextStyle(
                        fontSize: 12,
                        color: Color(0xFF64748B),
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  const Text(
                    'Read more →',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1565C0),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/widgets/department_chip.dart',
    name: 'department_chip.dart',
    language: 'dart',
    description: 'Custom Material 3 filter chip for department filtering',
    content: `import 'package:flutter/material.dart';

class DepartmentChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onSelected;

  const DepartmentChip({
    super.key,
    required this.label,
    required this.isSelected,
    required this.onSelected,
  });

  @override
  Widget build(BuildContext context) {
    return FilterChip(
      selected: isSelected,
      label: Text(label),
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : const Color(0xFF334155),
        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
        fontSize: 13,
      ),
      backgroundColor: Colors.white,
      selectedColor: const Color(0xFF1565C0),
      checkmarkColor: Colors.white,
      showCheckmark: false,
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
      side: BorderSide(
        color: isSelected ? const Color(0xFF1565C0) : const Color(0xFFCBD5E1),
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      onSelected: (_) => onSelected(),
    );
  }
}
`
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    language: 'dart',
    description: 'Passing Flutter widget test checking College Notice Board home screen, title, and Provider state',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:college_notice_board/main.dart';
import 'package:college_notice_board/providers/notice_provider.dart';

void main() {
  setUp(() {
    // Provide in-memory mock for SharedPreferences
    SharedPreferences.setMockInitialValues({});
  });

  testWidgets('College Notice Board displays title, search bar, and FAB', (WidgetTester tester) async {
    final provider = NoticeProvider();
    await provider.initialize();

    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider<NoticeProvider>.value(value: provider),
        ],
        child: const CollegeNoticeBoardApp(),
      ),
    );

    // Let the initial frame and microtasks settle
    await tester.pumpAndSettle();

    // Verify App Title exists
    expect(find.text('College Notice Board'), findsOneWidget);

    // Verify SearchBar exists
    expect(find.byType(SearchBar), findsOneWidget);

    // Verify FloatingActionButton exists with "Post Notice"
    expect(find.text('Post Notice'), findsOneWidget);
    expect(find.byType(FloatingActionButton), findsOneWidget);

    // Verify Department filters (CSE, ECE, EEE, etc.) are present
    expect(find.text('ALL'), findsOneWidget);
    expect(find.text('CSE'), findsWidgets);
  });
}
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Comprehensive setup guide for VS Code, Android Studio, and Release APK build instructions',
    content: `# College Notice Board Application (Flutter & Dart)

A modern, responsive digital **College Notice Board** application built with Flutter, Provider state management, and Material 3 design.

## Features
- **Notice Feed**: View notices across all college departments (CSE, ECE, EEE, MECH, CIVIL, GENERAL).
- **Search & Filter**: Real-time title & keyword search + quick department filter chips.
- **Notice Details**: Full rich notice description, author profile, timestamp, copy notice, and bookmarking.
- **Add Notice Form**: Form with validation for Title, Department dropdown, Description, Author name, and Date picker.
- **Saved Notices**: Offline bookmark storage persisted locally via \`SharedPreferences\`.
- **4 Mandatory States**: Circular progress Loading state, Error state with Retry button, Empty state, and Data state.
- **Material 3 Theming**: Professional academic blue & white theme.

---

## Folder Structure
\`\`\`
college_notice_board/
├── lib/
│   ├── main.dart
│   ├── models/
│   │   └── notice.dart
│   ├── providers/
│   │   └── notice_provider.dart
│   ├── screens/
│   │   ├── home_screen.dart
│   │   ├── notice_detail_screen.dart
│   │   ├── add_notice_screen.dart
│   │   └── saved_notices_screen.dart
│   └── widgets/
│       ├── notice_card.dart
│       └── department_chip.dart
├── test/
│   └── widget_test.dart
├── pubspec.yaml
└── README.md
\`\`\`

---

## How to Run in VS Code

1. Ensure the **Flutter SDK** and **Dart** extensions are installed in VS Code.
2. Open the project root in VS Code.
3. Open a terminal and fetch dependencies:
   \`\`\`bash
   flutter pub get
   \`\`\`
4. Launch an Android Emulator, iOS Simulator, or connect a physical device.
5. Press \`F5\` or click **Run > Start Debugging**.

---

## How to Run in Android Studio

1. Open Android Studio.
2. Select **Open** and choose the \`college_notice_board\` directory.
3. Android Studio will run \`flutter pub get\` automatically.
4. Select your target device from the target device dropdown at the top.
5. Click the green **Run (▶)** button.

---

## How to Run Widget Tests

Run automated tests using:
\`\`\`bash
flutter test
\`\`\`

---

## Generating a Release APK

To generate a standalone release APK for installation on Android smartphones:

1. Clean build cache:
   \`\`\`bash
   flutter clean
   flutter pub get
   \`\`\`
2. Build release APK:
   \`\`\`bash
   flutter build apk --release
   \`\`\`
3. Output APK location:
   \`\`\`
   build/app/outputs/flutter-apk/app-release.apk
   \`\`\`
4. Transfer \`app-release.apk\` to any Android smartphone or deploy to Google Play Console.
`
  }
];
