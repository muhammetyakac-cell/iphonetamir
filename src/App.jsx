import React, { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Clock, ShieldCheck, Battery, Smartphone, 
  CheckCircle2, ArrowRight, MessageCircle, Menu, X, Instagram, 
  ChevronDown, Loader2, Lock, LogOut, Trash2, Calendar, Table, 
  RefreshCw, AlertCircle, Wrench, CreditCard, Star, Search, Info,
  TrendingUp, HardDrive, Zap, Map, BookOpen, AlertTriangle, Droplets
} from 'lucide-react';

/**
 * --- AYARLAR ---
 * Google Apps Script URL'nizi buraya yapıştırın.
 */
const SHEET_URL = "https://script.google.com/macros/s/AKfycbztX6gRkelRy6MrZ29J_LnM1re01jR1hYMF3sqPM65MBrrG6mR5O3PSnjm2fmU6q5s7/exec"; 

const App = () => {
  const [view, setView] = useState('user'); // 'user', 'login', 'admin', 'blog'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);
  
  // Takip Sistemi State
  const [trackCode, setTrackCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);

  // Güvenlik: Vercel Ortam Değişkenleri
  const getEnv = (key, fallback) => {
    try {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const ADMIN_USERNAME = getEnv('VITE_ADMIN_USER',);
  const ADMIN_PASSWORD = getEnv('VITE_ADMIN_PASS',);
  
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
    const handleScroll = () => setScrolled(window.scrollY > 50);
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

  const currentPrice = selectedModel && selectedService && prices[selectedModel] 
    ? (selectedService === 'Ekran Değişimi' ? prices[selectedModel].screen : prices[selectedModel].battery)
    : null;

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
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600"/>
            <span className="font-black text-slate-800 uppercase tracking-tighter">iPhone Rehberi</span>
          </div>
          <button onClick={() => setView('user')} className="text-slate-600 font-bold hover:text-blue-600 transition flex items-center gap-2"><ArrowRight className="rotate-180" size={18}/> Geri Dön</button>
        </nav>
        
        <div className="container mx-auto p-6 max-w-4xl py-12 space-y-16">
          <div className="text-center space-y-4">
            <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">İzmir Teknik Servis Blogu</span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900">iPhone Bakım & Onarım Rehberi</h1>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">İzmir'de iPhone ekran değişimi, batarya sağlığı ve teknik sorunlar hakkında bilmeniz gereken her şey.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <article className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition group cursor-pointer">
              <div className="bg-orange-50 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-500 mb-6 group-hover:scale-110 transition"><Battery size={24} /></div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition">iPhone Batarya Sağlığı Neden Düşer?</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                iPhone pilleri, kimyasal yaşlanmaya bağlı olarak zamanla kapasite kaybeder. Özellikle İzmir gibi sıcak iklimlerde ve kalitesiz şarj aleti kullanımında pil sağlığı hızla %80 altına düşebilir.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> <span>%80 altı sağlıkta değişim şarttır.</span></li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> <span>Yan sanayi şarj aletlerinden kaçının.</span></li>
                <li className="flex items-start gap-2 text-sm text-slate-700"><CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0"/> <span>Gece boyu şarjda bırakmak ısıyı artırır.</span></li>
              </ul>
              <button onClick={() => {setView('user'); setTimeout(() => document.getElementById('appointment').scrollIntoView(), 100);}} className="text-blue-600 font-bold text-sm uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition">Batarya Değişimi Randevusu Al <ArrowRight size={16}/></button>
            </article>

            <article className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition group cursor-pointer">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition"><Smartphone size={24} /></div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition">Ekran Değişimi: Cam mı Panel mi?</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                Ekranınız kırıldığında görüntü geliyorsa ve dokunmatik çalışıyorsa sadece ön cam değişimi yeterli olabilir. Ancak görüntüde mürekkep dağılması veya çizgiler varsa komple panel değişimi gerekir.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">İzmir iPhone Kapında Farkı</p>
                <p className="text-slate-800 text-sm font-medium">Buca, Bornova ve Karşıyaka'daki mobil ekiplerimiz, ekran değişimini adresinizde 30 dakikada gerçekleştirir ve True Tone özelliğini aktarır.</p>
              </div>
              <button onClick={() => {setView('user'); setTimeout(() => document.getElementById('appointment').scrollIntoView(), 100);}} className="text-blue-600 font-bold text-sm uppercase tracking-wide flex items-center gap-1 hover:gap-2 transition">Ekran Tamiri Fiyatı Al <ArrowRight size={16}/></button>
            </article>

            <article className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition group cursor-pointer">
              <div className="bg-red-50 w-12 h-12 rounded-2xl flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition"><AlertTriangle size={24} /></div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition">Face ID Neden Çalışmaz?</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                Sıvı teması veya darbe sonrası Face ID bozulabilir. Özellikle ahize kısmından giren su, Face ID sensörlerini oksitler. Bu durumda uzman teknisyen müdahalesi gerekir.
              </p>
              <p className="text-sm text-slate-500">Servisimizde Face ID onarımı için özel ekipmanlar kullanılmakta olup, başarı oranımız %90 üzerindedir.</p>
            </article>

            <article className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition group cursor-pointer">
              <div className="bg-cyan-50 w-12 h-12 rounded-2xl flex items-center justify-center text-cyan-500 mb-6 group-hover:scale-110 transition"><Droplets size={24} /></div>
              <h2 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition">Sıvı Teması Sonrası Ne Yapmalı?</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                Cihazınız suya düştüyse <b>asla şarja takmayın</b> ve pirince koymak yerine hemen profesyonel destek alın. Pirinç, içindeki oksitlenmeyi temizleyemez.
              </p>
              <div className="flex gap-2 mt-4">
                 <span className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-xs font-bold">Acil Durum</span>
                 <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold">7/24 WhatsApp</span>
              </div>
            </article>
          </div>

          <div className="bg-slate-900 rounded-[40px] p-8 md:p-12 text-center text-white relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-black">Cihazınızda Sorun mu Var?</h3>
                <p className="text-slate-300 max-w-xl mx-auto">İzmir'in en güvenilir mobil teknik servisi ile tanışın. Adresinizden alıp, garantili onarıp, kapınıza teslim ediyoruz.</p>
                <button onClick={() => {setView('user'); setTimeout(() => document.getElementById('appointment').scrollIntoView(), 100);}} className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-blue-50 transition shadow-xl">Hemen Servis Çağır</button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  // Admin View
  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Smartphone size={20}/></div>
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">YÖNETİCİ PANELİ</span>
          </div>
          <button onClick={() => setView('user')} className="text-red-500 font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm"><LogOut size={18}/> Çıkış</button>
        </nav>
        <div className="container mx-auto p-6 max-w-5xl">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black">Talepler ({requests.length})</h2>
            <button onClick={fetchRequests} className="p-2 bg-blue-600 text-white rounded-xl"><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''}/></button>
          </div>
          <div className="grid gap-4">
            {requests.map((req, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
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
                <div className="bg-slate-900 text-white p-6 rounded-3xl md:w-64 flex flex-col justify-center text-center border border-slate-800">
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[40px] w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-black text-center mb-8 uppercase tracking-widest text-slate-800">GİRİŞ YAP</h2>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input required type="text" placeholder="Kullanıcı" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 font-bold text-slate-900" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
            <input required type="password" placeholder="Şifre" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 font-bold text-slate-900" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 text-white">Panel Girişi</button>
            <button type="button" onClick={() => setView('user')} className="w-full text-slate-400 font-bold text-sm">İptal</button>
          </form>
        </div>
      </div>
    );
  }

  // --- MAIN USER VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Smartphone size={24} /></div>
            <span className="text-xl font-bold tracking-tight text-blue-900 uppercase">iZMiR iPHONE <span className="text-blue-600 font-black text-blue-600">KAPINDA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('home')} className="hover:text-blue-600 transition font-bold text-sm">Ana Sayfa</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition font-bold text-sm">Hizmetler</button>
            <button onClick={() => setView('blog')} className="hover:text-blue-600 transition font-bold text-sm">Rehber</button>
            <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-white font-bold text-sm">Randevu Al</button>
          </div>
          <button className="md:hidden p-2 text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => {document.getElementById('pricing').scrollIntoView(); setIsMenuOpen(false);}} className="text-left font-bold text-slate-700 py-2 border-b">Fiyatlar</button>
            <button onClick={() => {setView('blog'); setIsMenuOpen(false);}} className="text-left font-bold text-slate-700 py-2 border-b">Bakım Rehberi</button>
            <button onClick={() => {document.getElementById('appointment').scrollIntoView(); setIsMenuOpen(false);}} className="bg-blue-600 text-white p-3 rounded-lg text-center font-bold">Randevu Al</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -z-10 rounded-l-[100px] hidden md:block"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">İzmir'in En Hızlı iPhone Teknik Servisi</div>
            <h1 className="text-4xl md:text-7xl font-extrabold text-slate-900 leading-tight tracking-tighter uppercase">İzmir iPhone <br /><span className="text-blue-600">Ekran & Batarya</span> Tamiri</h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">İzmir'in her semtinde kapınızdan alıyor, orijinal kalitede parçalarla onarıp aynı gün adresinize teslim ediyoruz. Üstelik 6 ay parça garantisiyle!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4 text-white">
              <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-white">Hemen Randevu Oluştur <ArrowRight className="w-5 h-5" /></button>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-xl flex items-center justify-center gap-2 text-white"><MessageCircle className="w-5 h-5" /> WhatsApp Destek</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
             {/* Lottie Animation Integration */}
             <div className="relative z-10 animate-float bg-white p-4 rounded-[40px] shadow-2xl border-4 border-white overflow-hidden max-w-sm">
                <lottie-player src="https://assets10.lottiefiles.com/packages/lf20_96onscat.json" background="transparent" speed="1" style={{width: '300px', height: '300px'}} loop autoplay></lottie-player>
                <div className="absolute bottom-4 left-4 right-4 bg-blue-600/90 backdrop-blur p-4 rounded-3xl text-white text-center">
                   <p className="text-xs font-bold uppercase tracking-widest">Kurye Yolda</p>
                   <p className="text-lg font-black tracking-tighter">İzmir'in Tüm Semtlerine</p>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full blur-[120px] opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-widest text-slate-900 leading-tight">İzmir Yerinde iPhone Servisi</h2>
          <div className="grid md:grid-cols-3 gap-8 text-slate-900">
             <div className="p-8 rounded-3xl bg-white border border-slate-100 transition hover:shadow-lg hover:-translate-y-2 duration-300">
               <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600"><Smartphone size={32} /></div>
               <h3 className="font-black text-xl mb-3 uppercase tracking-tighter">Ekran Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">İzmir genelinde iPhone kırık ekran değişimi. True Tone aktarımı ve sıvı koruma bandı yenileme dahil garantili montaj.</p>
             </div>
             <div className="p-8 rounded-3xl bg-white border border-slate-100 transition hover:shadow-lg hover:-translate-y-2 duration-300">
               <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600"><Battery size={32} /></div>
               <h3 className="font-black text-xl mb-3 uppercase tracking-tighter">Batarya Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">iPhone pil sağlığı %100 yapıyoruz. Karşıyaka ve Bornova'da yerinde batarya tamiri hizmeti.</p>
             </div>
             <div className="p-8 rounded-3xl bg-white border border-slate-100 transition hover:shadow-lg hover:-translate-y-2 duration-300">
               <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm text-blue-600"><ShieldCheck size={32} /></div>
               <h3 className="font-black text-xl mb-3 uppercase tracking-tighter">Garantili Cam Onarımı</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Lazer teknolojisi ile kasa değişmeden kusursuz, garantili iPhone arka cam tamiri.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2 space-y-6">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">İzmir'in Tamamındayız</h2>
                    <p className="text-slate-400 text-lg">Kurye ekiplerimiz Karşıyaka'dan Buca'ya, Bornova'dan Güzelbahçe'ye kadar her noktaya 30 dakikada ulaşıyor.</p>
                    <div className="grid grid-cols-2 gap-4">
                        {['Buca', 'Bornova', 'Karşıyaka', 'Alsancak', 'Balçova', 'Gaziemir'].map(city => (
                            <div key={city} className="flex items-center gap-2 text-blue-400 font-bold">
                                <CheckCircle2 size={16} /> <span>{city}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="bg-blue-600/10 p-8 rounded-full border border-blue-500/20">
                         <Map className="w-48 h-48 text-blue-500 opacity-80" />
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[150px] opacity-20"></div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center text-slate-900">
          <div className="bg-white p-8 rounded-[50px] border border-slate-100 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-left">
              <h2 className="text-3xl font-black tracking-tighter uppercase">Fiyat Hesapla</h2>
              <p className="text-slate-500 text-sm font-medium">Modelinizi seçin, İzmir iPhone ekran ve batarya değişim fiyatlarını anında görün.</p>
              <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold shadow-sm outline-none text-slate-700" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Model Seçiniz...</option>
                {Object.keys(prices).map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex gap-2">
                {['Ekran Değişimi', 'Batarya Değişimi'].map(t => (
                  <button key={t} onClick={() => setSelectedService(t)} className={`flex-1 p-4 rounded-2xl font-black text-xs transition ${selectedService === t ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={100} /></div>
               <p className="text-blue-200 text-xs font-bold uppercase mb-2">Net Ücret (Kurye Dahil)</p>
               <div className="text-5xl font-black tracking-tighter uppercase">{currentPrice ? `${currentPrice.toLocaleString('tr-TR')} ₺` : '---'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl md:text-4xl font-black text-center mb-16 uppercase tracking-tighter text-slate-900">İzmir iPhone Sahipleri Ne Diyor?</h2>
           <div className="grid md:grid-cols-3 gap-8">
              {[
                  { name: "Selin Y.", text: "Buca'daki evime 20 dakikada geldiler, ekranım değişti. İnanılmaz hızlı.", stars: 5 },
                  { name: "Murat K.", text: "Karşıyaka'da iş yerime gelip batarya değiştirdiler. Tertemiz işçilik.", stars: 5 },
                  { name: "Deniz A.", text: "Vercel üzerinden başvurdum, kurye kapımdaydı. Güven veriyorlar.", stars: 5 }
              ].map((t, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                      <div className="flex gap-1 text-orange-400">
                          {[...Array(t.stars)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                      </div>
                      <p className="text-slate-600 font-medium italic">"{t.text}"</p>
                      <p className="font-black text-blue-600 text-sm uppercase">{t.name}</p>
                  </div>
              ))}
           </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl text-slate-900">
            <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-blue-50">
                {formStep === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6 text-slate-900">
                        <h2 className="text-3xl font-black text-center mb-8 uppercase text-slate-900 tracking-tighter">Hemen Başvur</h2>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-slate-900">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                                <input required type="text" placeholder="Örn: Ahmet Yılmaz" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold text-slate-900" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                                <input required type="tel" placeholder="05XX XXX XX XX" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold text-slate-900" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>

                        {/* Booking Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İstediğiniz Tarih</label>
                                <input required type="date" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold text-slate-900" value={formData.bookingDate} onChange={(e) => setFormData({...formData, bookingDate: e.target.value})} />
                            </div>
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İstediğiniz Saat</label>
                                <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold text-slate-900" value={formData.bookingTime} onChange={(e) => setFormData({...formData, bookingTime: e.target.value})}>
                                    <option>Sabah (09:00 - 12:00)</option>
                                    <option>Öğleden Sonra (12:00 - 18:00)</option>
                                    <option>Akşam (18:00 - 21:00)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1 text-slate-900">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">İzmir Bölge / İlçe</label>
                            <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold text-slate-900" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
                                {['Buca', 'Bornova', 'Karşıyaka', 'Konak', 'Balçova', 'Gaziemir', 'Bayraklı', 'Çiğli', 'Mavişehir', 'Diğer'].map(area => <option key={area} value={area}>{area}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1 text-slate-900">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam Adres</label>
                            <textarea required placeholder="Cihazın teslim alınacağı tam adresiniz..." className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none h-24 shadow-inner font-bold text-slate-900" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-[32px] space-y-4 border border-blue-100">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest text-center mb-2">Seçili Onarım Detayları</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cihaz Modeli</label>
                                <div className="relative">
                                  <select required className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-sm font-bold appearance-none text-sm text-slate-900" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                      <option value="">Seçiniz...</option>
                                      {Object.keys(prices).map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1 text-slate-900">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hizmet Türü</label>
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
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter text-slate-900">Başvurunuz Alındı!</h3>
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
      <footer className="bg-slate-950 text-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4">
            <p className="font-black text-xl mb-4 uppercase tracking-tighter">İzmir iPhone Kapında Servisi</p>
            <p className="text-slate-500 text-xs mb-8 max-w-sm mx-auto font-medium leading-relaxed">Buca, Bornova, Karşıyaka ve İzmir'in tüm bölgelerinde kapıda iPhone ekran değişimi, batarya tamiri ve teknik servis desteği.</p>
            <div className="flex justify-center gap-6 mb-12">
               <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} aria-label="Bizi Arayın" className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition text-white"><Phone size={24} /></a>
               <a href={`https://wa.me/${whatsappNumber}`} aria-label="WhatsApp Hattı" className="bg-white/5 p-4 rounded-2xl hover:bg-green-600 transition text-white"><MessageCircle size={24} /></a>
            </div>
            <p className="text-[10px] text-slate-800 font-black uppercase mb-12 tracking-[6px]">İLETİŞİM HATTI: {phoneNumber}</p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
               <button onClick={() => setView('user')} className="hover:text-white">Ana Sayfa</button>
               <button onClick={() => setView('blog')} className="hover:text-white">Bakım Rehberi</button>
               <button onClick={() => setView('login')} className="hover:text-white">Yönetici Girişi</button>
            </div>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white text-white"><Phone size={24} /></a>
          <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white text-white"><MessageCircle size={24} /></a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default App;
