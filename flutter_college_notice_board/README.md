# College Notice Board Application (Flutter & Dart)

A modern, responsive digital **College Notice Board** application built with Flutter, Provider state management, and Material 3 design.

## Features
- **Notice Feed**: View notices across all college departments (CSE, ECE, EEE, MECH, CIVIL, GENERAL).
- **Search & Filter**: Real-time title & keyword search + quick department filter chips.
- **Notice Details**: Full rich notice description, author profile, timestamp, copy notice, and bookmarking.
- **Add Notice Form**: Form with validation for Title, Department dropdown, Description, Author name, and Date picker.
- **Saved Notices**: Offline bookmark storage persisted locally via `SharedPreferences`.
- **4 Mandatory States**: Circular progress Loading state, Error state with Retry button, Empty state, and Data state.
- **Material 3 Theming**: Professional academic blue & white theme.

---

## Folder Structure
```
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
```

---

## How to Run in VS Code

1. Ensure the **Flutter SDK** and **Dart** extensions are installed in VS Code.
2. Open the project root in VS Code.
3. Open a terminal and fetch dependencies:
   ```bash
   flutter pub get
   ```
4. Launch an Android Emulator, iOS Simulator, or connect a physical device.
5. Press `F5` or click **Run > Start Debugging**.

---

## How to Run in Android Studio

1. Open Android Studio.
2. Select **Open** and choose the `college_notice_board` directory.
3. Android Studio will run `flutter pub get` automatically.
4. Select your target device from the target device dropdown at the top.
5. Click the green **Run (▶)** button.

---

## How to Run Widget Tests

Run automated tests using:
```bash
flutter test
```

---

## Generating a Release APK

To generate a standalone release APK for installation on Android smartphones:

1. Clean build cache:
   ```bash
   flutter clean
   flutter pub get
   ```
2. Build release APK:
   ```bash
   flutter build apk --release
   ```
3. Output APK location:
   ```
   build/app/outputs/flutter-apk/app-release.apk
   ```
4. Transfer `app-release.apk` to any Android smartphone or deploy to Google Play Console.
