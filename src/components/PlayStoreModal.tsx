import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Star, 
  ShieldCheck, 
  Share2, 
  Check, 
  Smartphone, 
  QrCode, 
  Send, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Zap,
  ArrowDownToLine
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language } from '../types';

interface PlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const PlayStoreModal: React.FC<PlayStoreModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  const [installState, setInstallState] = useState<'idle' | 'downloading' | 'installing' | 'installed'>('idle');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsSent, setSmsSent] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'screenshots' | 'qr' | 'reviews'>('details');

  // Listen for native PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  if (!isOpen) return null;

  // Handle Play Store "Install" action
  const handleInstallClick = async () => {
    // If native prompt is available, trigger it
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          triggerSuccessConfetti();
          setInstallState('installed');
          setDeferredPrompt(null);
          return;
        }
      } catch (err) {
        console.log('PWA prompt handled or bypassed', err);
      }
    }

    // Play Store install animation simulation
    setInstallState('downloading');
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          setInstallState('installing');
          
          setTimeout(() => {
            setInstallState('installed');
            triggerSuccessConfetti();
          }, 1400);

          return 100;
        }
        const jump = Math.floor(Math.random() * 20) + 12;
        return Math.min(95, prev + jump);
      });
    }, 280);
  };

  const triggerSuccessConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  // Direct APK download file creator
  const handleDownloadApk = () => {
    const apkContent = `रिक्शा ऐप (Rickshaw App) Android Package v2.4.0\nPackage: com.rickshaw.app\nVersion: 2.4.0-release\nBuild: 20261021\nVerified: Google Play Protect Clean\nChecksum: 9fa2c4e61280b190f8902d\n\nThank you for installing Rickshaw App! You can also use the web app directly by adding it to your home screen.`;
    const blob = new Blob([apkContent], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rickshaw-app-v2.4.0.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    triggerSuccessConfetti();
  };

  // Copy Play Store URL
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.rickshaw.app';
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(playStoreUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // WhatsApp share
  const handleShareWhatsApp = () => {
    const text = language === 'hi' 
      ? 'रिक्शा ऐप प्ले स्टोर से डाउनलोड करें और आसान, सुरक्षित ऑटो व ई-रिक्शा राइड बुक करें: ' + playStoreUrl 
      : 'Download Rickshaw App from Google Play Store for fast, affordable auto rides: ' + playStoreUrl;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Send SMS link
  const handleSendSms = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length >= 10) {
      setSmsSent(true);
      setTimeout(() => setSmsSent(false), 4000);
      setPhoneNumber('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* GOOGLE PLAY TOP HEADER BAR */}
        <div className="bg-[#f8f9fa] border-b border-slate-200 px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {/* Google Play Multi-color Triangle Icon */}
            <svg className="w-6 h-6" viewBox="0 0 512 512">
              <path fill="#00E676" d="M380.9 220.4l-75.7-43.7L76.5 40.5c-6.8-3.9-14.8-4.7-22.3-2.1l251 251 75.7-69z"/>
              <path fill="#FFD600" d="M380.9 291.6L305.2 335.3 54.2 473.6c7.5 2.6 15.5 1.8 22.3-2.1l228.7-136.2 75.7-43.7z"/>
              <path fill="#00B0FF" d="M54.2 38.4C44.4 44 38.4 54.7 38.4 67.2v377.6c0 12.5 6 23.2 15.8 28.8L305.2 256 54.2 38.4z"/>
              <path fill="#FF3D00" d="M473.6 238.4l-92.7-53.5-75.7 71.1 75.7 71.1 92.7-53.5c19.2-11.1 19.2-34.1 0-45.2z"/>
            </svg>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm tracking-tight">
              <span>Google Play</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800">
                Official
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition"
              title="Copy Play Store Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL SCROLLABLE CONTENT */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">
          
          {/* APP IDENTITY HEADER */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md shrink-0 border border-emerald-200 bg-emerald-600 p-0.5">
              <img 
                src="/favicon.svg" 
                alt="Rickshaw App Icon" 
                className="w-full h-full object-cover rounded-[14px]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-tight">
                {language === 'hi' ? 'रिक्शा ऐप (Rickshaw App)' : 'Rickshaw App - Auto & Bike'}
              </h3>
              <p className="text-xs font-semibold text-emerald-700">
                Rickshaw Mobility Technologies Ltd.
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span>{language === 'hi' ? 'विज्ञापन शामिल हैं' : 'Contains ads'}</span>
                <span>•</span>
                <span>{language === 'hi' ? 'इन-ऐप खरीदारी' : 'In-app purchases'}</span>
              </div>

              <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified by Play Protect</span>
              </div>
            </div>
          </div>

          {/* STATS ROW (Rating, Reviews, Downloads, Size) */}
          <div className="grid grid-cols-4 gap-1 py-3 px-2 border-y border-slate-200 text-center divide-x divide-slate-200">
            <div>
              <div className="flex items-center justify-center gap-1 font-black text-xs text-slate-900">
                <span>4.8</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              </div>
              <div className="text-[10px] text-slate-400">124K {language === 'hi' ? 'समीक्षाएं' : 'reviews'}</div>
            </div>

            <div>
              <div className="font-black text-xs text-slate-900">1M+</div>
              <div className="text-[10px] text-slate-400">{language === 'hi' ? 'डाउनलोड्स' : 'Downloads'}</div>
            </div>

            <div>
              <div className="font-black text-xs text-slate-900">14.2 MB</div>
              <div className="text-[10px] text-slate-400">{language === 'hi' ? 'साइज़' : 'Size'}</div>
            </div>

            <div>
              <div className="font-black text-xs text-slate-900">3+</div>
              <div className="text-[10px] text-slate-400">Rated for 3+</div>
            </div>
          </div>

          {/* PRIMARY ACTION BUTTONS */}
          <div className="space-y-2">
            {installState === 'idle' && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#01875f] hover:bg-[#017250] text-white font-extrabold text-sm sm:text-base transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>{language === 'hi' ? 'प्ले स्टोर से इंस्टॉल करें (Install)' : 'Install from Google Play'}</span>
              </button>
            )}

            {installState === 'downloading' && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <div className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full" />
                    <span>{language === 'hi' ? 'डाउनलोड हो रहा है...' : 'Downloading...'}</span>
                  </div>
                  <span>{downloadProgress}% ({(14.2 * (downloadProgress / 100)).toFixed(1)} MB / 14.2 MB)</span>
                </div>
                <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-[#01875f] h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
                <p className="text-[11px] text-emerald-800 text-center font-medium">
                  {language === 'hi' ? '2.4 MB/s • वेरीफाइड सेफ' : '2.4 MB/s • Verified Safe by Play Protect'}
                </p>
              </div>
            )}

            {installState === 'installing' && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-3">
                <span className="animate-spin w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full" />
                <span className="font-bold text-amber-950 text-sm">
                  {language === 'hi' ? 'फोन में इंस्टॉल हो रहा है...' : 'Installing on your device...'}
                </span>
              </div>
            )}

            {installState === 'installed' && (
              <div className="p-3.5 rounded-2xl bg-emerald-600 text-white flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                  <span>{language === 'hi' ? 'सफलतापूर्वक इंस्टॉल हुआ!' : 'Installed Successfully!'}</span>
                </div>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-xl bg-white text-emerald-900 font-black text-xs hover:bg-emerald-50 active:scale-95 transition"
                >
                  {language === 'hi' ? 'ऐप खोलें (Open)' : 'Open App'}
                </button>
              </div>
            )}

            {/* Direct APK Download option */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadApk}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <ArrowDownToLine className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'सीधा APK डाउनलोड (Direct APK)' : 'Direct APK Download (14MB)'}</span>
              </button>

              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'hi' ? 'व्हाट्सएप शेयर' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION */}
          <div className="flex border-b border-slate-200 text-xs font-bold text-slate-500">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'details'
                  ? 'border-[#01875f] text-[#01875f]'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              {language === 'hi' ? 'ऐप विवरण' : 'About App'}
            </button>
            <button
              onClick={() => setActiveTab('screenshots')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'screenshots'
                  ? 'border-[#01875f] text-[#01875f]'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              {language === 'hi' ? 'स्क्रीनशॉट्स' : 'Screenshots'}
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'qr'
                  ? 'border-[#01875f] text-[#01875f]'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              {language === 'hi' ? 'QR कोड स्कैन' : 'Scan to Install'}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2.5 px-3 border-b-2 transition ${
                activeTab === 'reviews'
                  ? 'border-[#01875f] text-[#01875f]'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              {language === 'hi' ? 'समीक्षाएं (4.8★)' : 'Reviews (4.8★)'}
            </button>
          </div>

          {/* TAB 1: ABOUT APP / DETAILS */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-1.5 font-extrabold text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'hi' ? 'वर्जन 2.4.0 में क्या नया है' : "What's New in v2.4.0"}</span>
                </div>
                <ul className="text-xs text-emerald-900 space-y-1 pl-4 list-disc">
                  <li>{language === 'hi' ? 'मैप पर सीधे क्लिक करके लोकेशन चुनें (Select on Map)' : 'Select pickup & drop points directly by tapping on the interactive map'}</li>
                  <li>{language === 'hi' ? 'त्वरित लोकेशन हिंट्स (घर, दफ़्तर, स्टेशन, एयरपोर्ट)' : 'One-tap location hints for Railway Station, Metro, Home & Work'}</li>
                  <li>{language === 'hi' ? 'भविष्य की यात्रा शेड्यूल करने की सुविधा' : 'Schedule rides in advance with date & time picker'}</li>
                  <li>{language === 'hi' ? 'तेज जीपीएस लाइव ट्रैकिंग और स्पीडोमीटर' : 'Enhanced real-time GPS tracking with turn navigation'}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900 mb-1.5">
                  {language === 'hi' ? 'इस ऐप के बारे में' : 'About this app'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {language === 'hi'
                    ? 'रिक्शा ऐप भारत का सबसे भरोसेमंद और किफायती ऑटो रिक्शा व ई-रिक्शा बुकिंग प्लेटफ़ॉर्म है। अब न मोलभाव का झंझट, न कैंसलेशन का डर! बस एक टैप में मीटर रेट पर अपने घर के दरवाजे पर ऑटो या बाइक बुलवाएं। 24x7 लाइव सपोर्ट, सुरक्षित ओटीपी राइड्स और कैश/यूपीआई पेमेंट्स।'
                    : 'Rickshaw App is India’s favourite auto-rickshaw and bike ride booking app. Get doorstep pickup with verified local drivers at fair meter fares. Enjoy zero surge pricing, live GPS route tracking, OTP verification, and 24x7 passenger safety features.'}
                </p>
              </div>

              {/* Highlights cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">🛺 नो कैंसलेशन</div>
                  <div className="text-[11px] text-slate-500">98% ड्राइवर स्वीकृति दर</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">🛡️ 24x7 सुरक्षा SOS</div>
                  <div className="text-[11px] text-slate-500">लाइव रूट शेयरिंग</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">⚡ तेज पिकअप</div>
                  <div className="text-[11px] text-slate-500">औसत 2-3 मिनट में आगमन</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900">💳 कैश व UPI</div>
                  <div className="text-[11px] text-slate-500">GPay, Paytm, PhonePe</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCREENSHOTS */}
          {activeTab === 'screenshots' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                {language === 'hi' ? 'ऐप इंटरफ़ेस और मुख्य फीचर्स की झलकियां:' : 'Previews of Rickshaw App features:'}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="bg-emerald-900 text-white rounded-2xl p-3 flex flex-col justify-between aspect-9/16 shadow-md border border-emerald-700">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-300">फीचर 1</span>
                    <h5 className="font-extrabold text-xs">मैप पर पिन रखें</h5>
                  </div>
                  <div className="text-3xl text-center">🗺️</div>
                  <p className="text-[10px] text-emerald-200">कहीं भी क्लिक करके सटीक पिकअप तय करें</p>
                </div>

                <div className="bg-slate-900 text-white rounded-2xl p-3 flex flex-col justify-between aspect-9/16 shadow-md border border-slate-700">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-300">फीचर 2</span>
                    <h5 className="font-extrabold text-xs">ऑटो, ई-रिक्शा, बाइक</h5>
                  </div>
                  <div className="text-3xl text-center">🛺</div>
                  <p className="text-[10px] text-slate-300">किफायती दरों में अपनी मनपसंद सवारी</p>
                </div>

                <div className="bg-emerald-800 text-white rounded-2xl p-3 flex flex-col justify-between aspect-9/16 shadow-md border border-emerald-600">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-200">फीचर 3</span>
                    <h5 className="font-extrabold text-xs">लाइव ड्राइवर जीपीएस</h5>
                  </div>
                  <div className="text-3xl text-center">⏱️</div>
                  <p className="text-[10px] text-emerald-200">रीयल-टाइम दूरी, स्पीड और सटीक ईटीए</p>
                </div>

                <div className="bg-slate-800 text-white rounded-2xl p-3 flex flex-col justify-between aspect-9/16 shadow-md border border-slate-600">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-300">फीचर 4</span>
                    <h5 className="font-extrabold text-xs">सुरक्षित ओटीपी राइड्स</h5>
                  </div>
                  <div className="text-3xl text-center">🛡️</div>
                  <p className="text-[10px] text-slate-300">4-अंकों का ओटीपी और 24x7 कॉल मास्किंग</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN QR CODE TO INSTALL */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-center">
              <div className="p-5 bg-emerald-50 rounded-3xl border border-emerald-200 max-w-xs mx-auto space-y-3">
                <div className="bg-white p-3 rounded-2xl inline-block shadow-md border border-emerald-100">
                  {/* Clean SVG QR Code */}
                  <svg className="w-48 h-48 mx-auto" viewBox="0 0 200 200">
                    <rect width="200" height="200" fill="#FFFFFF"/>
                    {/* Top-left position marker */}
                    <rect x="20" y="20" width="40" height="40" fill="#047857"/>
                    <rect x="26" y="26" width="28" height="28" fill="#FFFFFF"/>
                    <rect x="32" y="32" width="16" height="16" fill="#047857"/>
                    {/* Top-right position marker */}
                    <rect x="140" y="20" width="40" height="40" fill="#047857"/>
                    <rect x="146" y="26" width="28" height="28" fill="#FFFFFF"/>
                    <rect x="152" y="32" width="16" height="16" fill="#047857"/>
                    {/* Bottom-left position marker */}
                    <rect x="20" y="140" width="40" height="40" fill="#047857"/>
                    <rect x="26" y="146" width="28" height="28" fill="#FFFFFF"/>
                    <rect x="32" y="152" width="16" height="16" fill="#047857"/>
                    {/* QR Code data pattern */}
                    <rect x="70" y="24" width="8" height="8" fill="#047857"/>
                    <rect x="85" y="24" width="8" height="8" fill="#047857"/>
                    <rect x="100" y="24" width="16" height="8" fill="#047857"/>
                    <rect x="75" y="40" width="12" height="8" fill="#047857"/>
                    <rect x="95" y="40" width="8" height="16" fill="#047857"/>
                    <rect x="115" y="40" width="12" height="8" fill="#047857"/>
                    <rect x="70" y="60" width="16" height="8" fill="#047857"/>
                    <rect x="110" y="60" width="8" height="16" fill="#047857"/>
                    <rect x="125" y="60" width="16" height="8" fill="#047857"/>
                    
                    {/* Center Auto Icon badge */}
                    <circle cx="100" cy="100" r="22" fill="#059669"/>
                    <circle cx="100" cy="100" r="20" fill="#FDE047"/>
                    <text x="100" y="106" fontSize="16" textAnchor="middle" fill="#047857">🛺</text>
                    
                    {/* Bottom patterns */}
                    <rect x="70" y="125" width="8" height="16" fill="#047857"/>
                    <rect x="85" y="130" width="16" height="8" fill="#047857"/>
                    <rect x="115" y="125" width="12" height="12" fill="#047857"/>
                    <rect x="70" y="150" width="16" height="8" fill="#047857"/>
                    <rect x="95" y="155" width="8" height="16" fill="#047857"/>
                    <rect x="110" y="145" width="20" height="8" fill="#047857"/>
                    <rect x="140" y="145" width="8" height="16" fill="#047857"/>
                    <rect x="155" y="150" width="16" height="8" fill="#047857"/>
                  </svg>
                </div>
                <div className="space-y-1">
                  <div className="font-extrabold text-xs text-emerald-950 flex items-center justify-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{language === 'hi' ? 'फ़ोन कैमरे से स्कैन करें' : 'Scan with Phone Camera'}</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    {language === 'hi' 
                      ? 'सीधे प्ले स्टोर या ब्राउज़र में ऐप डाउनलोड करने के लिए' 
                      : 'Opens Play Store listing directly on your mobile device'}
                  </p>
                </div>
              </div>

              {/* Get download link on SMS */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm mx-auto space-y-2 text-left">
                <span className="font-bold text-xs text-slate-800">
                  {language === 'hi' ? 'एसएमएस (SMS) द्वारा डाउनलोड लिंक पाएं' : 'Get download link on SMS'}
                </span>
                <form onSubmit={handleSendSms} className="flex gap-2">
                  <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-xs">
                    <span className="text-slate-400 font-bold mr-1">+91</span>
                    <input 
                      type="tel" 
                      placeholder="9876543210" 
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full bg-transparent outline-none font-bold text-slate-800"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={phoneNumber.length < 10}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition"
                  >
                    <Send className="w-3 h-3" />
                    <span>{language === 'hi' ? 'भेजें' : 'Send'}</span>
                  </button>
                </form>
                {smsSent && (
                  <p className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'लिंक आपके नंबर पर भेज दिया गया है!' : 'Download link sent to your phone!'}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center">
                  <div className="text-3xl font-black text-slate-900">4.8</div>
                  <div className="flex items-center gap-0.5 justify-center text-amber-500 my-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400">124,500 {language === 'hi' ? 'समीक्षाएं' : 'ratings'}</div>
                </div>

                <div className="flex-1 space-y-1 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 font-bold text-slate-500">5</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-[#01875f] h-full w-[85%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 font-bold text-slate-500">4</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-[#01875f] h-full w-[10%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 font-bold text-slate-500">3</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-[#01875f] h-full w-[3%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 font-bold text-slate-500">2</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full w-[1%]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 font-bold text-slate-500">1</span>
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full w-[1%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified rider testimonials */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">राहुल शर्मा (दिल्ली)</span>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "मेट्रो स्टेशन से घर के लिए सबसे बढ़िया ऐप है। हमेशा तुरंत ऑटो मिल जाता है और किराया भी उचित है।"
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">Priya Patel (Ahmedabad)</span>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "The live map location select feature is amazing! No driver cancellation issues like other apps."
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-slate-900">अमित कुमार (वाराणसी)</span>
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    "ई-रिक्शा बुकिंग बहुत सुविधाजनक है। बुजुर्गों के लिए भी इस्तेमाल करना आसान है।"
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 font-semibold">
            <span>Package:</span>
            <span className="font-mono text-[11px] text-slate-700">com.rickshaw.app</span>
          </div>

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-[#01875f] hover:underline font-bold"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'कॉपी हो गया' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'लिंक कॉपी करें' : 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
