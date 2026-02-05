import React, { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Clock, ShieldCheck, Battery, Smartphone, 
  CheckCircle2, ArrowRight, MessageCircle, Menu, X, Instagram, 
  ChevronDown, Loader2, Lock, LogOut, Trash2, Calendar, Table, RefreshCw, AlertCircle, Wrench, CreditCard
} from 'lucide-react';

// --- AYAR: Google Apps Script URL'niz ---
const SHEET_URL = "https://script.google.com/macros/s/AKfycbztX6gRkelRy6MrZ29J_LnM1re01jR1hYMF3sqPM65MBrrG6mR5O3PSnjm2fmU6q5s7/exec"; 

const App = () => {
  const [view, setView] = useState('user'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  /**
   * GÜVENLİK GÜNCELLEMESİ: 
   * Ortam değişkenlerine erişim yöntemi, uyumluluk için güvenli hale getirildi.
   */
  const getEnv = (key, fallback) => {
    try {
      // @ts-ignore
      return import.meta.env[key] || fallback;
    } catch (e) {
      return fallback;
    }
  };

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USER;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASS;

  
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: 'Buca',
    address: ''
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
    setError(null);
    try {
      const response = await fetch(SHEET_URL);
      if (!response.ok) throw new Error("Excel bağlantı hatası");
      const data = await response.json();
      if (Array.isArray(data)) {
        setRequests(data.reverse());
      }
    } catch (err) {
      console.error("Fetch Hatası:", err);
      setError("Veriler yüklenemedi. Lütfen interneti kontrol edin.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'admin') fetchRequests();
  }, [view]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const currentPrice = selectedModel && selectedService && prices[selectedModel] 
    ? (selectedService === 'Ekran Değişimi' ? prices[selectedModel].screen : prices[selectedModel].battery)
    : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedModel || !selectedService) {
      alert("Lütfen Model ve İşlem seçiniz.");
      return;
    }
    setIsLoading(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      area: formData.area,
      address: formData.address,
      model: selectedModel,
      service: selectedService,
      price: currentPrice ? currentPrice.toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz"
    };

    const message = `🛠️ *YENİ SERVİS TALEBİ* 🛠️\n\n👤 *Müşteri:* ${payload.name}\n📞 *Tel:* ${payload.phone}\n📍 *Bölge:* ${payload.area}\n🏠 *Adres:* ${payload.address}\n\n📱 *Cihaz:* ${payload.model}\n🔧 *İşlem:* ${payload.service}\n💰 *Fiyat:* ${payload.price}`;

    try {
      if (SHEET_URL) {
        fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(e => console.warn("Sessiz gönderim:", e));
      }
      
      setTimeout(() => {
        window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
        setFormStep(2);
        setIsLoading(false);
      }, 500);

    } catch (err) {
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setFormStep(2);
      setIsLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCreds.username === ADMIN_USERNAME && adminCreds.password === ADMIN_PASSWORD) {
      setView('admin');
    } else {
      alert("Giriş bilgileri yanlış!");
    }
  };

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-[40px] w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="text-blue-600"/></div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-slate-800">Yönetici Girişi</h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input required type="text" placeholder="Kullanıcı" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 font-bold" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
            <input required type="password" placeholder="Şifre" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border border-slate-200 font-bold" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Giriş Yap</button>
            <button type="button" onClick={() => setView('user')} className="w-full text-slate-400 font-bold text-sm">Geri Dön</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Smartphone size={20}/></div>
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">YÖNETİCİ PANELİ</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchRequests} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"><RefreshCw size={20} className={isLoading ? 'animate-spin' : ''}/></button>
            <button onClick={() => setView('user')} className="text-red-500 font-bold flex items-center gap-2 px-4 py-2 rounded-xl transition text-sm"><LogOut size={18}/> Çıkış</button>
          </div>
        </nav>
        <div className="container mx-auto p-6 max-w-5xl">
          <h2 className="text-3xl font-black mb-8 tracking-tighter">Müşteri Talepleri ({requests.length})</h2>
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-2xl mb-6 font-bold text-sm text-center">{error}</div>}
          <div className="grid gap-4">
            {requests.map((req, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">YENİ</span>
                    <span className="text-slate-400 text-xs font-bold">{req.date ? new Date(req.date).toLocaleString('tr-TR') : 'Bugün'}</span>
                  </div>
                  <h4 className="font-black text-xl text-slate-900">{req.name}</h4>
                  <p className="text-blue-600 font-bold flex items-center gap-2 underline underline-offset-4"><Phone size={14}/> {req.phone}</p>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{req.area} - {req.address}</p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-3xl md:w-64 flex flex-col justify-center text-center border border-slate-800">
                  <p className="text-[10px] text-blue-400 font-bold uppercase mb-1 tracking-widest">{req.model}</p>
                  <p className="text-sm font-medium">{req.service}</p>
                  <p className="font-black mt-2 text-2xl text-white tracking-tighter">{req.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100">
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900 uppercase">iZMiR iPHONE <span className="text-blue-600 font-black">KAPINDA</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition font-bold">Hizmetler</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition font-bold">Fiyatlar</button>
            <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200">Randevu Al</button>
          </div>
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X /> : <Menu />}</button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => {document.getElementById('pricing').scrollIntoView(); setIsMenuOpen(false);}} className="text-left font-bold text-slate-700">Fiyatlar</button>
            <button onClick={() => {document.getElementById('appointment').scrollIntoView(); setIsMenuOpen(false);}} className="bg-blue-600 text-white p-3 rounded-lg text-center font-bold">Randevu Al</button>
          </div>
        )}
      </nav>

      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -z-10 rounded-l-[100px] hidden md:block"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">İzmir'in Tamamına VIP Mobil Hizmet</div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tighter">iPhone'unuz Bozuldu mu? <br /><span className="text-blue-600">Biz Gelip Alalım.</span></h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">Servis servis gezmenize gerek yok. Kapınızdan alıyoruz, onarıyoruz ve aynı gün teslim ediyoruz. Üstelik parça garantisiyle!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2">Hemen Randevu Oluştur <ArrowRight className="w-5 h-5" /></button>
              <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-xl flex items-center justify-center gap-2"><MessageCircle className="w-5 h-5" /> WhatsApp Destek</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
             <div className="relative z-10 animate-float bg-white p-6 rounded-3xl shadow-2xl max-w-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Smartphone size={32} /></div>
                  <div className="text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase">Teknik Durum</span>
                      <p className="text-orange-500 font-bold">Onarım Bekliyor</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-blue-500 animate-pulse"></div></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Kurye Yolda</span><span className="font-bold">14:20 Varış</span></div>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-widest text-slate-900">Hizmetlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><Smartphone /></div>
               <h3 className="font-black text-xl mb-2 text-slate-900 uppercase tracking-tighter">Ekran Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">30 dakikada montaj, True Tone aktarımı ve sıvı koruma bandı ile profesyonel çözüm.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><Battery /></div>
               <h3 className="font-black text-xl mb-2 text-slate-900 uppercase tracking-tighter">Batarya Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">%100 pil sağlığı, garantili montaj ve yüksek kapasiteli yeni nesil piller.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><ShieldCheck /></div>
               <h3 className="font-black text-xl mb-2 text-slate-900 uppercase tracking-tighter">Kasa & Arka Cam</h3>
               <p className="text-slate-500 text-sm font-medium leading-relaxed">Lazer teknolojisi ile kasa değişmeden kusursuz cam onarımı.</p>
             </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="bg-white p-8 rounded-[50px] border border-slate-100 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-left">
              <h3 className="text-3xl font-black tracking-tighter uppercase">Fiyat Hesapla</h3>
              <select className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold shadow-sm outline-none" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Model Seçiniz...</option>
                {Object.keys(prices).map(m => <option key={m}>{m}</option>)}
              </select>
              <div className="flex gap-2">
                {['Ekran Değişimi', 'Batarya Değişimi'].map(t => (
                  <button key={t} onClick={() => setSelectedService(t)} className={`flex-1 p-4 rounded-2xl font-black text-xs transition ${selectedService === t ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="bg-blue-600 rounded-[40px] p-10 text-white shadow-xl">
               <p className="text-blue-200 text-xs font-bold uppercase mb-2">Net Ücret (Kurye Dahil)</p>
               <div className="text-5xl font-black tracking-tighter">{currentPrice ? `${currentPrice.toLocaleString('tr-TR')} ₺` : '---'}</div>
            </div>
          </div>
        </div>
      </section>

      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-blue-50">
                {formStep === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-3xl font-black text-center mb-8 uppercase text-slate-900 tracking-tighter">Hemen Başvur</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                                <input required type="text" placeholder="Örn: Ahmet Yılmaz" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Telefon</label>
                                <input required type="tel" placeholder="05XX XXX XX XX" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bölge</label>
                            <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
                                {['Buca', 'Bornova', 'Karşıyaka', 'Konak', 'Balçova', 'Gaziemir', 'Bayraklı', 'Çiğli', 'Mavişehir', 'Diğer'].map(area => <option key={area} value={area}>{area}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tam Adres</label>
                            <textarea required placeholder="Cihazın teslim alınacağı tam adresiniz..." className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none h-24 shadow-inner font-bold" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                        </div>

                        <div className="bg-blue-50/50 p-6 rounded-[32px] space-y-4 border border-blue-100">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest text-center mb-2">Onarım Bilgileri</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cihaz Modeli</label>
                                <div className="relative">
                                  <select required className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-sm font-bold appearance-none" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                                      <option value="">Seçiniz...</option>
                                      {Object.keys(prices).map(m => <option key={m} value={m}>{m}</option>)}
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hizmet Türü</label>
                                <div className="relative">
                                  <select required className="w-full p-4 bg-white rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-sm font-bold appearance-none" value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
                                      <option value="">Seçiniz...</option>
                                      <option value="Ekran Değişimi">Ekran Değişimi</option>
                                      <option value="Batarya Değişimi">Batarya Değişimi</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-blue-50">
                            <div className="flex items-center gap-2 text-slate-500"><CreditCard size={18} className="text-blue-600"/><span className="text-sm font-bold">Tahmini Ücret</span></div>
                            <div className="text-xl font-black text-blue-600 tracking-tighter">{currentPrice ? `${currentPrice.toLocaleString('tr-TR')} ₺` : '---'}</div>
                          </div>
                        </div>
                        
                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-200">
                          {isLoading ? <Loader2 className="animate-spin" /> : "Talebi WhatsApp'tan Gönder"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-10 animate-in zoom-in">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={40} /></div>
                        <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Mesajınız Hazır!</h3>
                        <p className="text-slate-500 mb-8 font-medium">Lütfen açılan WhatsApp ekranında mesajı gönderin. Teknik ekibimiz <b className="text-blue-600">{phoneNumber}</b> üzerinden sizi arayacaktır.</p>
                        <button onClick={() => setFormStep(1)} className="text-blue-600 font-bold hover:underline">Yeni Bir Talep Gönder</button>
                    </div>
                )}
            </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4">
            <p className="font-black text-xl mb-4 uppercase tracking-tighter">İzmir iPhone Kapında</p>
            <div className="flex justify-center gap-6 mb-12">
               <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition"><Phone size={24} /></a>
               <a href={`https://wa.me/${whatsappNumber}`} className="bg-white/5 p-4 rounded-2xl hover:bg-green-600 transition"><MessageCircle size={24} /></a>
            </div>
            <p className="text-[10px] text-slate-800 font-black uppercase mb-12 tracking-[6px]">İLETİŞİM: {phoneNumber}</p>
            <button onClick={() => setView('login')} className="text-[10px] text-slate-900 hover:text-blue-500 transition uppercase tracking-[3px] font-bold outline-none opacity-50 hover:opacity-100">Yönetici Girişi</button>
        </div>
      </footer>

      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${phoneNumber.replace(/\s/g, '')}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white"><Phone size={24} /></a>
          <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white"><MessageCircle size={24} /></a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default App;
