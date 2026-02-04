import React, { useState, useEffect } from 'react';
import { 
  Phone, MapPin, Clock, ShieldCheck, Battery, Smartphone, 
  CheckCircle2, ArrowRight, MessageCircle, Menu, X, Instagram, ChevronDown, Loader2
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Verileri State'i
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    area: 'Buca',
    address: ''
  });

  // Telefon Numarası Ayarları - Yeni Numara: 0532 427 28 12
  const phoneNumber = "0532 427 28 12";
  const whatsappNumber = "905324272812";

  // Fiyat Listesi
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

  // WhatsApp'a Yönlendirme Fonksiyonu
  const handleSendWhatsApp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mesaj içeriğini oluşturma
    const message = `🛠️ *YENİ SERVİS TALEBİ* 🛠️\n\n` +
      `👤 *Müşteri:* ${formData.name}\n` +
      `📞 *Telefon:* ${formData.phone}\n` +
      `📍 *Bölge:* ${formData.area}\n` +
      `🏠 *Adres:* ${formData.address}\n\n` +
      `📱 *Cihaz:* ${selectedModel || "Belirtilmedi"}\n` +
      `🔧 *İşlem:* ${selectedService || "Belirtilmedi"}\n` +
      `💰 *Fiyat:* ${currentPrice ? currentPrice.toLocaleString('tr-TR') + ' ₺' : "Fiyat Sorunuz"}\n\n` +
      `_Bu mesaj web sitesi üzerinden gönderilmiştir._`;

    // WhatsApp URL'ini oluşturma (Mesajı encode ederek)
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    // Kısa bir bekleme efekti (UX için)
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      setIsLoading(false);
      setFormStep(2); // Başarı ekranına geç
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Smartphone size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900 uppercase">iZMiR iPHONE <span className="text-blue-600 font-black">KAPINDA</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition">Hizmetler</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition">Fiyatlar</button>
            <button 
              onClick={() => scrollToSection('appointment')}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition shadow-lg"
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
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              iPhone'unuz Bozuldu mu? <br />
              <span className="text-blue-600">Biz Gelip Alalım.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
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
                  <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">
                      <Smartphone size={32} />
                  </div>
                  <div className="text-right">
                      <span className="text-xs text-slate-400 font-bold uppercase">Teknik Durum</span>
                      <p className="text-orange-500 font-bold">Onarım Bekliyor</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-500"></div>
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
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">Hizmetlerimiz</h2>
            <p className="text-slate-600">Tüm modellerde profesyonel onarım yapıyoruz.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-md">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                  <Smartphone />
               </div>
               <h3 className="font-bold text-xl mb-2">Ekran Değişimi</h3>
               <p className="text-slate-500 text-sm">30 dakikada montaj, True Tone aktarımı.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-md">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                  <Battery />
               </div>
               <h3 className="font-bold text-xl mb-2">Batarya Değişimi</h3>
               <p className="text-slate-500 text-sm">%100 pil sağlığı, garantili montaj.</p>
             </div>
             <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 transition hover:shadow-md">
               <div className="bg-white w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm text-blue-600">
                  <ShieldCheck />
               </div>
               <h3 className="font-bold text-xl mb-2">Kasa & Arka Cam</h3>
               <p className="text-slate-500 text-sm">Lazer teknolojisi ile kusursuz onarım.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <div className="md:w-1/2 p-10 bg-blue-600 text-white flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">Fiyat Hesapla</h3>
              <p className="opacity-90">Model ve işlemi seçin, tutarı görün.</p>
            </div>
            <div className="md:w-1/2 p-10 space-y-6">
              <select 
                className="w-full p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium" 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="">Model Seçiniz...</option>
                {Object.keys(prices).map(model => <option key={model} value={model}>{model}</option>)}
              </select>
              <div className="flex gap-2">
                {['Ekran Değişimi', 'Batarya Değişimi'].map(type => (
                  <button key={type} onClick={() => setSelectedService(type)} className={`flex-1 p-3 rounded-xl border-2 transition ${selectedService === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}>
                    {type}
                  </button>
                ))}
              </div>
              {currentPrice && (
                <div className="p-6 bg-slate-900 rounded-2xl text-center">
                  <span className="text-4xl font-extrabold text-white">{currentPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form (WhatsApp Redirect) */}
      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-blue-50">
                {formStep === 1 ? (
                    <form onSubmit={handleSendWhatsApp} className="space-y-6">
                        <h2 className="text-3xl font-bold text-center mb-4 uppercase">Servis Talebi</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Adınız Soyadınız</label>
                                <input 
                                  required type="text" placeholder="Adınız Soyadınız" 
                                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">İletişim Numaranız</label>
                                <input 
                                  required type="tel" placeholder="05XX XXX XX XX" 
                                  className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
                                  value={formData.phone}
                                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">İzmir'de Bulunduğunuz Bölge</label>
                            <select 
                              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none"
                              value={formData.area}
                              onChange={(e) => setFormData({...formData, area: e.target.value})}
                            >
                                {['Buca', 'Bornova', 'Karşıyaka', 'Konak', 'Balçova', 'Gaziemir', 'Bayraklı', 'Çiğli', 'Diğer'].map(area => <option key={area}>{area}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Cihaz Alım Adresi</label>
                            <textarea 
                              required placeholder="Teslimat için tam adres..." 
                              className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border-none h-24"
                              value={formData.address}
                              onChange={(e) => setFormData({...formData, address: e.target.value})}
                            ></textarea>
                        </div>
                        
                        <button 
                          type="submit" disabled={isLoading}
                          className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
                        >
                          {isLoading ? <Loader2 className="animate-spin" /> : "Talebi WhatsApp'tan Gönder"}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-10">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 size={40} />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Talep WhatsApp'a İletildi!</h3>
                        <p className="text-slate-500 mb-8">Az önce oluşturduğunuz bilgiler WhatsApp üzerinden taslak mesaj olarak açılacaktır. Onaylayıp bize göndermeyi unutmayın.</p>
                        <button onClick={() => setFormStep(1)} className="text-blue-600 font-bold hover:underline">Yeni Bir Talep Gönder</button>
                    </div>
                )}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 text-center">
        <div className="container mx-auto px-4">
            <p className="font-bold text-lg mb-2 uppercase tracking-tighter">İzmir iPhone Kapında</p>
            <p className="text-slate-500 text-sm mb-6">Adresinize gelip aynı gün onarım yapıyoruz.</p>
            <div className="flex justify-center gap-6">
               <a href={`tel:${whatsappNumber}`} className="text-slate-400 hover:text-white transition"><Phone size={20} /></a>
               <a href={`https://wa.me/${whatsappNumber}`} className="text-slate-400 hover:text-white transition"><MessageCircle size={20} /></a>
            </div>
            <p className="mt-8 text-xs text-slate-600 font-bold uppercase">İLETİŞİM: {phoneNumber}</p>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${whatsappNumber}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white">
              <Phone size={24} />
          </a>
          <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition flex items-center justify-center border-4 border-white">
              <MessageCircle size={24} />
          </a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}} />
    </div>
  );
};

export default App;
