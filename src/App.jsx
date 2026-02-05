import React, { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Clock, ShieldCheck, Battery, Smartphone, 
  CheckCircle2, ArrowRight, MessageCircle, Menu, X, Instagram, 
  ChevronDown, Loader2, Lock, LogOut, Trash2, Calendar, Table
} from 'lucide-react';

// --- AYAR: Buraya Google Apps Script'ten aldığınız URL'yi yapıştırın ---
// Not: URL boş olsa bile site hata vermez, sadece Excel kaydı yapmaz, WhatsApp çalışmaya devam eder.
const SHEET_URL = "https://script.google.com/macros/s/AKfycbzBMzJs8jaw-RagfPABfNNGF230b7BeU1xUKcV9CV1UwuJKGtkAw6ySmnkIQ0F7V-dh/exec"; 

const App = () => {
  const [view, setView] = useState('user'); // 'user', 'login', 'admin'
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  // Admin Bilgileri
  const ADMIN_USERNAME = 'lapella';
  const ADMIN_PASSWORD = 'Mami@@@2812';
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });

  // Form Verileri State'i
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: 'Buca',
    address: ''
  });

  // Telefon Numarası Ayarları - Sabitlendi: 0532 427 28 12
  const phoneNumber = "0532 427 28 12";
  const whatsappNumber = "905324272812";

  // Tam Fiyat Listesi (iPhone X - 16 Pro Max)
  const prices = {
    "iPhone X": { screen: 2850, battery: 1350 },
    "iPhone XR": { screen: 2650, battery: 1350 },
    "iPhone XS": { screen: 2950, battery: 1400 },
    "iPhone XS Max": { screen: 3450, battery: 1450 },
    "iPhone 11": { screen: 3100, battery: 1550 },
    "iPhone 11 Pro": { screen: 3850, battery: 1650 },
    "iPhone 11 Pro Max": { screen: 4250, battery: 1750 },
    "iPhone 12 mini": { screen: 4450, battery: 1850 },
    "iPhone 12": { screen: 4950, battery: 1950 },
    "iPhone 12 Pro": { screen: 5450, battery: 1950 },
    "iPhone 12 Pro Max": { screen: 6250, battery: 2100 },
    "iPhone 13 mini": { screen: 5850, battery: 2250 },
    "iPhone 13": { screen: 6450, battery: 2250 },
    "iPhone 13 Pro": { screen: 8750, battery: 2450 },
    "iPhone 13 Pro Max": { screen: 9850, battery: 2650 },
    "iPhone 14": { screen: 7850, battery: 2650 },
    "iPhone 14 Plus": { screen: 8950, battery: 2850 },
    "iPhone 14 Pro": { screen: 11250, battery: 3100 },
    "iPhone 14 Pro Max": { screen: 12450, battery: 3350 },
    "iPhone 15": { screen: 10500, battery: 3250 },
    "iPhone 15 Plus": { screen: 11850, battery: 3450 },
    "iPhone 15 Pro": { screen: 14250, battery: 3650 },
    "iPhone 15 Pro Max": { screen: 15950, battery: 3850 },
    "iPhone 16": { screen: 12500, battery: 3550 },
    "iPhone 16 Plus": { screen: 13850, battery: 3750 },
    "iPhone 16 Pro": { screen: 16500, battery: 3950 },
    "iPhone 16 Pro Max": { screen: 18500, battery: 4250 },
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Admin modundaysa Excel'den verileri çek
  useEffect(() => {
    if (view === 'admin' && SHEET_URL) {
      fetch(SHEET_URL)
        .then(res => res.json())
        .then(data => setRequests(data.reverse()))
        .catch(err => console.log("Excel bağlantısı kurulmadı."));
    }
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

  // Form Gönderimi (WhatsApp + Excel Kaydı)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      name: formData.name,
      phone: formData.phone,
      area: formData.area,
      address: formData.address,
      model: selectedModel || "Belirtilmedi",
      service: selectedService || "Belirtilmedi",
      price: currentPrice ? currentPrice.toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz"
    };

    // WhatsApp Mesajı
    const message = `🛠️ *YENİ SERVİS TALEBİ* 🛠️\n\n👤 *Müşteri:* ${payload.name}\n📞 *Telefon:* ${payload.phone}\n📍 *Bölge:* ${payload.area}\n🏠 *Adres:* ${payload.address}\n\n📱 *Cihaz:* ${payload.model}\n🔧 *İşlem:* ${payload.service}\n💰 *Fiyat:* ${payload.price}`;

    try {
      // 1. Google Excel'e Kaydet (SHEET_URL varsa)
      if (SHEET_URL) {
        await fetch(SHEET_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      // 2. WhatsApp'a Yönlendir
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      setFormStep(2);
    } catch (err) {
      console.error(err);
      window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminCreds.username === ADMIN_USERNAME && adminCreds.password === ADMIN_PASSWORD) {
      setView('admin');
    } else {
      alert("Hatalı kullanıcı adı veya şifre!");
    }
  };

  // --- RENDER MODLARI ---

  if (view === 'login') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-[40px] w-full max-w-md shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Lock className="text-blue-600"/></div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Yönetici Girişi</h2>
          </div>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input required type="text" placeholder="Kullanıcı Adı" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={adminCreds.username} onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} />
            <input required type="password" placeholder="Şifre" className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" value={adminCreds.password} onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} />
            <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">Giriş Yap</button>
            <button type="button" onClick={() => setView('user')} className="w-full text-slate-400 font-bold text-sm">Geri Dön</button>
          </form>
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white"><Smartphone size={20}/></div>
            <span className="font-black text-slate-800 uppercase tracking-tighter tracking-widest">YÖNETİCİ <span className="text-blue-600">PANELİ</span></span>
          </div>
          <button onClick={() => setView('user')} className="text-red-500 font-bold flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-xl transition"><LogOut size={18}/> Çıkış</button>
        </nav>
        <div className="container mx-auto p-6">
          <h2 className="text-3xl font-black mb-8 text-slate-900">Müşteri Talepleri ({requests.length})</h2>
          {!SHEET_URL && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl mb-6 text-sm">
              ⚠️ Not: <b>SHEET_URL</b> tanımlanmadığı için veriler Excel'den çekilemiyor. Excel entegrasyonu için rehberi takip edin.
            </div>
          )}
          <div className="grid gap-4">
            {requests.map((req, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">YENİ</span>
                    <span className="text-slate-400 text-xs">{req.date ? new Date(req.date).toLocaleString('tr-TR') : 'Bugün'}</span>
                  </div>
                  <h4 className="font-black text-xl">{req.name}</h4>
                  <p className="text-blue-600 font-bold flex items-center gap-2 underline"><Phone size={14}/> {req.phone}</p>
                  <p className="text-slate-500 text-sm font-medium"><MapPin size={14} className="inline mr-1"/> {req.area} - {req.address}</p>
                </div>
                <div className="bg-slate-900 text-white p-6 rounded-3xl md:w-64 flex flex-col justify-center">
                  <p className="text-[10px] text-blue-400 font-bold uppercase mb-1">{req.model}</p>
                  <p className="text-sm font-medium">{req.service}</p>
                  <p className="font-black mt-2 text-2xl">{req.price}</p>
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-slate-400 text-center py-20 font-medium italic">Kayıtlı veri bulunamadı.</p>}
          </div>
        </div>
      </div>
    );
  }

  // --- ANA KULLANICI ARAYÜZÜ ---

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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
            <button 
              onClick={() => scrollToSection('appointment')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Randevu Al
            </button>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t absolute w-full p-4 flex flex-col gap-4 shadow-xl">
            <button onClick={() => scrollToSection('services')} className="text-left py-2 border-b">Hizmetler</button>
            <button onClick={() => scrollToSection('pricing')} className="text-left py-2 border-b">Fiyatlar</button>
            <button onClick={() => scrollToSection('appointment')} className="bg-blue-600 text-white p-3 rounded-lg text-center font-bold">Randevu Al</button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50 -z-10 rounded-l-[100px] hidden md:block"></div>
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6 text-center md:text-left">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
              İzmir'in Tamamına VIP Mobil Hizmet
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tighter">
              iPhone'unuz Bozuldu mu? <br />
              <span className="text-blue-600">Biz Gelip Alalım.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0 font-medium">
              Servis servis gezmenize gerek yok. Kapınızdan alıyoruz, onarıyoruz ve aynı gün teslim ediyoruz. Üstelik parça garantisiyle!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <button 
                onClick={() => scrollToSection('appointment')}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                Hemen Randevu Oluştur <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href={`https://wa.me/${whatsappNumber}`} 
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-xl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp Destek
              </a>
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
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-500 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Kurye Yolda</span>
                      <span className="font-bold">14:20 Varış</span>
                  </div>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-16 uppercase tracking-tight tracking-widest">Hizmetlerimiz</h2>
          <div className="grid md:grid-cols-3 gap-8">
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><Smartphone /></div>
               <h3 className="font-black text-xl mb-2">Ekran Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium">30 dakikada montaj, True Tone aktarımı ve sıvı koruma bandı.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><Battery /></div>
               <h3 className="font-black text-xl mb-2">Batarya Değişimi</h3>
               <p className="text-slate-500 text-sm font-medium">%100 pil sağlığı, garantili montaj ve yüksek kapasite.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-lg">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600"><ShieldCheck /></div>
               <h3 className="font-black text-xl mb-2">Kasa & Arka Cam</h3>
               <p className="text-slate-500 text-sm font-medium">Lazer teknolojisi ile kasa değişmeden kusursuz cam onarımı.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <div className="md:w-1/2 p-10 bg-blue-600 text-white flex flex-col justify-center">
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Fiyat Hesapla</h3>
              <p className="opacity-90 font-medium">Model ve işlemi seçin, anında kurye dahil tutarı görün.</p>
            </div>
            <div className="md:w-1/2 p-10 space-y-6">
              <select className="w-full p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">Model Seçiniz...</option>
                {Object.keys(prices).map(model => <option key={model} value={model}>{model}</option>)}
              </select>
              <div className="flex gap-2">
                {['Ekran Değişimi', 'Batarya Değişimi'].map(type => (
                  <button key={type} onClick={() => setSelectedService(type)} className={`flex-1 p-4 rounded-2xl border-2 transition font-black text-xs ${selectedService === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 bg-slate-50'}`}>
                    {type}
                  </button>
                ))}
              </div>
              {currentPrice && (
                <div className="p-6 bg-slate-900 rounded-3xl text-center shadow-lg animate-in fade-in zoom-in">
                  <span className="text-4xl font-black text-white">{currentPrice.toLocaleString('tr-TR')} ₺</span>
                  <p className="text-blue-400 text-[10px] font-bold uppercase mt-2">KDV VE İŞÇİLİK DAHİL</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-blue-50">
                {formStep === 1 ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h2 className="text-3xl font-black text-center mb-8 uppercase text-slate-900 tracking-tighter">Hemen Başvur</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input required type="text" placeholder="Adınız Soyadınız" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            <input required type="tel" placeholder="05XX XXX XX XX" className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <select className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none shadow-inner font-bold" value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}>
                            {['Buca', 'Bornova', 'Karşıyaka', 'Konak', 'Balçova', 'Gaziemir', 'Bayraklı', 'Çiğli', 'Mavişehir', 'Diğer'].map(area => <option key={area}>{area}</option>)}
                        </select>
                        <textarea required placeholder="Cihazın teslim alınacağı tam adresiniz..." className="w-full p-5 bg-slate-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 border-none h-24 shadow-inner font-bold" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                        
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

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-20 pb-10 text-center">
        <div className="container mx-auto px-4">
            <p className="font-black text-xl mb-2 uppercase tracking-tighter">İzmir iPhone Kapında</p>
            <p className="text-slate-500 text-sm mb-10 font-medium">Adresinize gelip aynı gün profesyonel onarım yapıyoruz.</p>
            <div className="flex justify-center gap-6 mb-12">
               <a href={`tel:${whatsappNumber}`} className="bg-white/5 p-4 rounded-2xl hover:bg-blue-600 transition"><Phone size={24} /></a>
               <a href={`https://wa.me/${whatsappNumber}`} className="bg-white/5 p-4 rounded-2xl hover:bg-green-600 transition"><MessageCircle size={24} /></a>
            </div>
            <p className="text-[10px] text-slate-800 font-black uppercase mb-12 tracking-[6px]">İLETİŞİM: {phoneNumber}</p>
            <button onClick={() => setView('login')} className="text-[10px] text-slate-900 hover:text-blue-500 transition uppercase tracking-[3px] font-bold">Yönetici Girişi</button>
        </div>
      </footer>

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${whatsappNumber}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white"><Phone size={24} /></a>
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
