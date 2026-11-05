import React, { useState } from 'react';
import { FLUTTER_PROJECT_FILES, FlutterFile } from '../data/flutterSourceCode';
import {
  Download,
  Copy,
  Check,
  FolderTree,
  FileCode,
  Terminal,
  Smartphone,
  Play,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react';
import JSZip from 'jszip';

export const FlutterCodeViewer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('lib/main.dart');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'code' | 'instructions'>('code');

  const currentFile: FlutterFile =
    FLUTTER_PROJECT_FILES.find((f) => f.path === selectedFilePath) || FLUTTER_PROJECT_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    setDownloadSuccess(false);

    try {
      const zip = new JSZip();
      const projectFolder = zip.folder('college_notice_board');

      if (projectFolder) {
        FLUTTER_PROJECT_FILES.forEach((file) => {
          projectFolder.file(file.path, file.content);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'college_notice_board_flutter.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Flutter & Dart Source Code Repository</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-medium">
                Material 3 + Provider
              </span>
            </h2>
            <p className="text-xs text-slate-400">Complete, ready-to-run mobile codebase</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* View Tab Switch */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'code'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Files ({FLUTTER_PROJECT_FILES.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('instructions')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'instructions'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Run & APK Guide
            </button>
          </div>

          {/* Download Zip */}
          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            {isZipping ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : downloadSuccess ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{downloadSuccess ? 'Downloaded!' : 'Download .ZIP'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'instructions' ? (
        /* Setup, VS Code, Android Studio, and Release APK instructions */
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm max-w-4xl">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-blue-400" />
              Quick Start Commands
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Unpack the downloaded zip file and execute in terminal:
            </p>
            <pre className="bg-slate-900 p-3 rounded-lg font-mono text-xs text-emerald-400 overflow-x-auto">
{`# 1. Enter the project directory
cd college_notice_board

# 2. Get dependencies
flutter pub get

# 3. Run the automated widget tests
flutter test

# 4. Launch on connected Android / iOS device or Chrome
flutter run`}
            </pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                How to Run in VS Code
              </h4>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>Install the <strong>Flutter</strong> and <strong>Dart</strong> extensions.</li>
                <li>Open the <code className="text-blue-300">college_notice_board</code> folder.</li>
                <li>Press <code className="text-blue-300">Ctrl+Shift+P</code> and select <strong>Flutter: Select Device</strong>.</li>
                <li>Press <code className="text-blue-300">F5</code> to start debugging.</li>
              </ol>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Play className="w-4 h-4 text-amber-400" />
                How to Run in Android Studio
              </h4>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1.5 leading-relaxed">
                <li>Select <strong>File &gt; Open</strong> and pick the directory.</li>
                <li>Android Studio will automatically resolve <code className="text-blue-300">pubspec.yaml</code>.</li>
                <li>Select your connected Android emulator or USB device.</li>
                <li>Click the green <strong>Run (▶)</strong> button.</li>
              </ol>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Generating Release APK for Android Smartphones
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              To build a production release APK for distribution:
            </p>
            <pre className="bg-slate-900 p-3 rounded-lg font-mono text-xs text-purple-300 overflow-x-auto">
{`flutter clean
flutter pub get
flutter build apk --release

# The compiled APK is created at:
# build/app/outputs/flutter-apk/app-release.apk`}
            </pre>
          </div>
        </div>
      ) : (
        /* Split Code Viewer */
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
          {/* File Tree Column */}
          <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-3 overflow-y-auto shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 px-2">
              <FolderTree className="w-3.5 h-3.5" />
              <span>Project Files</span>
            </div>
            <div className="space-y-1">
              {FLUTTER_PROJECT_FILES.map((file) => {
                const isSelected = file.path === selectedFilePath;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFilePath(file.path)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode
                        className={`w-3.5 h-3.5 shrink-0 ${
                          file.path.endsWith('.yaml')
                            ? 'text-amber-400'
                            : file.path.endsWith('.md')
                            ? 'text-emerald-400'
                            : 'text-blue-400'
                        }`}
                      />
                      <span className="truncate">{file.path}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-blue-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Column */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* File info bar */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-mono text-blue-400 font-bold">{currentFile.path}</span>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 text-[11px]">{currentFile.description}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Pre Container */}
            <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-200 bg-slate-900/90 selection:bg-blue-600 selection:text-white">
              <pre className="whitespace-pre">{currentFile.content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
