"use client";

import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Sun, Tag, Trash2, Plus, 
  Lock, Check, DollarSign,
  Car, Truck, Bus, Loader2 
} from 'lucide-react';

// --- 常量定义 ---
const TAG_COLORS = {
  blue: 'bg-blue-100 text-blue-800 border-blue-200',
  green: 'bg-green-100 text-green-800 border-green-200',
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
  purple: 'bg-purple-100 text-purple-800 border-purple-200',
} as const;

// --- 多语言字典 ---
const t = {
  en: {
    brand: "Ruiyu Auto Spa",
    vehicleType: "Select Vehicle Type",
    packages: "Select Package",
    addons: "Add-ons & Surcharges",
    contact: "Contact Info",
    pay: "Pay & Book",
    total: "Estimated Total",
    sedan: "Sedan/Coupe",
    suv: "SUV/Crossover",
    truck: "Truck/Minivan",
    dogHair: "Pet Hair Removal",
    biohazard: "Biohazard / Vomit",
    sand: "Excessive Sand",
    name: "Full Name",
    phone: "Phone Number",
    notes: "Notes (Gate code, etc.)",
    rainMode: "Rain Mode",
    temp: "London, ON",
    tags: "Client Tags",
    addTag: "Add Tag",
    login: "Owner Access",
    welcome: "Welcome back, Boss.",
    jobs: "Upcoming Jobs",
    bookingSuccess: "Booking request sent!",
    valName: "Please enter your name",
    valPhone: "Please enter a valid 10-digit phone number"
  },
  zh: {
    brand: "瑞宇汽车美容",
    vehicleType: "选择车型",
    packages: "选择套餐",
    addons: "附加选项",
    contact: "联系信息",
    pay: "支付并预约",
    total: "预估总价",
    sedan: "轿车/跑车",
    suv: "SUV/越野车",
    truck: "皮卡/MPV",
    dogHair: "宠物毛发清理",
    biohazard: "异味/呕吐物处理",
    sand: "重度泥沙清理",
    name: "您的称呼",
    phone: "联系电话",
    notes: "备注 (门禁密码、注意事项)",
    rainMode: "雨天模式",
    temp: "安大略省 伦敦",
    tags: "客户标签",
    addTag: "添加标签",
    login: "店主入口",
    welcome: "欢迎回来，老板",
    jobs: "待办任务",
    bookingSuccess: "预约请求已发送！",
    valName: "请输入您的姓名",
    valPhone: "请输入有效的10位电话号码"
  },
  fr: {
    brand: "Ruiyu Auto Spa",
    vehicleType: "Type de Véhicule",
    packages: "Forfaits",
    addons: "Suppléments",
    contact: "Contact",
    pay: "Payer et Réserver",
    total: "Total Estimé",
    sedan: "Berline/Coupé",
    suv: "VUS/Crossover",
    truck: "Camion/Minivan",
    dogHair: "Poils d'animaux",
    biohazard: "Risque biologique",
    sand: "Sable excessif",
    name: "Nom complet",
    phone: "Téléphone",
    notes: "Notes (Code d'accès, etc.)",
    rainMode: "Mode Pluie",
    temp: "London, ON",
    tags: "Tags Client",
    addTag: "Ajouter Tag",
    login: "Accès Propriétaire",
    welcome: "Bon retour, Patron.",
    jobs: "Travaux à venir",
    bookingSuccess: "Demande envoyée!",
    valName: "Entrez votre nom",
    valPhone: "Entrez un numéro valide"
  }
};

