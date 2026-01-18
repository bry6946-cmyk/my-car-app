"use client";

import { useState, useEffect } from 'react';
import { Car, CloudRain, Star, Send, Tag, X, CheckCircle, Calendar, MapPin, Phone, Mail, User } from 'lucide-react';

// --- 天气组件 (自动获取 Newmarket 数据) ---
const fetchWeather = async () => {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=44.0592&longitude=-79.4613&current=temperature_2m,weather_code&hourly=precipitation_probability&timezone=America/Toronto&forecast_days=1'
    );
    const data = await response.json();
    return {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weather_code,
      rainProb: Math.max(...data.hourly.precipitation_probability.slice(0, 12))
    };
  } catch (error) {
    return { temp: 15, code: 0, rainProb: 20 };
  }
};

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
  if (code < 3) return <CloudRain className="w-5 h-5 text-gray-500" />;
  return <CloudRain className="w-5 h-5 text-blue-600" />;
};

// --- 模拟数据库 ---
const MOCK_BOOKINGS = [
  { id: 1, name: "Mike Ross", phone: "647-555-0101", vehicleType: "SUV", price: 180, tags: ["Good Tipper", "VIP"], internalNotes: "Always pays cash." },
  { id: 2, name: "Harvey Specter", phone: "647-555-0102", vehicleType: "Sedan", price: 120, tags: ["Picky"], internalNotes: "Check rims twice." }
];

