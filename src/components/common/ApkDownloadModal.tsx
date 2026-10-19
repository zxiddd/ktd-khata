import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  X,
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  Copy,
  Check,
  Cpu,
  FolderGit2,
  Share2,
} from 'lucide-react';

export const ApkDownloadModal: React.FC = () => {
  const { closeModal } = useKhata();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [copied, setCopied] = React.useState(false);
  const [copiedCmd, setCopiedCmd] = React.useState(false);

  const appUrl = window.location.origin;
  const pwaBuilderUrl = `https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyBuildCmd = () => {
    navigator.clipboard.writeText('npm run android:sync && cd android && ./gradlew assembleDebug');
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      alert('To install directly on Android, open this link in Google Chrome, tap the 3 dots (⋮), and select "Install app".');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Native Android App</h2>
                <span className="text-[10px] bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full font-mono font-bold">
                  com.ktdkhata.app
                </span>
              </div>
              <p className="text-xs text-emerald-100">Native Android Project & APK Distribution</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Native Android Project Confirmation Badge */}
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="font-extrabold text-emerald-950">Native Android Application Ready</div>
              <div className="text-emerald-700 text-[11px]">
                Full Gradle & Capacitor native project generated in <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono font-bold">/android</code> with permissions & assets.
              </div>
            </div>
          </div>

          {/* Option 1: Instant Native Android WebAPK */}
          <div className="p-4 bg-slate-50 hover:bg-emerald-50/40 transition-colors rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                <Zap className="w-4 h-4 text-emerald-600 fill-current" />
                <span>Method 1: Direct 1-Tap Android Install (WebAPK)</span>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Recommended
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Google Chrome will package and install <strong>ktd khata</strong> directly into your Android phone’s App Drawer with high-res launcher icons, splash screen, offline storage, and zero browser bars.
            </p>

            <button
              onClick={handleInstallClick}
              className="w-full py-3 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              <span>
                {isInstalled
                  ? '✓ App Already Installed on Device'
                  : 'Install ktd khata on Android Now'}
              </span>
            </button>
          </div>

          {/* Option 2: Cloud APK Package Generator */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>Method 2: Download Standalone .APK File</span>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Sideloadable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Generate a signed, standalone <strong>.apk</strong> or <strong>.aab</strong> package for Google Play Store or direct sideloading on your phone via PWABuilder:
            </p>
            <a
              href={pwaBuilderUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Android APK via PWABuilder</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Option 3: Android Studio & Gradle Build */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
              <FolderGit2 className="w-4 h-4 text-slate-700" />
              <span>Method 3: Native Gradle & Android Studio</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open the created native project in Android Studio or compile directly with Gradle:
            </p>
            <div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[11px] flex items-center justify-between">
              <span className="truncate">cd android && ./gradlew assembleDebug</span>
              <button
                onClick={handleCopyBuildCmd}
                className="ml-2 text-xs text-white hover:text-emerald-300 flex-shrink-0 cursor-pointer"
              >
                {copiedCmd ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Outputs: <code className="font-mono text-slate-600">android/app/build/outputs/apk/debug/app-debug.apk</code>
            </p>
          </div>

          {/* App URL Share helper */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-[10px] text-slate-400 block font-bold">App URL to open on Phone:</span>
              <span className="text-xs font-mono text-slate-700 truncate block">{appUrl}</span>
            </div>
            <button
              onClick={handleCopyUrl}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1 flex-shrink-0 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 text-center">
          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