export default function MobileDetailingSaaS() {
  const [lang, setLang] = useState<'en' | 'zh' | 'fr'>('en');
  const [viewMode, setViewMode] = useState('customer'); 
  const [showLogin, setShowLogin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [weather, setWeather] = useState({ temp: 0, condition: 'Loading...', rainMode: false });
  const [tags, setTags] = useState([
    { id: 1, text: 'VIP', color: TAG_COLORS.yellow },
    { id: 2, text: 'Weekly', color: TAG_COLORS.blue },
  ]);
  const [newTagText, setNewTagText] = useState('');
  const [selectedTagColor, setSelectedTagColor] = useState<keyof typeof TAG_COLORS>('blue');

  const [details, setDetails] = useState({
    vehicleType: 'sedan',
    packageId: 'standard',
    addons: [] as string[],
    name: '',
    phone: '',
    notes: ''
  });

  const content = t[lang]; 

  useEffect(() => {
    // 修复点：加上 (data: any) 绕过类型检查
    fetch('https://api.open-meteo.com/v1/forecast?latitude=42.98&longitude=-81.24&current=temperature_2m,precipitation,weather_code&timezone=America%2FNew_York')
      .then(res => res.json())
      .then((data: any) => {
        const temp = Math.round(data.current.temperature_2m);
        const precip = data.current.precipitation;
        const isRaining = precip > 0;
        
        setWeather({
          temp: temp,
          condition: isRaining ? 'Rainy' : 'Clear',
          rainMode: isRaining 
        });
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);

  const packages = [
    { id: 'express', name: 'Express Wash', price: 45, desc: 'Exterior wash & wax, rim cleaning' },
    { id: 'standard', name: 'Standard Detail', price: 120, desc: 'Full interior vacuum, wipe down, exterior hand wash' },
    { id: 'premium', name: 'Premium Detail', price: 250, desc: 'Steam cleaning, leather conditioning, clay bar' },
  ];

  const calculateTotal = () => {
    let total = packages.find(p => p.id === details.packageId)?.price || 0;
    if (details.vehicleType === 'suv') total += 20;
    if (details.vehicleType === 'truck') total += 40;
    if (details.addons.includes('dogHair')) total += 50;
    if (details.addons.includes('biohazard')) total += 80;
    if (details.addons.includes('sand')) total += 30;
    return total;
  };

  const toggleAddon = (id: string) => {
    setDetails(prev => ({
      ...prev,
      addons: prev.addons.includes(id) 
        ? prev.addons.filter(x => x !== id)
        : [...prev.addons, id]
    }));
  };

  const handleBooking = () => {
    if (!details.name.trim()) {
      alert(content.valName);
      return;
    }
    if (!/^\d{10,11}$/.test(details.phone.replace(/\D/g, ''))) {
      alert(content.valPhone);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`${content.bookingSuccess}\nTotal: $${calculateTotal()}`);
    }, 1500);
  };

  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    setTags([...tags, { id: Date.now(), text: newTagText, color: TAG_COLORS[selectedTagColor] }]);
    setNewTagText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
      
      <nav className="bg-white px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="font-black text-xl tracking-tight text-blue-700">{content.brand}</div>
        <div className="flex gap-2 items-center">
          {(['en', 'zh', 'fr'] as const).map((l) => (
            <button 
              key={l} 
              onClick={() => setLang(l)} 
              className={`text-xs font-bold px-2 py-1 rounded transition-colors ${lang === l ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
          {viewMode === 'owner' && (
             <button onClick={() => setViewMode('customer')} className="ml-2 text-xs text-red-500 font-bold border border-red-200 px-2 py-1 rounded">Exit</button>
          )}
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4">

        {viewMode === 'customer' && !showLogin && (
          <div className="animate-in fade-in duration-500 space-y-6">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{content.vehicleType}</h2>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sedan', label: content.sedan, icon: <Car className="w-6 h-6 mb-1"/> },
                  { id: 'suv', label: content.suv, icon: <Bus className="w-6 h-6 mb-1"/> },
                  { id: 'truck', label: content.truck, icon: <Truck className="w-6 h-6 mb-1"/> }
                ].map((type) => (
                  <button 
                    key={type.id}
                    onClick={() => setDetails({...details, vehicleType: type.id})}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      details.vehicleType === type.id 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {type.icon}
                    <span className="text-[10px] font-bold text-center leading-tight">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{content.packages}</h2>
              <div className="space-y-3">
                {packages.map(pkg => (
                  <div 
                    key={pkg.id}
                    onClick={() => setDetails({...details, packageId: pkg.id})}
                    className={`p-4 rounded-xl border-2 cursor-pointer relative transition-all ${
                      details.packageId === pkg.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-bold ${details.packageId === pkg.id ? 'text-blue-900' : 'text-gray-900'}`}>{pkg.name}</span>
                      <span className="font-black text-lg">${pkg.price}</span>
                    </div>
                    <p className="text-xs text-gray-500">{pkg.desc}</p>
                    {details.packageId === pkg.id && (
                      <div className="absolute top-4 right-4 text-blue-600">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{content.addons}</h2>
              <div className="space-y-3">
                {[
                  { id: 'dogHair', label: content.dogHair, price: 50 },
                  { id: 'biohazard', label: content.biohazard, price: 80 },
                  { id: 'sand', label: content.sand, price: 30 },
                ].map(addon => (
                  <label key={addon.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${details.addons.includes(addon.id) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}>
                        {details.addons.includes(addon.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-medium text-gray-700">{addon.label}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-500">+${addon.price}</span>
                    <input type="checkbox" className="hidden" checked={details.addons.includes(addon.id)} onChange={() => toggleAddon(addon.id)} />
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{content.contact}</h2>
              <input 
                type="text" 
                placeholder={content.name}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                value={details.name}
                // 修复点：加上 (e: any)
                onChange={(e: any) => setDetails({...details, name: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder={content.phone}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                value={details.phone}
                // 修复点：加上 (e: any)
                onChange={(e: any) => setDetails({...details, phone: e.target.value})}
              />
              <textarea 
                placeholder={content.notes}
                rows={2}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all"
                value={details.notes}
                // 修复点：加上 (e: any)
                onChange={(e: any) => setDetails({...details, notes: e.target.value})}
              />
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
              <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-gray-500 font-medium">{content.total}</div>
                  <div className="text-2xl font-black text-gray-900">${calculateTotal()}</div>
                </div>
                <button 
                  onClick={handleBooking}
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><DollarSign className="w-4 h-4" /> {content.pay}</>}
                </button>
              </div>
            </div>

            <div className="pt-20 pb-10 text-center">
               <button onClick={() => setShowLogin(true)} className="text-gray-300 text-xs hover:text-gray-500 font-medium">{content.login}</button>
            </div>
          </div>
        )}

        {showLogin && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-300">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-center">{content.login}</h2>
              <div className="flex justify-center mb-6">
                 <div className="bg-gray-100 p-4 rounded-full">
                    <Lock className="w-8 h-8 text-gray-400" />
                 </div>
              </div>
              <input 
                type="password" 
                placeholder="PIN (8888)"
                className="w-full text-center text-2xl tracking-widest p-4 bg-gray-50 rounded-xl border mb-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={passwordInput}
                // 修复点：加上 (e: any)
                onChange={(e: any) => setPasswordInput(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowLogin(false)} className="p-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={() => {
                  if(passwordInput === '8888') { setViewMode('owner'); setShowLogin(false); setPasswordInput(''); } 
                  else alert('Demo PIN: 8888');
                }} className="p-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors">Login</button>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'owner' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            
            <div className={`p-6 rounded-3xl text-white shadow-xl transition-colors ${weather.rainMode ? 'bg-red-500' : 'bg-blue-600'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{content.welcome}</h1>
                  <div className="flex items-center gap-2 mt-1 opacity-90">
                    {weather.rainMode ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    <span className="font-medium">{weather.temp}°C {content.temp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase opacity-75 mb-1">{content.rainMode}</div>
                  <button 
                    onClick={() => setWeather(prev => ({...prev, rainMode: !prev.rainMode}))}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${weather.rainMode ? 'bg-white text-red-500' : 'bg-blue-700 text-blue-200'}`}
                  >
                    {weather.rainMode ? "Active" : "Inactive"}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" /> {content.tags}
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <span key={tag.id} className={`${tag.color} border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {tag.text}
                    <button onClick={() => setTags(tags.filter(t => t.id !== tag.id))} className="hover:opacity-50 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  {(Object.keys(TAG_COLORS) as Array<keyof typeof TAG_COLORS>).map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedTagColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${selectedTagColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color === 'yellow' ? '#fef08a' : color === 'red' ? '#fecaca' : color === 'green' ? '#bbf7d0' : color === 'purple' ? '#e9d5ff' : '#bfdbfe' }} 
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={content.addTag}
                    className="flex-1 p-2 bg-gray-50 rounded-lg text-sm outline-none border focus:border-blue-500 transition-colors"
                    value={newTagText}
                    // 修复点：加上 (e: any)
                    onChange={(e: any) => setNewTagText(e.target.value)}
                  />
                  <button 
                    onClick={handleAddTag}
                    className="bg-black text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-800 px-1">{content.jobs}</h3>
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm group">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-lg">Mike Ross</div>
                    <div className="text-gray-500 text-sm">Tesla Model S (Sedan)</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">14:00</div>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className={`${TAG_COLORS.yellow} border px-2 py-0.5 rounded text-[10px] font-bold`}>VIP</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <div className="text-xs text-gray-500 font-bold uppercase">Internal Notes</div>
                  <textarea 
                    className="w-full bg-transparent text-sm text-gray-700 outline-none resize-none"
                    placeholder="Add private notes..."
                    defaultValue="Prefer text over call. Watch out for curbs."
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}