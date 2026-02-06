import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, MapPin, Clock, ShieldCheck, Battery, Smartphone, 
  CheckCircle2, ArrowRight, MessageCircle, Menu, X, Instagram, 
  ChevronDown, Loader2, Lock, LogOut, Trash2, Calendar, Table, 
  RefreshCw, AlertCircle, Wrench, CreditCard, Star, Search, Info,
  TrendingUp, HardDrive, Zap, Map, BookOpen, AlertTriangle, Droplets, Share2
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

/**
 * --- AYARLAR ---
 * Google Apps Script URL'niz.
 */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbztX6gRkelRy6MrZ29J_LnM1re01jR1hYMF3sqPM65MBrrG6mR5O3PSnjm2fmU6q5s7/exec"; 

const App = () => {
  const [view, setView] = useState('user'); // 'user', 'login', 'admin', 'blog'
  const [activeArticle, setActiveArticle] = useState(null); // Blog detay kontrolü
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  
  // Parallax Scroll State
  const [scrollY, setScrollY] = useState(0);
  
  // Takip Sistemi State
  const [trackCode, setTrackCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Before/After Slider State
  const [sliderPos, setSliderPos] = useState(50);
  const sliderRef = useRef(null);

  // Güvenlik: Vercel Ortam Değişkenleri
  const getEnv = (key, fallback) => {
    try {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const ADMIN_USERNAME = getEnv('VITE_ADMIN_USER', 'lapella');
  const ADMIN_PASSWORD = getEnv('VITE_ADMIN_PASS', 'Mami@@@2812');
  
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
  
  // Form Verileri
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: 'Buca',
    address: '',
    bookingDate: '',
    bookingTime: 'Öğleden Önce (09:00 - 12:00)'
  });

  const phoneNumber = "0532 427 28 12";
  const whatsappNumber = "905324272812";

  const prices = {
    "iPhone X": { screen: 2850, battery: 1350 }, "iPhone XR": { screen: 2650, battery: 1350 },
    "iPhone XS": { screen: 2950, battery: 1400 }, "iPhone XS Max": { screen: 3450, battery: 1450 },
    "iPhone 11": { screen: 3100, battery: 1550 }, "iPhone 11 Pro": { screen: 3850, battery: 1650 },
    "iPhone 11 Pro Max": { screen: 4250, battery: 1750 }, "iPhone 12 mini": { screen: 4450, battery: 1850 },
    "iPhone 12": { screen: 4950, battery: 1950 }, "iPhone 12 Pro": { screen: 5450, battery: 1950 },
    "iPhone 12 Pro Max": { screen: 6250, battery: 2100 }, "iPhone 13 mini": { screen: 5850, battery: 2250 },
    "iPhone 13": { screen: 6450, battery: 2250 }, "iPhone 13 Pro": { screen: 8750, battery: 2450 },
    "iPhone 13 Pro Max": { screen: 9850, battery: 2650 }, "iPhone 14": { screen: 7850, battery: 2650 },
    "iPhone 14 Plus": { screen: 8950, battery: 2850 }, "iPhone 14 Pro": { screen: 11250, battery: 3100 },
    "iPhone 14 Pro Max": { screen: 12450, battery: 3350 }, "iPhone 15": { screen: 10500, battery: 3250 },
    "iPhone 15 Plus": { screen: 11850, battery: 3450 }, "iPhone 15 Pro": { screen: 14250, battery: 3650 },
    "iPhone 15 Pro Max": { screen: 15950, battery: 3850 }, "iPhone 16": { screen: 12500, battery: 3550 },
    "iPhone 16 Plus": { screen: 13850, battery: 3750 }, "iPhone 16 Pro": { screen: 16500, battery: 3950 },
    "iPhone 16 Pro Max": { screen: 18500, battery: 4250 },
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchRequests = async () => {
    if (!SHEET_URL) return;
    setIsLoading(true);
    try {
      const response = await fetch(SHEET_URL);
      const data = await response.json();
      if (Array.isArray(data)) setRequests(data.reverse());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'admin') fetchRequests();
  }, [view]);

  // Merkezi Kaydırma Fonksiyonu
  const scrollToSection = (id) => {
    // Eğer farklı bir sayfadaysak (blog vb.), önce ana sayfaya geç
    if (view !== 'user') {
      setView('user');
      // React'in render etmesini beklemek için kısa bir gecikme
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      // Zaten ana sayfadaysak direkt kaydır
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const currentPrice = selectedModel && selectedService && prices[selectedModel] 
    ? (selectedService === 'Ekran Değişimi' ? prices[selectedModel].screen : prices[selectedModel].battery)
    : null;

  // Slider Logic
  const handleSliderMove = (e) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    if (clientX < rect.left || clientX > rect.right) return;
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const handleTrack = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(SHEET_URL)
      .then(res => res.json())
      .then(data => {
        const order = data.find(r => r.phone.replace(/\s/g, '').includes(trackCode));
        setTrackedOrder(order || "NOT_FOUND");
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModel || !selectedService) { alert("Model ve işlem seçiniz."); return; }
    setIsLoading(true);

    const payload = {
      ...formData,
      model: selectedModel,
      service: selectedService,
      price: currentPrice ? currentPrice.toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz"
    };

    const message = `🛠️ *YENİ SERVİS TALEBİ* 🛠️\n\n` +
      `👤 *Müşteri:* ${payload.name}\n` +
      `📞 *Tel:* ${payload.phone}\n` +
      `📅 *Randevu:* ${payload.bookingDate} (${payload.bookingTime})\n` +
      `📍 *Bölge:* ${payload.area}\n` +
      `🏠 *Adres:* ${payload.address}\n\n` +
      `📱 *Cihaz:* ${payload.model}\n` +
      `🔧 *İşlem:* ${payload.service}\n` +
      `💰 *Fiyat:* ${payload.price}`;

    try {
      if (SHEET_URL) fetch(SHEET_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      setTimeout(() => { window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank'); setFormStep(2); setIsLoading(false); }, 500);
    } catch (err) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setFormStep(2); setIsLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCreds.username === ADMIN_USERNAME && adminCreds.password === ADMIN_PASSWORD) setView('admin');
    else alert("Giriş bilgileri yanlış!");
  };

  // --- UI BİLEŞENLERİ ---

  // SEO ODAKLI BLOG SAYFASI
  if (view === 'blog') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
        <nav className="glass-nav border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600"/>
            <span className="font-black text-slate-800 uppercase tracking-tighter">iPhone Rehberi</span>
          </div>
          <button onClick={() => {setView('user'); setActiveArticle(null)}} className="text-slate-600 font-bold hover:text-blue-600 transition flex items-center gap-2"><ArrowRight className="rotate-180" size={18}/> Geri Dön</button>
        </nav>
        
        <div className="container mx-auto p-6 max-w-4xl py-12 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          {!activeArticle ? (
            <div className="space-y-12 relative z-10">
              <div className="text-center space-y-4">
                <span className="bg-blue-100/80 backdrop-blur text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">İzmir Teknik Servis Blogu</span>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">iPhone Bakım & Onarım Rehberi</h1>
                <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">Cihazınızın ömrünü uzatacak ipuçları ve teknik servis süreçleri hakkında uzman görüşleri.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div onClick={() => setActiveArticle('battery')} className="glass-card p-8 rounded-[32px] hover:scale-[1.02] transition cursor-pointer group border border-white/40 shadow-xl">
                  <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center text-green-600 mb-6"><Battery size={28} /></div>
                  <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition">iPhone Pil Sağlığı Nasıl Korunur?</h2>
                  <p className="text-slate-600 line-clamp-3">Batarya sağlığınızı %100'de tutmanın sırları, şarj döngüleri ve İzmir sıcağının pile etkileri hakkında detaylı rehber.</p>
                  <span className="text-blue-600 font-bold text-sm mt-4 block uppercase tracking-wide">Devamını Oku &rarr;</span>
                </div>

                <div onClick={() => setActiveArticle('faceid')} className="glass-card p-8 rounded-[32px] hover:scale-[1.02] transition cursor-pointer group border border-white/40 shadow-xl">
                  <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 mb-6"><Lock size={28} /></div>
                  <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition">Face ID Tamiri Mümkün mü?</h2>
                  <p className="text-slate-600 line-clamp-3">"Face ID kullanılamıyor" hatası neden olur? TrueDepth kamera onarımı ve anakart müdahalesi hakkında teknik detaylar.</p>
                  <span className="text-blue-600 font-bold text-sm mt-4 block uppercase tracking-wide">Devamını Oku &rarr;</span>
                </div>

                <div onClick={() => setActiveArticle('screen')} className="glass-card p-8 rounded-[32px] hover:scale-[1.02] transition cursor-pointer group border border-white/40 shadow-xl">
                  <div className="bg-blue-100 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><Smartphone size={28} /></div>
                  <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition">Revize Ekran vs Orijinal Ekran</h2>
                  <p className="text-slate-600 line-clamp-3">Ekran değişiminde kandırılmayın. Cam değişimi ile panel değişimi arasındaki farklar ve True Tone aktarımı.</p>
                  <span className="text-blue-600 font-bold text-sm mt-4 block uppercase tracking-wide">Devamını Oku &rarr;</span>
                </div>

                <div onClick={() => setActiveArticle('water')} className="glass-card p-8 rounded-[32px] hover:scale-[1.02] transition cursor-pointer group border border-white/40 shadow-xl">
                  <div className="bg-cyan-100 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-600 mb-6"><Droplets size={28} /></div>
                  <h2 className="text-2xl font-black mb-3 group-hover:text-blue-600 transition">Suya Düşen iPhone'a İlk Müdahale</h2>
                  <p className="text-slate-600 line-clamp-3">Pirince koymak işe yarar mı? Hoparlörden su çıkarma sesleri güvenli mi? Oksitlenmeden kurtulma yolları.</p>
                  <span className="text-blue-600 font-bold text-sm mt-4 block uppercase tracking-wide">Devamını Oku &rarr;</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[40px] shadow-2xl border border-white/50 relative z-10 animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setActiveArticle(null)} className="mb-8 text-slate-500 font-bold flex items-center gap-2 hover:text-blue-600"><ArrowRight className="rotate-180"/> Listeye Dön</button>
              
              {activeArticle === 'battery' && (
                <article className="prose prose-slate lg:prose-xl">
                  <h1 className="text-4xl font-black text-slate-900 mb-6">iPhone Pil Sağlığı Nasıl Korunur?</h1>
                  <p className="text-lg leading-relaxed mb-6">iPhone'unuzun bataryası zamanla tükenen kimyasal bir bileşendir. Ancak doğru kullanım alışkanlıkları ile bu süreci yavaşlatabilir ve telefonunuzu yıllarca tam performansla kullanabilirsiniz.</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Şarj Döngüsünü Yönetin</h3>
                  <p className="mb-4">Apple lityum-iyon pilleri %20 ile %80 arasında tutmayı sever. Telefonunuzu sürekli %0'a kadar bitirmek veya gece boyu %100'de tutmak pil hücrelerini strese sokar.</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Sıcaklık Düşmanınızdır</h3>
                  <p className="mb-4">İzmir gibi sıcak şehirlerde, telefonu güneş altında araç ön konsolunda bırakmak pile kalıcı hasar verir. 35°C üzeri sıcaklıklar pil kapasitesini kalıcı olarak düşürebilir.</p>
                  <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
                    <p className="font-bold text-blue-800">Servis Notu:</p>
                    <p className="text-blue-700">Pil sağlığınız %80'in altına düştüyse yazılımsal yavaşlatma başlar. Servisimizde 20 dakikada, pil sağlığını %100'e getiren orijinal kapasiteli değişim yapıyoruz.</p>
                  </div>
                </article>
              )}

              {activeArticle === 'faceid' && (
                <article className="prose prose-slate lg:prose-xl">
                  <h1 className="text-4xl font-black text-slate-900 mb-6">Face ID Tamiri Mümkün mü?</h1>
                  <p className="text-lg leading-relaxed mb-6">Birçok kullanıcı Face ID bozulduğunda telefonun bir daha asla yüz okumayacağını sanır. Ancak bu doğru değildir. Face ID, TrueDepth kamera sistemi ve Dot Projector (Nokta Projeksiyonu) bileşenlerinden oluşur.</p>
                  <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Onarım Süreci</h3>
                  <p className="mb-6">Eskiden Face ID parçaları anakarta şifreliydi ve değişimi imkansızdı. Ancak yeni tekniklerle, eski sensörden şifreli çip alınıp yeni bir flex kabloya aktarılarak (Mikro Lehimleme) Face ID %100 onarılabilmektedir.</p>
                </article>
              )}

              {(activeArticle === 'screen' || activeArticle === 'water') && (
                <div className="text-center py-20">
                  <Wrench size={64} className="mx-auto text-slate-300 mb-4"/>
                  <h2 className="text-2xl font-bold text-slate-400">Bu makale hazırlanıyor...</h2>
                  <p className="text-slate-400">Çok yakında eklenecek.</p>
                </div>
              )}

              <button onClick={() => scrollToSection('appointment')} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition shadow-lg mt-12">Hemen Servis Randevusu Al</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Admin View
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="glass-nav bg-white/80 border-b border-white/20 px-6 py-4 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Smartphone size={20}/></div>
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">YÖNETİCİ PANELİ</span>
          </div>
          <button onClick={() => setView('user')} className="text-red-500 font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm"><LogOut size={18}/> Çıkış</button>
        </nav>
        <div className="container mx-auto p-6 max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black">Talepler ({requests.length})</h2>
            <button onClick={fetchRequests} className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200"><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''}/></button>
          </div>
          <div className="grid gap-4">
            {requests.map((req, idx) => (
              <div key={idx} className="glass-card bg-white/60 p-6 rounded-[32px] border border-white/50 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition backdrop-blur-sm">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">YENİ</span>
                    <span className="text-slate-400 text-xs font-bold">{req.date ? new Date(req.date).toLocaleString('tr-TR') : 'Bugün'}</span>
                  </div>
                  <h4 className="font-black text-xl">{req.name}</h4>
                  <p className="text-blue-600 font-bold flex items-center gap-2 underline"><Phone size={14}/> {req.phone}</p>
                  <p className="text-slate-500 text-sm font-medium">{req.area} - {req.address}</p>
                  <p className="text-orange-600 text-xs font-bold uppercase tracking-widest">🗓️ Randevu: {req.bookingDate} | {req.bookingTime}</p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-3xl md:w-64 flex flex-col justify-center text-center border border-slate-800 shadow-xl">
                  <p className="text-[10px] text-blue-400 font-bold uppercase mb-1 tracking-widest">{req.model}</p>
                  <p className="text-sm font-medium">{req.service}</p>
                  <p className="font-black mt-2 text-2xl text-white">{req.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Login View
  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-20"></div>

        <div className="glass-card bg-white/10 p-10 rounded-[40px] w-full max-w-md shadow-2xl backdrop-blur-xl border border-white/10 relative z-10">
          <div className="text-center mb-8">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur"><Lock className="text-white"/></div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">GİRİŞ YAP</h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input required type="text" placeholder="Kullanıcı" className="w-full p-4 bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 font-bold text-white placeholder-white/30" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
            <input required type="password" placeholder="Şifre" className="w-full p-4 bg-white/5 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white/10 font-bold text-white placeholder-white/30" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/50 hover:bg-blue-500 transition">Panel Girişi</button>
            <button type="button" onClick={() => setView('user')} className="w-full text-white/50 font-bold text-sm hover:text-white transition">İptal</button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN USER VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-500/30"><Smartphone size={24} /></div>
            <span className="text-xl font-bold tracking-tight text-slate-900 uppercase">iZMiR iPHONE <span className="text-blue-600 font-black">KAPINDA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('home')} className="hover:text-blue-600 transition font-bold text-sm">Ana Sayfa</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition font-bold text-sm">Hizmetler</button>
            <button onClick={() => setView('blog')} className="hover:text-blue-600 transition font-bold text-sm">Rehber</button>
            <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 text-white font-bold text-sm">Randevu Al</button>
          </div>
          <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t absolute w-full p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top">
            <button onClick={() => scrollToSection('pricing')} className="text-left font-bold text-slate-700 py-2 border-b">Fiyatlar</button>
            <button onClick={() => {setView('blog'); setIsMenuOpen(false);}} className="text-left font-bold text-slate-700 py-2 border-b">Bakım Rehberi</button>
            <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white p-3 rounded-lg text-center font-bold">Randevu Al</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-blue-300 rounded-full blur-[120px] opacity-30 -z-10" style={{ transform: `translateY(${scrollY * 0.2}px)` }}></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full blur-[120px] opacity-30 -z-10" style={{ transform: `translateY(${scrollY * -0.1}px)` }}></div>

        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block glass-card bg-white/50 border border-white/50 backdrop-blur px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider text-blue-800 shadow-sm">İzmir'in En Hızlı iPhone Teknik Servisi</div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter uppercase">
              İzmir iPhone <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Tamir Hizmeti</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
              İzmir'in her semtinde kapınızdan alıyor, orijinal kalitede parçalarla onarıp aynı gün adresinize teslim ediyoruz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 text-white">
              <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 text-white">Hemen Randevu Oluştur <ArrowRight className="w-5 h-5" /></button>
              <a href={`https://wa.me/${whatsappNumber}`} className="glass-card bg-white/80 border border-white text-slate-800 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition shadow-xl flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5 text-green-600" /> WhatsApp Destek</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
             <div className="relative z-10 animate-float bg-white/60 backdrop-blur-xl p-4 rounded-[40px] shadow-2xl border border-white/50 overflow-hidden max-w-sm">
                <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_96onscat.json" background="transparent" speed="1" style={{width: '300px', height: '300px'}} loop autoplay></lottie-player>
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-4 rounded-3xl text-center shadow-lg">
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Canlı Durum</p>
                   <p className="text-lg font-black tracking-tighter text-slate-900">Kurye Yolda</p>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 relative">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-widest text-slate-900 leading-tight">İzmir Yerinde iPhone Servisi</h2>
          <div className="grid md:grid-cols-3 gap-8 text-slate-900">
             {[
               { icon: <Smartphone size={32}/>, title: "Ekran Değişimi", desc: "30 dakikada montaj, True Tone aktarımı ve sıvı koruma bandı." },
               { icon: <Battery size={32}/>, title: "Batarya Değişimi", desc: "%100 pil sağlığı, garantili montaj ve yüksek kapasite." },
               { icon: <ShieldCheck size={32}/>, title: "Garantili Onarım", desc: "Lazer teknolojisi ile kasa değişmeden kusursuz cam onarımı." }
             ].map((item, i) => (
                <div key={i} className="group p-8 rounded-[32px] bg-white/60 backdrop-blur-md border border-white/50 hover:bg-white transition duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner text-blue-600 group-hover:scale-110 transition">{item.icon}</div>
                  <h3 className="font-black text-xl mb-3 uppercase tracking-tighter">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[150px] -z-10"></div>
        <div className="container mx-auto px-4 max-w-4xl text-center text-slate-900">
          <div className="glass-card bg-white/70 p-8 rounded-[50px] border border-white/60 shadow-xl backdrop-blur-xl grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Fiyat Hesapla</h2>
              <p className="text-slate-500 text-sm font-medium">Modelinizi seçin, İzmir iPhone ekran ve batarya değişim fiyatlarını anında görün.</p>
              <select className="w-full p-5 bg-white/80 border border-white rounded-2xl font-bold shadow-sm outline-none text-slate-700 appearance-none" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Model Seçiniz...</option>
                {Object.keys(prices).map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex gap-2">
                {['Ekran Değişimi', 'Batarya Değişimi'].map(t => (
                  <button key={t} onClick={() => setSelectedService(t)} className={`flex-1 p-4 rounded-2xl font-black text-xs transition ${selectedService === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-slate-400 border border-slate-100'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-10 -top-10 text-white/10 group-hover:scale-110 transition duration-500"><Zap size={150} /></div>
               <p className="text-blue-100 text-xs font-bold uppercase mb-2 tracking-widest relative z-10">Net Ücret (Kurye Dahil)</p>
               <div className="text-5xl font-black tracking-tighter uppercase relative z-10">{currentPrice ? `${currentPrice.toLocaleString('tr-TR')} ₺` : '---'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section id="appointment" className="py-20 relative">
        <div className="container mx-auto px-4 max-w-2xl text-slate-900 relative z-10">
            <div className="glass-card bg-white/80 p-8 md:p-12 rounded-[50px] shadow-2xl border border-white backdrop-blur-xl">
                {formStep === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6 text-slate-900">
                        <h2 className="text-3xl font-black text-center mb-8 uppercase text-slate-900 tracking-tighter">Hemen Başvur</h2>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-slate-900">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Ad Soyad</label>
                                <input required type="text" placeholder="Örn: Ahmet Yılmaz" className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white shadow-inner font-bold text-slate-900 placeholder-slate-400" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Telefon</label>
                                <input required type="tel" placeholder="05XX XXX XX XX" className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white shadow-inner font-bold text-slate-900 placeholder-slate-400" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Tarih</label>
                                <input required type="date" className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white shadow-inner font-bold text-slate-900" value={formData.bookingDate} onChange={(e) => setFormData({...formData, bookingDate: e.target.value})} />
                            </div>
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Saat</label>
                                <select className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white shadow-inner font-bold text-slate-900" value={formData.bookingTime} onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}>
                                    <option>Sabah (09:00 - 12:00)</option>
                                    <option>Öğleden Sonra (12:00 - 18:00)</option>
                                    <option>Akşam (18:00 - 21:00)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1 text-slate-900">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Bölge</label>
                            <select className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white shadow-inner font-bold text-slate-900" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
                                {['Buca', 'Bornova', 'Karşıyaka', 'Konak', 'Balçova', 'Gaziemir', 'Bayraklı', 'Çiğli', 'Mavişehir', 'Diğer'].map(area => <option key={area} value={area}>{area}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1 text-slate-900">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Tam Adres</label>
                            <textarea required placeholder="Cihazın teslim alınacağı tam adresiniz..." className="w-full p-5 bg-white/50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-white h-24 shadow-inner font-bold text-slate-900 placeholder-slate-400" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-[32px] space-y-4 border border-blue-100">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest text-center mb-2">Onarım Özeti</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Model</label>
                                <div className="relative">
                                  <select required className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-sm font-bold appearance-none text-sm text-slate-900" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                      <option value="">Seçiniz...</option>
                                      {Object.keys(prices).map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">İşlem</label>
                                <div className="relative">
                                  <select required className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-sm font-bold appearance-none text-sm text-slate-900" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                      <option value="">Seçiniz...</option>
                                      <option value="Ekran Değişimi">Ekran Değişimi</option>
                                      <option value="Batarya Değişimi">Batarya Değişimi</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-blue-50 text-slate-900">
                            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-tighter"><CreditCard size={18} className="text-blue-600"/><span className="text-[10px]">Onarım Bedeli</span></div>
                            <div className="text-xl font-black text-blue-600 tracking-tighter">{currentPrice ? `${currentPrice.toLocaleString('tr-TR')} ₺` : '---'}</div>
                          </div>
                        </div>
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-200 uppercase tracking-widest text-white">
                          {isLoading ? <Loader2 className="animate-spin" /> : "Talebi Onayla & WhatsApp"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-10 animate-in zoom-in text-slate-900">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-slate-900">Randevunuz Hazır!</h3>
                        <p className="text-slate-500 mb-8 font-medium">Lütfen WhatsApp ekranında mesajı gönderin. Randevu saatinizde <b className="text-blue-600">{phoneNumber}</b> teknik ekibimiz adresinizde olacaktır.</p>
                        <button onClick={() => setFormStep(1)} className="text-blue-600 font-bold hover:underline tracking-tight">Yeni Bir Talep Gönder</button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Order Tracking System */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-xl">
           <div className="bg-white p-10 rounded-[40px] shadow-xl text-center space-y-6 border border-slate-100">
               <div className="bg-blue-600 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-100 text-white"><Search /></div>
               <h2 className="text-2xl font-black uppercase tracking-widest text-slate-900">Cihaz Takip Sistemi</h2>
               <p className="text-slate-500 font-medium">Telefon numaranızı yazarak onarım durumunuzu anlık görün.</p>
               <form onSubmit={handleTrack} className="space-y-4">
                   <input required type="tel" placeholder="05XX XXX XX XX" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 text-center font-black text-slate-900" value={trackCode} onChange={e => setTrackCode(e.target.value.replace(/\s/g, ''))} />
                   <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                       {isLoading ? <Loader2 className="animate-spin" /> : <><RefreshCw size={18}/> Sorgula</>}
                   </button>
               </form>

               {trackedOrder === "NOT_FOUND" && (
                   <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold animate-in fade-in">Bu numara ile kayıtlı talep bulunamadı.</div>
               )}

               {trackedOrder && trackedOrder !== "NOT_FOUND" && (
                   <div className="bg-blue-50 p-6 rounded-3xl space-y-3 animate-in slide-in-from-bottom border border-blue-100">
                       <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Onarım Durumu</p>
                       <div className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm">
                           <span className="font-bold text-slate-700">{trackedOrder.model}</span>
                           <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase">İşlemde</span>
                       </div>
                       <div className="space-y-4 pt-4">
                           <div className="flex items-center gap-4 text-left">
                               <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"><CheckCircle2 size={16}/></div>
                               <div><p className="font-black text-sm text-slate-900">Talep Onaylandı</p><p className="text-xs text-slate-400">Kurye ataması yapıldı.</p></div>
                           </div>
                           <div className="flex items-center gap-4 text-left">
                               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse"><Smartphone size={16}/></div>
                               <div><p className="font-black text-sm text-slate-900">Onarım Başladı</p><p className="text-xs text-slate-400">Teknisyenimiz adresinize yaklaşıyor.</p></div>
                           </div>
                       </div>
                   </div>
               )}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
            <p className="font-black text-xl mb-4 uppercase tracking-tighter">İzmir iPhone Kapında Servisi</p>
            <p className="text-slate-400 text-xs mb-8 max-w-sm mx-auto font-medium leading-relaxed">Buca, Bornova, Karşıyaka ve İzmir'in tüm bölgelerinde kapıda iPhone ekran değişimi, batarya tamiri ve teknik servis desteği.</p>
            <div className="flex justify-center gap-6 mb-12">
               <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} aria-label="Bizi Arayın" className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition text-white"><Phone size={24} /></a>
               <a href={`https://wa.me/${whatsappNumber}`} aria-label="WhatsApp Hattı" className="bg-white/5 p-4 rounded-2xl hover:bg-green-600 transition text-white"><MessageCircle size={24} /></a>
            </div>
            <p className="text-[10px] text-slate-500 font-black uppercase mb-12 tracking-[6px]">İLETİŞİM HATTI: {phoneNumber}</p>
            <button onClick={() => setView('login')} className="text-[10px] text-slate-600 hover:text-blue-500 transition uppercase tracking-[3px] font-bold outline-none opacity-50 hover:opacity-100">Yönetici Girişi</button>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white text-white shadow-blue-500/30"><Phone size={24} /></a>
          <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white text-white shadow-green-500/30"><MessageCircle size={24} /></a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); }
        .glass-nav { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(12px); }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}} />
      <SpeedInsights />
    </div>
  );
};

export default App;
