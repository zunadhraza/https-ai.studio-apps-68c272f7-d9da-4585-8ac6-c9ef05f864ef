import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../lib/main.dart';
import '../lib/providers/notice_provider.dart';

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
