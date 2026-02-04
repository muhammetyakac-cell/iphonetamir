import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Battery, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Menu,
  X,
  Instagram,
  ChevronDown
} from 'lucide-react';

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [formStep, setFormStep] = useState(1);
  const [scrolled, setScrolled] = useState(false);

  // Telefon Numarası
  const phoneNumber = "0532 442 72 812";
  const whatsappNumber = "9053244272812";

  // Güncellenmiş ve Genişletilmiş Fiyat Listesi (Tahmini Fiyatlar)
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className="bg-blue-600 p-2 rounded-lg">
              <Smartphone className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900 uppercase">iZMiR iPHONE <span className="text-blue-600 font-black">KAPINDA</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            <button onClick={() => scrollToSection('services')} className="hover:text-blue-600 transition">Hizmetler</button>
            <button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-600 transition">Nasıl Çalışır?</button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition">Fiyatlar</button>
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
            <button onClick={() => scrollToSection('how-it-works')} className="text-left py-2 border-b">Nasıl Çalışır?</button>
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
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-2">
              İzmir'in Tamamına VIP Mobil Hizmet
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              iPhone'unuz Bozuldu mu? <br />
              <span className="text-blue-600">Biz Gelip Alalım.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
              Servis servis gezmenize gerek yok. Kapınızdan alıyoruz, onarıyoruz ve aynı gün içinde teslim ediyoruz. Üstelik parça garantisiyle!
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
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow-xl shadow-green-100 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" /> WhatsApp: {phoneNumber}
              </a>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="font-medium text-slate-700 underline decoration-blue-200">Aynı Gün Teslim</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500 w-5 h-5" />
                <span className="font-medium text-slate-700 underline decoration-blue-200">Garantili Parça</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0 relative flex justify-center">
            <div className="relative z-10 animate-float">
               <div className="bg-white p-6 rounded-3xl shadow-2xl max-w-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 p-3 rounded-2xl">
                        <Smartphone className="text-blue-600 w-8 h-8" />
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
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-20 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">Uzmanlık Alanlarımız</h2>
            <p className="text-slate-600">iPhone X'ten 16 Pro Max'e tüm modellerde profesyonel ekipmanlarla hizmet veriyoruz.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 bg-slate-50 hover:bg-white text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-blue-600 transition-colors">
                <Smartphone className="text-blue-600 group-hover:text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Ekran Değişimi</h3>
              <p className="text-slate-600 mb-6">Kırık veya dokunmatiği arızalı ekranları 30 dakikada yeniliyoruz. Orijinal ve A+ kalite seçenekleri.</p>
              <ul className="text-left space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> True Tone Aktarımı</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Sıvı Koruma Bandı Yenileme</li>
              </ul>
            </div>

            <div className="group p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 bg-slate-50 hover:bg-white text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-blue-600 transition-colors">
                <Battery className="text-blue-600 group-hover:text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Batarya Değişimi</h3>
              <p className="text-slate-600 mb-6">Yüksek kapasiteli pillerle performans artışı. Cihazınızın pil sağlığını fabrika ayarlarına döndürüyoruz.</p>
              <ul className="text-left space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> %100 Pil Sağlığı</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 6 Ay Kapasite Garantisi</li>
              </ul>
            </div>

            <div className="group p-8 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-xl transition-all duration-300 bg-slate-50 hover:bg-white text-center">
              <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:bg-blue-600 transition-colors">
                <ShieldCheck className="text-blue-600 group-hover:text-white w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Arka Cam & Kasa</h3>
              <p className="text-slate-600 mb-6">Lazer teknolojisi ile kasa değişimi yapmadan sadece arka cam onarımı. Şarj soketi ve kamera revizyonu.</p>
              <ul className="text-left space-y-2 text-sm text-slate-500 mb-6">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Lazerle Hassas Onarım</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Ücretsiz Toz Temizliği</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase">Kapıdan Kapıya Servis Süreci</h2>
            <p className="text-slate-400">İzmir'in neresinde olursanız olun, biz geliyoruz.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-blue-900/50 -z-0"></div>
            {[
              { step: "01", title: "Randevu", desc: "Formu doldurun veya arayın.", icon: <Clock /> },
              { step: "02", title: "Kurye", desc: "Adresinizden teslim alalım.", icon: <MapPin /> },
              { step: "03", title: "Onarım", desc: "Teknik servisimizde onaralım.", icon: <Smartphone /> },
              { step: "04", title: "Teslimat", desc: "Aynı gün kapınıza getirelim.", icon: <CheckCircle2 /> }
            ].map((item, idx) => (
              <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  {React.cloneElement(item.icon, { className: "w-8 h-8 text-white" })}
                </div>
                <span className="text-blue-500 font-bold text-sm mb-2">{item.step}</span>
                <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-[40px] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-100">
            <div className="md:w-1/2 p-10 bg-blue-600 text-white flex flex-col justify-center">
              <h3 className="text-3xl font-bold mb-4">Güncel Fiyat Listesi</h3>
              <p className="opacity-90 mb-8 text-lg">Modelinizi seçin, anında tahmini fiyatı görün. Tüm fiyatlara işçilik ve servis kurye ücreti dahildir.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</div>
                    <span>iPhone X - 16 Pro Max Arası Tüm Modeller</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">✓</div>
                    <span>Kapıdan Alım & Teslimat Ücretsiz</span>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 p-10 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">iPhone Modeliniz</label>
                <div className="relative">
                    <select 
                      className="w-full p-4 bg-slate-50 border-none rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                        <option value="">Model Seçiniz...</option>
                        {Object.keys(prices).map(model => <option key={model} value={model}>{model}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Hizmet Türü</label>
                <div className="flex gap-2">
                    {['Ekran Değişimi', 'Batarya Değişimi'].map(type => (
                        <button 
                          key={type}
                          onClick={() => setSelectedService(type)}
                          className={`flex-1 p-3 rounded-xl border-2 transition-all font-bold text-sm ${selectedService === type ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              {currentPrice && (
                <div className="p-6 bg-slate-900 rounded-2xl text-center animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-slate-400 text-sm mb-1">{selectedModel} {selectedService}</p>
                    <span className="text-4xl font-extrabold text-white">{currentPrice.toLocaleString('tr-TR')} <small className="text-xl">₺</small></span>
                    <p className="text-blue-400 text-xs mt-2 uppercase font-bold tracking-widest">KDV DAHİL</p>
                </div>
              )}

              {!currentPrice && (
                <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                    Hesaplama yapmak için seçim yapın.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Form */}
      <section id="appointment" className="py-20 bg-white">
        <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-2 uppercase">Hızlı Servis Talebi</h2>
                    <p className="text-slate-500">Formu doldurun, kuryemiz 30 dakika içinde kapınızda olsun.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[32px] border border-slate-100 shadow-2xl">
                    {formStep === 1 ? (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700">Adınız Soyadınız</label>
                                    <input type="text" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent" placeholder="Örn: Ahmet Yılmaz" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700">İletişim Numaranız</label>
                                    <input type="tel" className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent" placeholder="05XX XXX XX XX" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">İzmir'de Bulunduğunuz Bölge</label>
                                <select className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent">
                                    <option>Buca</option>
                                    <option>Bornova</option>
                                    <option>Karşıyaka / Mavişehir</option>
                                    <option>Konak / Alsancak</option>
                                    <option>Balçova / Narlıdere</option>
                                    <option>Gaziemir</option>
                                    <option>Bayraklı</option>
                                    <option>Diğer</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Cihaz Alım Adresi</label>
                                <textarea className="w-full p-4 bg-slate-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 border border-transparent h-24" placeholder="Kuryemizin cihazı teslim alacağı tam adres..."></textarea>
                            </div>
                            <button 
                                onClick={() => setFormStep(2)}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-200"
                            >
                                Servis Talebi Oluştur
                            </button>
                        </div>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Talebiniz Kaydedildi!</h3>
                            <p className="text-slate-500 mb-8">Teknik ekibimiz 15 dakika içinde sizi <b>{phoneNumber}</b> üzerinden arayarak kurye teyidi yapacaktır.</p>
                            <button 
                                onClick={() => setFormStep(1)}
                                className="text-blue-600 font-bold hover:underline"
                            >
                                Yeni Bir Servis Talebi Gönder
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white pt-20 pb-10">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2 space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-2 rounded-lg text-white">
                            <Smartphone className="w-6 h-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight uppercase">iZMiR iPHONE <span className="text-blue-600">KAPINDA</span></span>
                    </div>
                    <p className="text-slate-400 max-w-sm">
                        İzmir'in tamamına 7/24 ulaşımlı kurye desteği ile profesyonel iPhone teknik servis hizmeti. iPhone X - 16 Pro Max arası tüm modellerde uzman onarım.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="bg-slate-900 p-3 rounded-xl hover:bg-blue-600 transition shadow-lg"><Instagram /></a>
                        <a href={`tel:${whatsappNumber}`} className="bg-slate-900 p-3 rounded-xl hover:bg-blue-600 transition shadow-lg"><Phone /></a>
                    </div>
                </div>
                <div>
                    <h5 className="font-bold mb-6 text-lg uppercase tracking-wider text-blue-500">Hızlı Erişim</h5>
                    <ul className="space-y-4 text-slate-400 font-medium">
                        <li><button onClick={() => scrollToSection('home')} className="hover:text-white transition">Ana Sayfa</button></li>
                        <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition">Uzmanlıklar</button></li>
                        <li><button onClick={() => scrollToSection('pricing')} className="hover:text-white transition">Fiyat Listesi</button></li>
                        <li><button onClick={() => scrollToSection('appointment')} className="hover:text-white transition">Randevu Al</button></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold mb-6 text-lg uppercase tracking-wider text-blue-500">İletişim Bilgileri</h5>
                    <ul className="space-y-4 text-slate-400">
                        <li className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-blue-500" /> {phoneNumber}
                        </li>
                        <li className="flex items-center gap-3">
                            <MessageCircle className="w-5 h-5 text-green-500" /> WhatsApp Destek Hattı
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-blue-500" /> Tüm İzmir Semtleri (Buca, Bornova, Karşıyaka...)
                        </li>
                        <li className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-blue-500" /> Pzt-Cmt: 09:00 - 21:00
                        </li>
                    </ul>
                </div>
            </div>
            <div className="pt-8 border-t border-slate-900 text-center text-slate-500 text-sm">
                &copy; {new Date().getFullYear()} İzmir iPhone Kapında. Apple Inc. ile resmi bir bağı yoktur.
            </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
          <a href={`tel:${whatsappNumber}`} className="bg-blue-600 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition flex items-center justify-center">
              <Phone className="w-6 h-6" />
          </a>
          <a href={`https://wa.me/${whatsappNumber}`} className="bg-green-500 text-white p-4 rounded-full shadow-2xl border-4 border-white hover:scale-110 transition flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
          </a>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default App;