export default function MobileDetailingSaaS() {
  const [isAdmin, setIsAdmin] = useState(false); // 核心开关：切换老板/客户视角
  const [formData, setFormData] = useState({
    name: '', phone: '', vehicleType: 'sedan',
    hasPets: false, hasBiohazard: false
  });
  const [bookings, setBookings] = useState<any[]>(MOCK_BOOKINGS);
  const [showRainModal, setShowRainModal] = useState(false);
  const [weather, setWeather] = useState({ temp: 15, code: 0, rainProb: 20 });
  const [editingNote, setEditingNote] = useState<number | null>(null);

  useEffect(() => { fetchWeather().then(setWeather); }, []);

  const prices = { sedan: 120, suv: 150, truck: 180 };
  const calculatePrice = () => {
    let total = prices[formData.vehicleType as keyof typeof prices];
    if (formData.hasPets) total += 40;
    if (formData.hasBiohazard) total += 60;
    return total;
  };

  const handleSubmit = () => {
    if (!formData.name) { alert('Please enter a name for the demo!'); return; }
    const newBooking = {
      id: Date.now(), ...formData, price: calculatePrice(),
      tags: [], internalNotes: ''
    };
    setBookings([newBooking, ...bookings]); // 新订单加到最前面
    alert("Booking Sent! Now switch to 'Owner View' to see it.");
  };

  const addTag = (bookingId: number, tag: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, tags: [...(b.tags || []), tag] } : b));
  };
  
  const updateNotes = (bookingId: number, notes: string) => {
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, internalNotes: notes } : b));
  };

  const tagColors: Record<string, string> = {
    'Good Tipper': 'bg-green-100 text-green-800 border-green-300',
    'Picky': 'bg-amber-100 text-amber-900 border-amber-300',
    'VIP': 'bg-purple-100 text-purple-800 border-purple-300'
  };

  // --- 界面 1: 老板后台 (Owner View) ---
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 pb-20">
        {/* Nav */}
        <div className="bg-white border-b border-gray-300 sticky top-0 z-20 shadow-sm">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Owner Dashboard
            </h1>
            <button 
              onClick={() => setIsAdmin(false)} 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-bold text-gray-800 transition-colors"
            >
              Exit Admin ↗
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
           {/* Weather Widget */}
           <div className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wide">Newmarket, ON</div>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-extrabold text-gray-900">{weather.temp}°C</span>
                  {getWeatherIcon(weather.code)}
                </div>
              </div>
              {weather.rainProb > 50 ? (
                 <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">
                   ⚠️ Rain Risk: {weather.rainProb}%
                 </div>
              ) : (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold border border-green-200">
                   ✅ Good to Wash
                 </div>
              )}
           </div>

           {/* Rain Mode Button */}
           <button 
             onClick={() => setShowRainModal(true)} 
             className="w-full py-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] transition-all rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-md shadow-red-200"
           >
             <CloudRain className="w-6 h-6" /> 
             Activate Rain Mode (Cancel Jobs)
           </button>

           {/* Bookings List */}
           <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Today's Schedule ({bookings.length})</h2>
           <div className="space-y-4">
             {bookings.map(booking => (
               <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-300 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="font-bold text-xl text-gray-900">{booking.name}</h3>
                     <p className="text-gray-600 text-base font-medium mt-1">{booking.vehicleType} • {booking.phone}</p>
                   </div>
                   <div className="text-right">
                     <div className="text-2xl font-bold text-blue-600">${booking.price}</div>
                   </div>
                 </div>
                 
                 {/* Tags */}
                 <div className="flex flex-wrap gap-2 mb-4">
                   {(booking.tags || []).map((t: string, i: number) => (
                     <span key={i} className={`text-xs px-3 py-1.5 rounded-full border font-bold ${tagColors[t] || 'bg-gray-100'}`}>{t}</span>
                   ))}
                   <button onClick={() => addTag(booking.id, 'Picky')} className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-400 hover:bg-gray-100 text-gray-600 font-bold">+ Picky</button>
                   <button onClick={() => addTag(booking.id, 'VIP')} className="text-xs bg-white px-3 py-1.5 rounded-full border border-gray-400 hover:bg-gray-100 text-gray-600 font-bold">+ VIP</button>
                 </div>

                 {/* Internal Notes */}
                 <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                   <div className="text-xs text-yellow-700 font-bold uppercase mb-1 tracking-wider">📝 Internal Notes</div>
                   {editingNote === booking.id ? (
                     <div>
                       <textarea 
                         className="w-full bg-white p-2 rounded-lg border border-gray-300 text-sm text-gray-900 mb-2 font-medium" 
                         defaultValue={booking.internalNotes}
                         onBlur={(e) => { updateNotes(booking.id, e.target.value); setEditingNote(null); }}
                         autoFocus
                       />
                     </div>
                   ) : (
                     <div onClick={() => setEditingNote(booking.id)} className="text-sm text-gray-800 font-medium cursor-pointer hover:text-black">
                       {booking.internalNotes || "Click to add notes..."}
                     </div>
                   )}
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Rain Modal */}
        {showRainModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
            <div className="bg-white p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 mx-auto">
                <CloudRain className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-2 text-gray-900">Reschedule Jobs?</h3>
              <p className="text-gray-600 text-center text-sm mb-6 font-medium">
                This will send an automated SMS to <span className="text-gray-900 font-bold">{bookings.length} customers</span>.
              </p>
              <div className="bg-gray-100 p-4 rounded-xl text-xs text-gray-600 italic mb-6 border border-gray-200 font-medium">
                "Hi [Name], due to severe weather alerts in Newmarket, we've paused operations..."
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setShowRainModal(false)} className="py-3 bg-gray-200 hover:bg-gray-300 rounded-xl font-bold text-gray-800 transition-colors">Cancel</button>
                <button onClick={() => { alert('SMS Blast Sent!'); setShowRainModal(false); }} className="py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-white transition-colors">Confirm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- 界面 2: 客户预约 (Customer View) ---
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">DetailPro</span>
          </div>
          <button 
            onClick={() => setIsAdmin(true)} 
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-xs font-bold hover:bg-gray-800 transition-all shadow-lg ring-2 ring-gray-100"
          >
            👀 Owner View
          </button>
        </div>
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
            Get More <span className="text-blue-600">5-Star Reviews</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg">Instant booking. No phone tag.</p>
        </div>
        
        <div className="bg-white border-2 border-gray-200 p-6 rounded-[2rem] shadow-xl shadow-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Book Your Detail</h2>
          <div className="space-y-5">
             <div className="space-y-4">
               {/* 修正：加深了 placeholder 颜色，加深了边框 */}
               <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Full Name</label>
                 <input 
                   placeholder="e.g. John Doe" 
                   className="w-full p-4 bg-gray-50 border-2 border-gray-300 focus:bg-white focus:border-blue-600 rounded-xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400" 
                   onChange={e => setFormData({...formData, name: e.target.value})} 
                 />
               </div>
               <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase ml-1">Phone Number</label>
                 <input 
                   placeholder="e.g. 647-555-0123" 
                   className="w-full p-4 bg-gray-50 border-2 border-gray-300 focus:bg-white focus:border-blue-600 rounded-xl outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400" 
                   onChange={e => setFormData({...formData, phone: e.target.value})} 
                 />
               </div>
             </div>
             
             <div className="space-y-1">
               <label className="text-xs font-bold text-gray-500 uppercase ml-1">Vehicle Type</label>
               <div className="grid grid-cols-3 gap-3">
                 {['sedan', 'suv', 'truck'].map(t => (
                   <button key={t} onClick={() => setFormData({...formData, vehicleType: t})} className={`p-4 rounded-xl border-2 transition-all ${formData.vehicleType === t ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-[1.02]' : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'}`}>
                     <div className="text-[10px] uppercase font-extrabold tracking-wider opacity-80 mb-1">{t}</div>
                     <div className="font-extrabold text-lg">${prices[t as keyof typeof prices]}</div>
                   </button>
                 ))}
               </div>
             </div>

             <div className="space-y-3 pt-2">
               <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.hasPets ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded text-blue-600 border-gray-300" onChange={e => setFormData({...formData, hasPets: e.target.checked})} /> 
                    <span className="font-bold text-gray-800">Dog Hair</span>
                 </div>
                 <span className="font-bold text-gray-900">+$40</span>
               </label>
               <label className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.hasBiohazard ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}`}>
                 <div className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 rounded text-red-600 border-gray-300" onChange={e => setFormData({...formData, hasBiohazard: e.target.checked})} /> 
                    <span className="font-bold text-gray-800">Biohazard / Vomit</span>
                 </div>
                 <span className="font-bold text-gray-900">+$60</span>
               </label>
             </div>

             <div className="p-5 bg-gray-100 rounded-xl flex justify-between items-center mt-6 border border-gray-200">
               <span className="font-bold text-gray-600">Estimated Total</span>
               <span className="text-4xl font-extrabold text-gray-900 tracking-tight">${calculatePrice()}</span>
             </div>

             <button onClick={handleSubmit} className="w-full py-5 bg-blue-600 text-white font-extrabold text-xl rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-200">
               Book Appointment
             </button>
          </div>
        </div>

        {/* Features / Social Proof */}
        <div className="mt-12 grid grid-cols-2 gap-4 opacity-80">
           <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <CloudRain className="w-8 h-8 text-blue-500 mb-2" />
              <div className="font-bold text-gray-900">Weather Shield</div>
              <div className="text-xs text-gray-500 font-medium">Auto-reschedule text</div>
           </div>
           <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <Tag className="w-8 h-8 text-blue-500 mb-2" />
              <div className="font-bold text-gray-900">Smart Tags</div>
              <div className="text-xs text-gray-500 font-medium">Track picky clients</div>
           </div>
        </div>
      </div>
    </div>
  );
}