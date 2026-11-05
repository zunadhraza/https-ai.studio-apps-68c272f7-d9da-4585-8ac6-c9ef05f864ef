import 'package:flutter/material.dart';
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
    // Material 3 Theme with College Blue as seed color
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
