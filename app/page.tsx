"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { 
  CloudRain, Sun, Tag, Trash2, Plus, Lock, DollarSign, Car, Truck, Bus, Loader2, 
  Users, Calendar, Settings, ChevronLeft, ChevronRight, Search, Phone, Mail, Clock,
  Edit2, Save, X, User, MapPin, FileText, Star, AlertCircle, Snowflake, TrendingUp, 
  TrendingDown, Package, Droplets, Download, BarChart3, PieChart, Receipt, Printer, 
  AlertTriangle, CalendarDays, CalendarRange, Minus, CheckCircle2
} from 'lucide-react';
import { BarChart, Bar, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';

// ==================== 类型定义 ====================
interface Package { id: string; name: string; nameZh: string; price: number; desc: string; descZh: string; duration: number; active: boolean; seasonal?: 'summer' | 'winter' | 'all'; }
interface Addon { id: string; name: string; nameZh: string; price: number; active: boolean; seasonal?: 'summer' | 'winter' | 'all'; }
interface CustomerTag { id: string; text: string; color: string; }
interface Customer { id: string; name: string; phone: string; email: string; address: string; vehicleType: 'sedan' | 'suv' | 'truck'; vehicleInfo: string; tags: CustomerTag[]; notes: string; totalSpent: number; visitCount: number; lastVisit: string | null; createdAt: string; }
interface Booking { id: string; customerId: string; packageId: string; addonIds: string[]; date: string; time: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'; total: number; notes: string; suppliesUsed?: SupplyUsage[]; }
interface MerchantSettings { businessName: string; businessNameZh: string; suvSurcharge: number; truckSurcharge: number; rainModeActive: boolean; winterModeActive: boolean; hstRate: number; }
interface Supply { id: string; name: string; nameZh: string; unit: string; currentStock: number; minStock: number; costPerUnit: number; category: 'liquid' | 'wax' | 'cloth' | 'other'; }
interface SupplyUsage { supplyId: string; amount: number; }
interface Invoice { id: string; bookingId: string; customerId: string; date: string; items: InvoiceItem[]; subtotal: number; hst: number; total: number; status: 'draft' | 'sent' | 'paid'; }
interface InvoiceItem { description: string; quantity: number; unitPrice: number; total: number; }

// ==================== 常量 ====================
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
};
const VEHICLE_ICONS = { sedan: Car, suv: Bus, truck: Truck };
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_ZH = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
const WEEKDAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_ZH = ['日', '一', '二', '三', '四', '五', '六'];

// ==================== 多语言 ====================
const translations = {
  en: {
    brand: "Ruiyu Auto Spa", customers: "Customers", calendar: "Calendar", settings: "Settings",
    vehicleType: "Vehicle Type", sedan: "Sedan/Coupe", suv: "SUV/Crossover", truck: "Truck/Minivan",
    packages: "Select Package", addons: "Add-ons", contact: "Contact Info", pay: "Book Now",
    total: "Total", name: "Full Name", phone: "Phone Number", email: "Email", address: "Service Address", notes: "Notes",
    searchCustomers: "Search...", addCustomer: "Add", noCustomers: "No customers yet",
    customerDetails: "Details", editCustomer: "Edit", saveCustomer: "Save", deleteCustomer: "Delete",
    totalSpent: "Total Spent", visits: "Visits", lastVisit: "Last Visit", vehicleInfo: "Vehicle Info",
    customerTags: "Tags", addTag: "Add Tag", internalNotes: "Internal Notes",
    businessSettings: "Business Settings", packageManagement: "Packages", addonManagement: "Add-ons",
    pricingRules: "Pricing", suvSurcharge: "SUV +", truckSurcharge: "Truck +",
    addPackage: "Add Package", addAddon: "Add Add-on", active: "Active",
    rainMode: "Rain Mode", pending: "Pending", confirmed: "Confirmed", completed: "Completed",
    cancelled: "Cancelled", noShow: "No-Show", valName: "Enter name", valPhone: "Enter valid phone",
    bookingSuccess: "Booking created!", ownerLogin: "Owner Access", loginPin: "Enter PIN",
    login: "Login", logout: "Logout", today: "Today", noBookings: "No bookings",
    revenue: "Revenue", supplies: "Supplies", winterMode: "Winter Mode",
    winterPackages: "Winter Packages", allSeason: "All Season",
    saltRemoval: "Salt Removal", rustProtection: "Rust Protection",
    lowStock: "Low Stock", restock: "Restock", supplyName: "Name", currentStock: "Stock",
    minStock: "Min", costPerUnit: "Cost/Unit", addSupply: "Add Supply",
    dailyRevenue: "Daily", weeklyRevenue: "Weekly", monthlyRevenue: "Monthly",
    totalRevenue: "Total Revenue", avgPerBooking: "Avg/Booking", bookingsCount: "Bookings",
    vsLastPeriod: "vs last period", generateInvoice: "Invoice", invoiceNumber: "Invoice #",
    subtotal: "Subtotal", hst: "HST (13%)", downloadPdf: "Download PDF", sendInvoice: "Send",
    paid: "Paid", draft: "Draft", sent: "Sent", monthView: "Month", dayView: "Day",
    profit: "Profit", cost: "Cost", margin: "Margin",
  },
  zh: {
    brand: "瑞宇汽车美容", customers: "客户", calendar: "日程", settings: "设置",
    vehicleType: "车型", sedan: "轿车", suv: "SUV", truck: "皮卡",
    packages: "套餐", addons: "附加", contact: "联系方式", pay: "预约",
    total: "合计", name: "姓名", phone: "电话", email: "邮箱", address: "地址", notes: "备注",
    searchCustomers: "搜索...", addCustomer: "添加", noCustomers: "暂无客户",
    customerDetails: "详情", editCustomer: "编辑", saveCustomer: "保存", deleteCustomer: "删除",
    totalSpent: "消费", visits: "次数", lastVisit: "上次", vehicleInfo: "车辆",
    customerTags: "标签", addTag: "添加标签", internalNotes: "备注",
    businessSettings: "商家设置", packageManagement: "套餐管理", addonManagement: "附加服务",
    pricingRules: "价格", suvSurcharge: "SUV加价", truckSurcharge: "皮卡加价",
    addPackage: "添加套餐", addAddon: "添加附加", active: "启用",
    rainMode: "雨天模式", pending: "待确认", confirmed: "已确认", completed: "已完成",
    cancelled: "已取消", noShow: "未到", valName: "请输入姓名", valPhone: "请输入电话",
    bookingSuccess: "预约成功！", ownerLogin: "店主登录", loginPin: "输入PIN",
    login: "登录", logout: "退出", today: "今天", noBookings: "暂无预约",
    revenue: "收入", supplies: "耗材", winterMode: "冬季模式",
    winterPackages: "冬季套餐", allSeason: "全年",
    saltRemoval: "盐渍清理", rustProtection: "防锈",
    lowStock: "库存预警", restock: "补货", supplyName: "名称", currentStock: "库存",
    minStock: "最低", costPerUnit: "成本", addSupply: "添加耗材",
    dailyRevenue: "日", weeklyRevenue: "周", monthlyRevenue: "月",
    totalRevenue: "总收入", avgPerBooking: "单均", bookingsCount: "订单",
    vsLastPeriod: "环比", generateInvoice: "发票", invoiceNumber: "发票号",
    subtotal: "小计", hst: "HST (13%)", downloadPdf: "下载PDF", sendInvoice: "发送",
    paid: "已付", draft: "草稿", sent: "已发", monthView: "月", dayView: "日",
    profit: "利润", cost: "成本", margin: "利润率",
  },
};

// ==================== 初始数据 ====================
const initialPackages: Package[] = [
  { id: 'express', name: 'Express Wash', nameZh: '快速清洗', price: 45, desc: 'Exterior wash & wax', descZh: '外观清洗打蜡', duration: 45, active: true, seasonal: 'all' },
  { id: 'standard', name: 'Standard Detail', nameZh: '标准养护', price: 120, desc: 'Full interior + exterior', descZh: '内外全套护理', duration: 120, active: true, seasonal: 'all' },
  { id: 'premium', name: 'Premium Detail', nameZh: '尊享护理', price: 250, desc: 'Steam + leather + clay bar', descZh: '蒸汽+皮革+去污', duration: 240, active: true, seasonal: 'all' },
  { id: 'winter-salt', name: 'Salt Removal', nameZh: '盐渍清理', price: 89, desc: 'Remove road salt & brine', descZh: '清除道路盐渍', duration: 60, active: true, seasonal: 'winter' },
  { id: 'winter-rust', name: 'Rust Protection', nameZh: '底盘防锈', price: 199, desc: 'Undercarriage + rust inhibitor', descZh: '底盘清洗+防锈', duration: 90, active: true, seasonal: 'winter' },
  { id: 'winter-interior', name: 'Interior Only', nameZh: '室内服务', price: 150, desc: 'Full interior in garage', descZh: '车库内饰护理', duration: 150, active: true, seasonal: 'winter' },
  { id: 'ceramic', name: 'Ceramic Coating', nameZh: '陶瓷涂层', price: 599, desc: '9H ceramic protection', descZh: '9H陶瓷持久保护', duration: 480, active: true, seasonal: 'all' },
];

const initialAddons: Addon[] = [
  { id: 'dogHair', name: 'Pet Hair', nameZh: '宠物毛发', price: 50, active: true, seasonal: 'all' },
  { id: 'biohazard', name: 'Biohazard', nameZh: '异味处理', price: 80, active: true, seasonal: 'all' },
  { id: 'sand', name: 'Heavy Sand', nameZh: '重度泥沙', price: 30, active: true, seasonal: 'summer' },
  { id: 'floorMats', name: 'Deep Clean Mats', nameZh: '脚垫深洗', price: 25, active: true, seasonal: 'winter' },
  { id: 'doorJambs', name: 'Door Seals', nameZh: '门缝护理', price: 35, active: true, seasonal: 'winter' },
];

const initialSupplies: Supply[] = [
  { id: 's1', name: 'Car Wash Soap', nameZh: '洗车液', unit: 'ml', currentStock: 5000, minStock: 1000, costPerUnit: 0.02, category: 'liquid' },
  { id: 's2', name: 'Carnauba Wax', nameZh: '棕榈蜡', unit: 'g', currentStock: 800, minStock: 200, costPerUnit: 0.15, category: 'wax' },
  { id: 's3', name: 'Interior Cleaner', nameZh: '内饰清洁剂', unit: 'ml', currentStock: 3000, minStock: 500, costPerUnit: 0.03, category: 'liquid' },
  { id: 's4', name: 'Microfiber Towels', nameZh: '超纤毛巾', unit: 'pcs', currentStock: 50, minStock: 20, costPerUnit: 2.5, category: 'cloth' },
  { id: 's5', name: 'Leather Conditioner', nameZh: '皮革护理剂', unit: 'ml', currentStock: 1500, minStock: 300, costPerUnit: 0.08, category: 'liquid' },
  { id: 's6', name: 'Glass Cleaner', nameZh: '玻璃清洁剂', unit: 'ml', currentStock: 2000, minStock: 400, costPerUnit: 0.015, category: 'liquid' },
  { id: 's7', name: 'Clay Bar', nameZh: '粘土去污', unit: 'g', currentStock: 400, minStock: 100, costPerUnit: 0.25, category: 'other' },
  { id: 's8', name: 'Rust Inhibitor', nameZh: '防锈剂', unit: 'ml', currentStock: 2000, minStock: 500, costPerUnit: 0.05, category: 'liquid' },
];

const sampleCustomers: Customer[] = [
  { id: '1', name: 'Mike Ross', phone: '5191234567', email: 'mike@example.com', address: '123 Richmond St, London ON', vehicleType: 'sedan', vehicleInfo: 'Tesla Model S - White', tags: [{ id: 't1', text: 'VIP', color: 'yellow' }, { id: 't2', text: 'Weekly', color: 'blue' }], notes: 'Prefers text over call.', totalSpent: 890, visitCount: 6, lastVisit: '2025-01-15', createdAt: '2024-08-20' },
  { id: '2', name: 'Sarah Chen', phone: '5199876543', email: 'sarah@email.com', address: '456 Oxford St W, London ON', vehicleType: 'suv', vehicleInfo: 'BMW X5 - Black', tags: [{ id: 't3', text: 'Monthly', color: 'green' }], notes: 'Has German Shepherd - needs pet hair removal.', totalSpent: 540, visitCount: 3, lastVisit: '2025-01-10', createdAt: '2024-11-05' },
  { id: '3', name: 'James Wilson', phone: '2269991234', email: 'jwilson@work.com', address: '789 Wonderland Rd, London ON', vehicleType: 'truck', vehicleInfo: 'Ford F-150 - Blue', tags: [{ id: 't4', text: 'Fleet', color: 'purple' }], notes: 'Company vehicle. Invoice to Wilson Construction.', totalSpent: 1250, visitCount: 8, lastVisit: '2025-01-18', createdAt: '2024-06-12' },
];

const sampleBookings: Booking[] = [
  { id: 'b1', customerId: '1', packageId: 'standard', addonIds: [], date: '2025-01-21', time: '14:00', status: 'confirmed', total: 120, notes: '', suppliesUsed: [{ supplyId: 's1', amount: 200 }, { supplyId: 's3', amount: 100 }] },
  { id: 'b2', customerId: '2', packageId: 'premium', addonIds: ['dogHair'], date: '2025-01-21', time: '09:00', status: 'confirmed', total: 320, notes: 'Gate code: 1234', suppliesUsed: [{ supplyId: 's1', amount: 300 }, { supplyId: 's2', amount: 50 }] },
  { id: 'b3', customerId: '3', packageId: 'express', addonIds: ['sand'], date: '2025-01-22', time: '10:00', status: 'pending', total: 115, notes: '' },
  { id: 'b4', customerId: '1', packageId: 'winter-salt', addonIds: [], date: '2025-01-23', time: '11:00', status: 'pending', total: 89, notes: '' },
  { id: 'b5', customerId: '2', packageId: 'standard', addonIds: [], date: '2025-01-15', time: '10:00', status: 'completed', total: 140, notes: '' },
  { id: 'b6', customerId: '3', packageId: 'premium', addonIds: [], date: '2025-01-14', time: '09:00', status: 'completed', total: 290, notes: '' },
  { id: 'b7', customerId: '1', packageId: 'express', addonIds: [], date: '2025-01-13', time: '15:00', status: 'completed', total: 45, notes: '' },
  { id: 'b8', customerId: '2', packageId: 'winter-rust', addonIds: [], date: '2025-01-10', time: '10:00', status: 'completed', total: 219, notes: '' },
  { id: 'b9', customerId: '3', packageId: 'standard', addonIds: ['dogHair'], date: '2025-01-08', time: '14:00', status: 'completed', total: 210, notes: '' },
  { id: 'b10', customerId: '1', packageId: 'ceramic', addonIds: [], date: '2025-01-05', time: '09:00', status: 'completed', total: 599, notes: '' },
  { id: 'b11', customerId: '2', packageId: 'premium', addonIds: [], date: '2024-12-28', time: '10:00', status: 'completed', total: 270, notes: '' },
  { id: 'b12', customerId: '3', packageId: 'winter-salt', addonIds: ['floorMats'], date: '2024-12-20', time: '11:00', status: 'completed', total: 114, notes: '' },
];

// ==================== 主组件 ====================
export default function MobileDetailingCRM() {
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [ownerTab, setOwnerTab] = useState<'calendar' | 'customers' | 'revenue' | 'supplies' | 'settings'>('calendar');
  
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [supplies, setSupplies] = useState<Supply[]>(initialSupplies);
  
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>({
    businessName: 'Ruiyu Auto Spa', businessNameZh: '瑞宇汽车美容',
    suvSurcharge: 20, truckSurcharge: 40, rainModeActive: false, winterModeActive: true, hstRate: 0.13,
  });
  
  const [weather, setWeather] = useState({ temp: 0, isRaining: false });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editingCustomerData, setEditingCustomerData] = useState<Customer | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [calendarView, setCalendarView] = useState<'day' | 'month'>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [revenueView, setRevenueView] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showAddSupply, setShowAddSupply] = useState(false);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddAddon, setShowAddAddon] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<Package>>({});
  const [newAddon, setNewAddon] = useState<Partial<Addon>>({});
  const [newSupply, setNewSupply] = useState<Partial<Supply>>({});
  const [newTagText, setNewTagText] = useState('');
  const [newTagColor, setNewTagColor] = useState('blue');
  
  const [bookingForm, setBookingForm] = useState({
    vehicleType: 'sedan' as 'sedan' | 'suv' | 'truck',
    packageId: 'standard', addonIds: [] as string[],
    name: '', phone: '', email: '', address: '', notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const t = translations[lang];
  
  // 获取天气
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=42.98&longitude=-81.24&current=temperature_2m,precipitation&timezone=America%2FNew_York')
      .then(res => res.json())
      .then((data: { current: { temperature_2m: number; precipitation: number } }) => {
        const temp = Math.round(data.current.temperature_2m);
        setWeather({ temp, isRaining: data.current.precipitation > 0 });
        if (temp < 5) setMerchantSettings(prev => ({ ...prev, winterModeActive: true }));
        if (data.current.precipitation > 0) setMerchantSettings(prev => ({ ...prev, rainModeActive: true }));
      }).catch(() => {});
  }, []);

  // ==================== 计算函数 ====================
  const calculateTotal = (pkgId: string, vehicleType: string, selectedAddons: string[]): number => {
    const pkg = packages.find(p => p.id === pkgId);
    let total = pkg?.price || 0;
    if (vehicleType === 'suv') total += merchantSettings.suvSurcharge;
    if (vehicleType === 'truck') total += merchantSettings.truckSurcharge;
    selectedAddons.forEach(addonId => { const addon = addons.find(a => a.id === addonId); if (addon) total += addon.price; });
    return total;
  };
  
  const getPackageName = (pkg: Package) => lang === 'zh' ? pkg.nameZh || pkg.name : pkg.name;
  const getPackageDesc = (pkg: Package) => lang === 'zh' ? pkg.descZh || pkg.desc : pkg.desc;
  const getAddonName = (addon: Addon) => lang === 'zh' ? addon.nameZh || addon.name : addon.name;
  const getSupplyName = (supply: Supply) => lang === 'zh' ? supply.nameZh || supply.name : supply.name;
  const getVehicleLabel = (type: string) => type === 'sedan' ? t.sedan : type === 'suv' ? t.suv : t.truck;
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  const getStatusLabel = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return t.pending;
      case 'confirmed': return t.confirmed;
      case 'completed': return t.completed;
      case 'cancelled': return t.cancelled;
      case 'no-show': return t.noShow;
      default: return status;
    }
  };

  // ==================== 收入统计 ====================
  const revenueStats = useMemo(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const today = new Date();
    
    // 按日统计
    const dailyMap = new Map<string, { revenue: number; bookings: number; cost: number }>();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today); date.setDate(date.getDate() - i);
      dailyMap.set(date.toISOString().split('T')[0], { revenue: 0, bookings: 0, cost: 0 });
    }
    completedBookings.forEach(b => {
      if (dailyMap.has(b.date)) {
        const current = dailyMap.get(b.date)!;
        current.revenue += b.total; current.bookings += 1;
        if (b.suppliesUsed) b.suppliesUsed.forEach(usage => {
          const supply = supplies.find(s => s.id === usage.supplyId);
          if (supply) current.cost += usage.amount * supply.costPerUnit;
        });
      }
    });
    const daily = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date, label: new Date(date + 'T00:00:00').toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-CA', { month: 'short', day: 'numeric' }),
      ...data, profit: data.revenue - data.cost
    }));
    
    // 按周统计
    const weeklyMap = new Map<string, { revenue: number; bookings: number; cost: number }>();
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(today); weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
      weeklyMap.set(`W${Math.ceil((weekStart.getDate()) / 7)}-${weekStart.getMonth() + 1}`, { revenue: 0, bookings: 0, cost: 0 });
    }
    completedBookings.forEach(b => {
      const bookingDate = new Date(b.date + 'T00:00:00');
      const weekKey = `W${Math.ceil((bookingDate.getDate()) / 7)}-${bookingDate.getMonth() + 1}`;
      if (weeklyMap.has(weekKey)) {
        const current = weeklyMap.get(weekKey)!;
        current.revenue += b.total; current.bookings += 1;
        if (b.suppliesUsed) b.suppliesUsed.forEach(usage => {
          const supply = supplies.find(s => s.id === usage.supplyId);
          if (supply) current.cost += usage.amount * supply.costPerUnit;
        });
      }
    });
    const weekly = Array.from(weeklyMap.entries()).map(([week, data]) => ({ week, label: week, ...data, profit: data.revenue - data.cost }));
    
    // 按月统计
    const monthlyMap = new Map<string, { revenue: number; bookings: number; cost: number }>();
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today); monthDate.setMonth(monthDate.getMonth() - i);
      monthlyMap.set(`${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`, { revenue: 0, bookings: 0, cost: 0 });
    }
    completedBookings.forEach(b => {
      const monthKey = b.date.substring(0, 7);
      if (monthlyMap.has(monthKey)) {
        const current = monthlyMap.get(monthKey)!;
        current.revenue += b.total; current.bookings += 1;
        if (b.suppliesUsed) b.suppliesUsed.forEach(usage => {
          const supply = supplies.find(s => s.id === usage.supplyId);
          if (supply) current.cost += usage.amount * supply.costPerUnit;
        });
      }
    });
    const monthNames = lang === 'zh' ? MONTHS_ZH : MONTHS_EN;
    const monthly = Array.from(monthlyMap.entries()).map(([month, data]) => {
      const m = parseInt(month.split('-')[1]);
      return { month, label: monthNames[m - 1], ...data, profit: data.revenue - data.cost };
    });
    
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.total, 0);
    const totalBookings = completedBookings.length;
    const avgPerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
    const thisMonth = new Date().toISOString().substring(0, 7);
    const lastMonthDate = new Date(); lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
    const lastMonth = lastMonthDate.toISOString().substring(0, 7);
    const thisMonthRevenue = completedBookings.filter(b => b.date.startsWith(thisMonth)).reduce((sum, b) => sum + b.total, 0);
    const lastMonthRevenue = completedBookings.filter(b => b.date.startsWith(lastMonth)).reduce((sum, b) => sum + b.total, 0);
    const monthlyChange = lastMonthRevenue > 0 ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0;
    
    return { daily, weekly, monthly, totalRevenue, totalBookings, avgPerBooking, thisMonthRevenue, monthlyChange };
  }, [bookings, supplies, lang]);

  const lowStockSupplies = useMemo(() => supplies.filter(s => s.currentStock <= s.minStock), [supplies]);

  // ==================== 日历相关 ====================
  const getBookingsForDate = (date: string) => bookings.filter(b => b.date === date).map(b => ({ ...b, customer: customers.find(c => c.id === b.customerId) })).sort((a, b) => a.time.localeCompare(b.time));
  const formatDate = (dateStr: string) => new Date(dateStr + 'T00:00:00').toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
  const navigateDate = (days: number) => { const current = new Date(selectedDate + 'T00:00:00'); current.setDate(current.getDate() + days); setSelectedDate(current.toISOString().split('T')[0]); };
  
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear(); const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); const daysInMonth = lastDay.getDate();
    const days: { date: string; day: number; isCurrentMonth: boolean; bookingCount: number }[] = [];
    for (let i = startPadding - 1; i >= 0; i--) { const d = new Date(year, month, -i); const dateStr = d.toISOString().split('T')[0]; days.push({ date: dateStr, day: d.getDate(), isCurrentMonth: false, bookingCount: bookings.filter(b => b.date === dateStr).length }); }
    for (let i = 1; i <= daysInMonth; i++) { const d = new Date(year, month, i); const dateStr = d.toISOString().split('T')[0]; days.push({ date: dateStr, day: i, isCurrentMonth: true, bookingCount: bookings.filter(b => b.date === dateStr).length }); }
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) { const d = new Date(year, month + 1, i); const dateStr = d.toISOString().split('T')[0]; days.push({ date: dateStr, day: i, isCurrentMonth: false, bookingCount: bookings.filter(b => b.date === dateStr).length }); }
    return days;
  }, [currentMonth, bookings]);

  // ==================== 发票生成 ====================
  const generateInvoice = (booking: Booking): Invoice => {
    const customer = customers.find(c => c.id === booking.customerId);
    const pkg = packages.find(p => p.id === booking.packageId);
    const items: InvoiceItem[] = [];
    if (pkg) items.push({ description: getPackageName(pkg), quantity: 1, unitPrice: pkg.price, total: pkg.price });
    if (customer?.vehicleType === 'suv') items.push({ description: lang === 'zh' ? 'SUV加价' : 'SUV Surcharge', quantity: 1, unitPrice: merchantSettings.suvSurcharge, total: merchantSettings.suvSurcharge });
    else if (customer?.vehicleType === 'truck') items.push({ description: lang === 'zh' ? '皮卡加价' : 'Truck Surcharge', quantity: 1, unitPrice: merchantSettings.truckSurcharge, total: merchantSettings.truckSurcharge });
    booking.addonIds.forEach(addonId => { const addon = addons.find(a => a.id === addonId); if (addon) items.push({ description: getAddonName(addon), quantity: 1, unitPrice: addon.price, total: addon.price }); });
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const hst = Math.round(subtotal * merchantSettings.hstRate * 100) / 100;
    return { id: `INV-${Date.now()}`, bookingId: booking.id, customerId: booking.customerId, date: new Date().toISOString().split('T')[0], items, subtotal, hst, total: subtotal + hst, status: 'draft' };
  };

  // ==================== 处理函数 ====================
  const handleBookingSubmit = () => {
    if (!bookingForm.name.trim()) { alert(t.valName); return; }
    if (!/^\d{10,11}$/.test(bookingForm.phone.replace(/\D/g, ''))) { alert(t.valPhone); return; }
    setIsSubmitting(true);
    setTimeout(() => {
      let customer = customers.find(c => c.phone.replace(/\D/g, '') === bookingForm.phone.replace(/\D/g, ''));
      if (!customer) {
        customer = { id: Date.now().toString(), name: bookingForm.name, phone: bookingForm.phone, email: bookingForm.email, address: bookingForm.address, vehicleType: bookingForm.vehicleType, vehicleInfo: '', tags: [], notes: '', totalSpent: 0, visitCount: 0, lastVisit: null, createdAt: new Date().toISOString().split('T')[0] };
        setCustomers(prev => [...prev, customer!]);
      }
      const total = calculateTotal(bookingForm.packageId, bookingForm.vehicleType, bookingForm.addonIds);
      const newBooking: Booking = { id: 'b' + Date.now(), customerId: customer.id, packageId: bookingForm.packageId, addonIds: bookingForm.addonIds, date: new Date().toISOString().split('T')[0], time: '10:00', status: 'pending', total, notes: bookingForm.notes };
      setBookings(prev => [...prev, newBooking]);
      setIsSubmitting(false);
      alert(`${t.bookingSuccess}\n${t.total}: $${total}`);
      setBookingForm({ vehicleType: 'sedan', packageId: 'standard', addonIds: [], name: '', phone: '', email: '', address: '', notes: '' });
    }, 1000);
  };
  
  const toggleAddon = (addonId: string) => setBookingForm(prev => ({ ...prev, addonIds: prev.addonIds.includes(addonId) ? prev.addonIds.filter(id => id !== addonId) : [...prev.addonIds, addonId] }));
  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(customerSearch.toLowerCase()) || c.phone.includes(customerSearch) || c.email.toLowerCase().includes(customerSearch.toLowerCase()));
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const handleSaveCustomer = () => { if (!editingCustomerData) return; setCustomers(prev => prev.map(c => c.id === editingCustomerData.id ? editingCustomerData : c)); setIsEditingCustomer(false); setEditingCustomerData(null); };
  const handleDeleteCustomer = (customerId: string) => { if (confirm('Delete?')) { setCustomers(prev => prev.filter(c => c.id !== customerId)); setSelectedCustomerId(null); } };
  const handleAddTag = (customerId: string) => { if (!newTagText.trim()) return; setCustomers(prev => prev.map(c => c.id !== customerId ? c : { ...c, tags: [...c.tags, { id: Date.now().toString(), text: newTagText, color: newTagColor }] })); setNewTagText(''); };
  const handleRemoveTag = (customerId: string, tagId: string) => setCustomers(prev => prev.map(c => c.id !== customerId ? c : { ...c, tags: c.tags.filter(tag => tag.id !== tagId) }));
  const handleRestockSupply = (supplyId: string, amount: number) => setSupplies(prev => prev.map(s => s.id === supplyId ? { ...s, currentStock: s.currentStock + amount } : s));
  const handleAddSupply = () => { if (!newSupply.name) return; const supply: Supply = { id: 's' + Date.now(), name: newSupply.name || '', nameZh: newSupply.nameZh || '', unit: newSupply.unit || 'ml', currentStock: newSupply.currentStock || 0, minStock: newSupply.minStock || 100, costPerUnit: newSupply.costPerUnit || 0, category: newSupply.category || 'liquid' }; setSupplies(prev => [...prev, supply]); setNewSupply({}); setShowAddSupply(false); };
  const handleAddPackage = () => { if (!newPackage.name) return; const pkg: Package = { id: 'pkg_' + Date.now(), name: newPackage.name || '', nameZh: newPackage.nameZh || '', price: newPackage.price || 0, desc: newPackage.desc || '', descZh: newPackage.descZh || '', duration: newPackage.duration || 60, active: true, seasonal: newPackage.seasonal || 'all' }; setPackages(prev => [...prev, pkg]); setNewPackage({}); setShowAddPackage(false); };
  const handleDeletePackage = (pkgId: string) => { if (confirm('Delete?')) setPackages(prev => prev.filter(p => p.id !== pkgId)); };
  const handleAddAddon = () => { if (!newAddon.name) return; const addon: Addon = { id: 'addon_' + Date.now(), name: newAddon.name || '', nameZh: newAddon.nameZh || '', price: newAddon.price || 0, active: true, seasonal: newAddon.seasonal || 'all' }; setAddons(prev => [...prev, addon]); setNewAddon({}); setShowAddAddon(false); };
  const handleDeleteAddon = (addonId: string) => { if (confirm('Delete?')) setAddons(prev => prev.filter(a => a.id !== addonId)); };
  
  const getSeasonalPackages = () => packages.filter(p => { if (!p.active) return false; if (p.seasonal === 'all') return true; if (merchantSettings.winterModeActive && p.seasonal === 'winter') return true; if (!merchantSettings.winterModeActive && p.seasonal === 'summer') return true; return false; });
  const getSeasonalAddons = () => addons.filter(a => { if (!a.active) return false; if (a.seasonal === 'all') return true; if (merchantSettings.winterModeActive && a.seasonal === 'winter') return true; if (!merchantSettings.winterModeActive && a.seasonal === 'summer') return true; return false; });

  // ==================== 渲染: 导航栏 ====================
  const renderNav = () => (
    <nav className="bg-white px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="font-black text-lg tracking-tight text-blue-700">{lang === 'zh' ? merchantSettings.businessNameZh : merchantSettings.businessName}</div>
      <div className="flex gap-2 items-center">
        {merchantSettings.winterModeActive && <div className="flex items-center gap-1 text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full"><Snowflake className="w-3 h-3" /></div>}
        {(['en', 'zh'] as const).map((l) => <button key={l} onClick={() => setLang(l)} className={`text-xs font-bold px-2 py-1 rounded transition-colors ${lang === l ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}>{l.toUpperCase()}</button>)}
        {isOwnerMode ? <button onClick={() => { setIsOwnerMode(false); setSelectedCustomerId(null); }} className="ml-2 text-xs text-red-500 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50">{t.logout}</button> : <button onClick={() => setShowLogin(true)} className="ml-2 text-gray-400 hover:text-gray-600"><Lock className="w-4 h-4" /></button>}
      </div>
    </nav>
  );

  // ==================== 渲染: 商家后台导航 ====================
  const renderOwnerNav = () => (
    <div className="bg-white border-b border-gray-200 px-2 overflow-x-auto">
      <div className="max-w-md mx-auto flex min-w-max">
        {[{ key: 'calendar', icon: Calendar, label: t.calendar }, { key: 'customers', icon: Users, label: t.customers }, { key: 'revenue', icon: BarChart3, label: t.revenue }, { key: 'supplies', icon: Package, label: t.supplies }, { key: 'settings', icon: Settings, label: t.settings }].map(({ key, icon: Icon, label }) => (
          <button key={key} onClick={() => { setOwnerTab(key as typeof ownerTab); setSelectedCustomerId(null); }} className={`flex-1 min-w-[60px] py-3 flex flex-col items-center gap-1 text-[10px] font-medium transition-colors border-b-2 ${ownerTab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}><Icon className="w-5 h-5" />{label}</button>
        ))}
      </div>
    </div>
  );

  // ==================== 渲染: 登录弹窗 ====================
  const renderLogin = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">{t.ownerLogin}</h2>
        <div className="flex justify-center mb-4"><div className="bg-gray-100 p-3 rounded-full"><Lock className="w-6 h-6 text-gray-400" /></div></div>
        <input type="password" placeholder={t.loginPin} className="w-full text-center text-2xl tracking-widest p-3 bg-gray-50 rounded-xl border mb-4 focus:ring-2 focus:ring-blue-500 outline-none" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && pinInput === '8888') { setIsOwnerMode(true); setShowLogin(false); setPinInput(''); } }} />
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { setShowLogin(false); setPinInput(''); }} className="p-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button onClick={() => { if (pinInput === '8888') { setIsOwnerMode(true); setShowLogin(false); setPinInput(''); } else { alert('Demo PIN: 8888'); } }} className="p-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">{t.login}</button>
        </div>
      </div>
    </div>
  );

  // ==================== 渲染: 客户端预约界面 ====================
  const renderCustomerBooking = () => {
    const activePackages = getSeasonalPackages(); const activeAddons = getSeasonalAddons();
    const total = calculateTotal(bookingForm.packageId, bookingForm.vehicleType, bookingForm.addonIds);
    return (
      <div className="space-y-4 pb-28">
        {merchantSettings.winterModeActive && (
          <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 flex items-start gap-3">
            <Snowflake className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
            <div><div className="font-medium text-cyan-800">{lang === 'zh' ? '冬季服务模式' : 'Winter Mode'}</div><div className="text-sm text-cyan-700">{lang === 'zh' ? '推荐盐渍清理和底盘防锈服务' : 'Salt removal & rust protection recommended'}</div></div>
          </div>
        )}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.vehicleType}</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['sedan', 'suv', 'truck'] as const).map((type) => { const Icon = VEHICLE_ICONS[type]; const surcharge = type === 'suv' ? merchantSettings.suvSurcharge : type === 'truck' ? merchantSettings.truckSurcharge : 0; return (
              <button key={type} onClick={() => setBookingForm(prev => ({ ...prev, vehicleType: type }))} className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${bookingForm.vehicleType === type ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}><Icon className="w-6 h-6 mb-1" /><span className="text-[10px] font-bold text-center leading-tight">{getVehicleLabel(type)}</span>{surcharge > 0 && <span className="text-[9px] text-gray-400 mt-1">+${surcharge}</span>}</button>
            ); })}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.packages}</h2>
          {merchantSettings.winterModeActive && activePackages.filter(p => p.seasonal === 'winter').length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2"><Snowflake className="w-4 h-4 text-cyan-500" /><span className="text-xs font-bold text-cyan-700">{t.winterPackages}</span></div>
              <div className="space-y-2">{activePackages.filter(p => p.seasonal === 'winter').map(pkg => (
                <div key={pkg.id} onClick={() => setBookingForm(prev => ({ ...prev, packageId: pkg.id }))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingForm.packageId === pkg.id ? 'border-cyan-500 bg-cyan-50' : 'border-cyan-100 hover:border-cyan-200 bg-cyan-50/30'}`}>
                  <div className="flex justify-between items-center mb-1"><span className={`font-bold ${bookingForm.packageId === pkg.id ? 'text-cyan-900' : 'text-gray-900'}`}>{getPackageName(pkg)}</span><span className="font-black text-lg">${pkg.price}</span></div>
                  <p className="text-xs text-gray-500">{getPackageDesc(pkg)}</p><div className="flex items-center gap-1 mt-2 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{pkg.duration} min</span></div>
                </div>
              ))}</div>
            </div>
          )}
          <div className="space-y-2">{activePackages.filter(p => p.seasonal === 'all').map(pkg => (
            <div key={pkg.id} onClick={() => setBookingForm(prev => ({ ...prev, packageId: pkg.id }))} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${bookingForm.packageId === pkg.id ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-blue-200'}`}>
              <div className="flex justify-between items-center mb-1"><span className={`font-bold ${bookingForm.packageId === pkg.id ? 'text-blue-900' : 'text-gray-900'}`}>{getPackageName(pkg)}</span><span className="font-black text-lg">${pkg.price}</span></div>
              <p className="text-xs text-gray-500">{getPackageDesc(pkg)}</p><div className="flex items-center gap-1 mt-2 text-xs text-gray-400"><Clock className="w-3 h-3" /><span>{pkg.duration} min</span></div>
            </div>
          ))}</div>
        </div>
        {activeAddons.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.addons}</h2>
            <div className="space-y-2">{activeAddons.map(addon => (
              <label key={addon.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${addon.seasonal === 'winter' ? 'bg-cyan-50/50 border-cyan-100 hover:bg-cyan-100/50' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}>
                <div className="flex items-center gap-3"><input type="checkbox" checked={bookingForm.addonIds.includes(addon.id)} onChange={() => toggleAddon(addon.id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" /><span className="font-medium text-gray-700">{getAddonName(addon)}</span>{addon.seasonal === 'winter' && <Snowflake className="w-3 h-3 text-cyan-500" />}</div>
                <span className="text-sm font-bold text-gray-500">+${addon.price}</span>
              </label>
            ))}</div>
          </div>
        )}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.contact}</h2>
          <input type="text" placeholder={t.name} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" value={bookingForm.name} onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))} />
          <input type="tel" placeholder={t.phone} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" value={bookingForm.phone} onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))} />
          <input type="email" placeholder={t.email} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" value={bookingForm.email} onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))} />
          <input type="text" placeholder={t.address} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" value={bookingForm.address} onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))} />
          <textarea placeholder={t.notes} rows={2} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500" value={bookingForm.notes} onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))} />
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div><div className="text-xs text-gray-500 font-medium">{t.total}</div><div className="text-2xl font-black text-gray-900">${total}</div></div>
            <button onClick={handleBookingSubmit} disabled={isSubmitting} className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:bg-gray-400">{isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><DollarSign className="w-4 h-4" />{t.pay}</>}</button>
          </div>
        </div>
      </div>
    );
  };

  // ==================== 渲染: 月历 ====================
  const renderMonthCalendar = () => {
    const todayStr = new Date().toISOString().split('T')[0]; const monthNames = lang === 'zh' ? MONTHS_ZH : MONTHS_EN; const weekdayNames = lang === 'zh' ? WEEKDAYS_ZH : WEEKDAYS_EN;
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-center"><div className="font-bold text-lg">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</div></div>
          <button onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 border-b border-gray-100">{weekdayNames.map((day, i) => <div key={i} className="p-2 text-center text-xs font-medium text-gray-500">{day}</div>)}</div>
        <div className="grid grid-cols-7">{calendarDays.map((day, i) => { const isToday = day.date === todayStr; const isSelected = day.date === selectedDate; return (
          <button key={i} onClick={() => { setSelectedDate(day.date); setCalendarView('day'); }} className={`p-2 h-14 flex flex-col items-center justify-start border-b border-r border-gray-50 transition-colors ${!day.isCurrentMonth ? 'text-gray-300' : ''} ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
            <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : isSelected ? 'bg-blue-100 text-blue-700' : ''}`}>{day.day}</span>
            {day.bookingCount > 0 && <div className="flex gap-0.5 mt-1">{[...Array(Math.min(day.bookingCount, 3))].map((_, j) => <div key={j} className="w-1.5 h-1.5 rounded-full bg-blue-500" />)}{day.bookingCount > 3 && <span className="text-[8px] text-blue-500">+{day.bookingCount - 3}</span>}</div>}
          </button>
        ); })}</div>
      </div>
    );
  };

  // ==================== 渲染: 日历视图 ====================
  const renderCalendar = () => {
    const todayBookings = getBookingsForDate(selectedDate); const isToday = selectedDate === new Date().toISOString().split('T')[0];
    return (
      <div className="space-y-4">
        <div className={`p-4 rounded-xl text-white shadow-lg ${merchantSettings.winterModeActive ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' : merchantSettings.rainModeActive ? 'bg-gradient-to-br from-gray-500 to-gray-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">{merchantSettings.winterModeActive ? <Snowflake className="w-5 h-5" /> : merchantSettings.rainModeActive ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}<span className="font-medium">{weather.temp}°C London, ON</span></div>
            <button onClick={() => setMerchantSettings(prev => ({ ...prev, winterModeActive: !prev.winterModeActive }))} className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${merchantSettings.winterModeActive ? 'bg-white text-cyan-600' : 'bg-white/20 text-white'}`}><Snowflake className="w-3 h-3 inline mr-1" />{merchantSettings.winterModeActive ? 'ON' : 'OFF'}</button>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">{[{ key: 'month', label: t.monthView, icon: CalendarRange }, { key: 'day', label: t.dayView, icon: CalendarDays }].map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setCalendarView(key as 'month' | 'day')} className={`flex-1 py-2 px-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors ${calendarView === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><Icon className="w-4 h-4" />{label}</button>)}</div>
        {calendarView === 'month' && renderMonthCalendar()}
        {calendarView === 'day' && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => navigateDate(-1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
              <div className="text-center"><div className="font-bold text-lg">{formatDate(selectedDate)}</div>{isToday && <div className="text-xs text-blue-600 font-medium">{t.today}</div>}</div>
              <button onClick={() => navigateDate(1)} className="p-2 hover:bg-gray-100 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
            </div>
            {todayBookings.length === 0 ? <div className="text-center py-8 text-gray-400"><Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" /><div>{t.noBookings}</div></div> : (
              <div className="space-y-3">{todayBookings.map(booking => { const pkg = packages.find(p => p.id === booking.packageId); const VehicleIcon = booking.customer?.vehicleType ? VEHICLE_ICONS[booking.customer.vehicleType] : Car; return (
                <div key={booking.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if (booking.customer) { setSelectedCustomerId(booking.customer.id); setOwnerTab('customers'); } }}>
                      <div className="bg-blue-100 p-2 rounded-lg"><VehicleIcon className="w-4 h-4 text-blue-600" /></div>
                      <div><div className="font-bold">{booking.customer?.name || 'Unknown'}</div><div className="text-xs text-gray-500">{booking.customer?.vehicleInfo}</div></div>
                    </div>
                    <div className="text-right"><div className="font-bold text-lg">{booking.time}</div><div className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</div></div>
                  </div>
                  <div className="flex items-center justify-between text-sm"><span className="text-gray-600">{pkg ? getPackageName(pkg) : booking.packageId}</span><span className="font-bold">${booking.total}</span></div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button onClick={() => { const invoice = generateInvoice(booking); setSelectedInvoice(invoice); setShowInvoicePreview(true); }} className="flex-1 text-xs font-medium text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center gap-1"><Receipt className="w-3 h-3" />{t.generateInvoice}</button>
                  </div>
                </div>
              ); })}</div>
            )}
          </div>
        )}
        {lowStockSupplies.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-500" /><span className="font-bold text-red-700">{t.lowStock}</span></div>
            <div className="space-y-2">{lowStockSupplies.map(supply => <div key={supply.id} className="flex items-center justify-between text-sm"><span className="text-red-700">{getSupplyName(supply)}</span><span className="text-red-600 font-medium">{supply.currentStock} / {supply.minStock} {supply.unit}</span></div>)}</div>
          </div>
        )}
      </div>
    );
  };

  // ==================== 渲染: 收入看板 (修复版) ====================
  const renderRevenue = () => {
    const chartData = revenueView === 'daily' ? revenueStats.daily : revenueView === 'weekly' ? revenueStats.weekly : revenueStats.monthly;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 opacity-80" /><span className="text-xs opacity-80">{lang === 'zh' ? '本月' : 'This Month'}</span></div>
            <div className="text-2xl font-black">${revenueStats.thisMonthRevenue}</div>
            <div className={`text-xs mt-1 flex items-center gap-1 ${revenueStats.monthlyChange >= 0 ? 'text-green-200' : 'text-red-200'}`}>{revenueStats.monthlyChange >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{revenueStats.monthlyChange >= 0 ? '+' : ''}{revenueStats.monthlyChange}% {t.vsLastPeriod}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white">
            <div className="flex items-center gap-2 mb-1"><BarChart3 className="w-4 h-4 opacity-80" /><span className="text-xs opacity-80">{t.avgPerBooking}</span></div>
            <div className="text-2xl font-black">${revenueStats.avgPerBooking}</div>
            <div className="text-xs mt-1 text-blue-200">{revenueStats.totalBookings} {t.bookingsCount}</div>
          </div>
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">{[{ key: 'daily', label: t.dailyRevenue }, { key: 'weekly', label: t.weeklyRevenue }, { key: 'monthly', label: t.monthlyRevenue }].map(({ key, label }) => <button key={key} onClick={() => setRevenueView(key as typeof revenueView)} className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-colors ${revenueView === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{label}</button>)}</div>
        
        {/* 修复了 Tooltip 类型报错 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} /><YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} tickFormatter={(value) => `$${value}`} />
        <Tooltip 
          formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name === 'revenue' ? t.revenue : name === 'profit' ? t.profit : t.cost]} 
          contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} 
        />
        <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} name={t.revenue} /><Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name={t.profit} /></BarChart></ResponsiveContainer></div></div>
        
        {/* 修复了 PieChart Tooltip 类型报错 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><PieChart className="w-4 h-4 text-purple-500" />{t.profit} & {t.cost}</h3>
          <div className="h-48"><ResponsiveContainer width="100%" height="100%"><RechartsPie><Pie data={[{ name: t.profit, value: revenueStats.totalRevenue * 0.65, color: '#10b981' }, { name: t.cost, value: revenueStats.totalRevenue * 0.35, color: '#f59e0b' }]} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value"><Cell fill="#10b981" /><Cell fill="#f59e0b" /></Pie>
          <Tooltip 
            formatter={(value: any) => [`$${Number(value).toFixed(0)}`, '']} 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} 
          />
          <Legend verticalAlign="bottom" height={36} formatter={(value) => <span className="text-xs text-gray-600">{value}</span>} /></RechartsPie></ResponsiveContainer></div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500">{t.totalRevenue}</div><div className="font-bold text-gray-900">${revenueStats.totalRevenue}</div></div>
            <div className="text-center p-2 bg-green-50 rounded-lg"><div className="text-xs text-green-600">{t.profit}</div><div className="font-bold text-green-700">${Math.round(revenueStats.totalRevenue * 0.65)}</div></div>
            <div className="text-center p-2 bg-amber-50 rounded-lg"><div className="text-xs text-amber-600">{t.margin}</div><div className="font-bold text-amber-700">65%</div></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-blue-500" />{t.bookingsCount} {lang === 'zh' ? '趋势' : 'Trend'}</h3>
          <div className="h-40"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}><defs><linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} /><YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={{ stroke: '#e5e7eb' }} /><Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} /><Area type="monotone" dataKey="bookings" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorBookings)" /></AreaChart></ResponsiveContainer></div>
        </div>
      </div>
    );
  };

  // ==================== 渲染: 耗材管理 ====================
  const renderSupplies = () => (
    <div className="space-y-4">
      {lowStockSupplies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle className="w-5 h-5 text-red-500" /><span className="font-bold text-red-700">{t.lowStock}</span></div>
          <div className="space-y-2">{lowStockSupplies.map(supply => (
            <div key={supply.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
              <div><div className="font-medium text-red-800">{getSupplyName(supply)}</div><div className="text-xs text-red-600">{supply.currentStock} / {supply.minStock} {supply.unit}</div></div>
              <button onClick={() => handleRestockSupply(supply.id, supply.minStock * 2)} className="text-xs font-medium text-white bg-red-500 px-3 py-1.5 rounded-lg hover:bg-red-600">{t.restock}</button>
            </div>
          ))}</div>
        </div>
      )}
      <div className="flex justify-between items-center"><h3 className="font-bold text-gray-800 flex items-center gap-2"><Package className="w-4 h-4 text-purple-500" />{t.supplies}</h3><button onClick={() => setShowAddSupply(true)} className="text-sm font-medium text-blue-600 flex items-center gap-1 hover:text-blue-700"><Plus className="w-4 h-4" />{t.addSupply}</button></div>
      <div className="space-y-3">{supplies.map(supply => { const stockPercentage = (supply.currentStock / (supply.minStock * 3)) * 100; const isLow = supply.currentStock <= supply.minStock; return (
        <div key={supply.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between mb-3"><div><div className="font-bold text-gray-900">{getSupplyName(supply)}</div><div className="text-xs text-gray-500">${supply.costPerUnit.toFixed(3)} / {supply.unit}</div></div><div className={`px-2 py-1 rounded text-xs font-medium ${supply.category === 'liquid' ? 'bg-blue-100 text-blue-700' : supply.category === 'wax' ? 'bg-yellow-100 text-yellow-700' : supply.category === 'cloth' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{supply.category}</div></div>
          <div className="mb-2"><div className="flex justify-between text-xs mb-1"><span className={isLow ? 'text-red-600 font-medium' : 'text-gray-500'}>{supply.currentStock} {supply.unit}</span><span className="text-gray-400">{lang === 'zh' ? '最低' : 'Min'}: {supply.minStock}</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${isLow ? 'bg-red-500' : stockPercentage < 50 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(stockPercentage, 100)}%` }} /></div></div>
          <div className="flex gap-2"><button onClick={() => { const amount = prompt(`${lang === 'zh' ? '补货数量' : 'Restock amount'}:`, '1000'); if (amount) handleRestockSupply(supply.id, parseInt(amount)); }} className="flex-1 text-xs font-medium text-purple-600 bg-purple-50 py-2 rounded-lg hover:bg-purple-100 flex items-center justify-center gap-1"><Plus className="w-3 h-3" />{t.restock}</button><button onClick={() => { const amount = prompt(`${lang === 'zh' ? '使用数量' : 'Use amount'}:`, '100'); if (amount) setSupplies(prev => prev.map(s => s.id === supply.id ? { ...s, currentStock: Math.max(0, s.currentStock - parseInt(amount)) } : s)); }} className="flex-1 text-xs font-medium text-gray-600 bg-gray-50 py-2 rounded-lg hover:bg-gray-100 flex items-center justify-center gap-1"><Minus className="w-3 h-3" />{lang === 'zh' ? '使用' : 'Use'}</button></div>
        </div>
      ); })}</div>
      {showAddSupply && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm"><h3 className="font-bold text-lg mb-4">{t.addSupply}</h3><div className="space-y-3"><input type="text" placeholder="Name (EN)" className="w-full p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.name || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, name: e.target.value }))} /><input type="text" placeholder="名称 (中文)" className="w-full p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.nameZh || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, nameZh: e.target.value }))} /><div className="grid grid-cols-2 gap-3"><input type="text" placeholder="Unit" className="p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.unit || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, unit: e.target.value }))} /><input type="number" placeholder="Cost/Unit" step="0.001" className="p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.costPerUnit || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, costPerUnit: parseFloat(e.target.value) }))} /></div><div className="grid grid-cols-2 gap-3"><input type="number" placeholder={t.currentStock} className="p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.currentStock || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, currentStock: parseInt(e.target.value) }))} /><input type="number" placeholder={t.minStock} className="p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.minStock || ''} onChange={(e) => setNewSupply(prev => ({ ...prev, minStock: parseInt(e.target.value) }))} /></div><select className="w-full p-3 bg-gray-50 rounded-xl border focus:border-blue-500 outline-none" value={newSupply.category || 'liquid'} onChange={(e) => setNewSupply(prev => ({ ...prev, category: e.target.value as Supply['category'] }))}><option value="liquid">Liquid</option><option value="wax">Wax</option><option value="cloth">Cloth</option><option value="other">Other</option></select></div><div className="flex gap-3 mt-4"><button onClick={() => { setShowAddSupply(false); setNewSupply({}); }} className="flex-1 p-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200">Cancel</button><button onClick={handleAddSupply} className="flex-1 p-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700">Add</button></div></div></div>
      )}
    </div>
  );

  // ==================== 渲染: 发票预览 ====================
  const renderInvoicePreview = () => {
    if (!selectedInvoice) return null; const customer = customers.find(c => c.id === selectedInvoice.customerId);
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-100"><div className="flex justify-between items-start mb-4"><div><div className="font-black text-xl text-blue-700">{lang === 'zh' ? merchantSettings.businessNameZh : merchantSettings.businessName}</div><div className="text-xs text-gray-500 mt-1">London, Ontario, Canada</div></div><button onClick={() => { setShowInvoicePreview(false); setSelectedInvoice(null); }} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button></div><div className="flex justify-between text-sm"><div><div className="text-gray-500">{t.invoiceNumber}</div><div className="font-mono font-bold">{selectedInvoice.id}</div></div><div className="text-right"><div className="text-gray-500">Date</div><div className="font-medium">{selectedInvoice.date}</div></div></div></div>
        <div className="p-6 border-b border-gray-100 bg-gray-50"><div className="text-xs text-gray-500 mb-1">{lang === 'zh' ? '客户' : 'Bill To'}</div><div className="font-bold">{customer?.name}</div><div className="text-sm text-gray-600">{customer?.address}</div><div className="text-sm text-gray-600">{customer?.phone}</div></div>
        <div className="p-6"><table className="w-full text-sm"><thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 font-medium">{lang === 'zh' ? '项目' : 'Item'}</th><th className="text-right py-2 text-gray-500 font-medium">{lang === 'zh' ? '金额' : 'Amount'}</th></tr></thead><tbody>{selectedInvoice.items.map((item, i) => <tr key={i} className="border-b border-gray-100"><td className="py-3">{item.description}</td><td className="py-3 text-right font-medium">${item.total.toFixed(2)}</td></tr>)}</tbody></table><div className="mt-4 pt-4 border-t border-gray-200 space-y-2"><div className="flex justify-between text-sm"><span className="text-gray-500">{t.subtotal}</span><span>${selectedInvoice.subtotal.toFixed(2)}</span></div><div className="flex justify-between text-sm"><span className="text-gray-500">{t.hst}</span><span>${selectedInvoice.hst.toFixed(2)}</span></div><div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200"><span>{t.total}</span><span className="text-blue-600">${selectedInvoice.total.toFixed(2)}</span></div></div></div>
        <div className="p-6 border-t border-gray-100 flex gap-3"><button onClick={() => { alert(lang === 'zh' ? '发票PDF生成中...\n实际部署时会使用jsPDF生成真实PDF' : 'Generating PDF...\nIn production, jsPDF would generate a real PDF'); }} className="flex-1 py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center justify-center gap-2"><Download className="w-4 h-4" />{t.downloadPdf}</button><button onClick={() => { alert(lang === 'zh' ? '发票已发送！' : 'Invoice sent!'); setShowInvoicePreview(false); setSelectedInvoice(null); }} className="flex-1 py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"><Mail className="w-4 h-4" />{t.sendInvoice}</button></div>
      </div></div>
    );
  };

  // ==================== 渲染: 客户列表 ====================
  const renderCustomerList = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"><div className="flex gap-2"><div className="flex-1 relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder={t.searchCustomers} className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} /></div><button onClick={() => { const newCustomer: Customer = { id: Date.now().toString(), name: '', phone: '', email: '', address: '', vehicleType: 'sedan', vehicleInfo: '', tags: [], notes: '', totalSpent: 0, visitCount: 0, lastVisit: null, createdAt: new Date().toISOString().split('T')[0] }; setCustomers(prev => [newCustomer, ...prev]); setSelectedCustomerId(newCustomer.id); setIsEditingCustomer(true); setEditingCustomerData(newCustomer); }} className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-blue-700"><Plus className="w-4 h-4" /></button></div></div>
      {filteredCustomers.length === 0 ? <div className="text-center py-12 text-gray-400"><Users className="w-10 h-10 mx-auto mb-2 opacity-50" /><div>{t.noCustomers}</div></div> : (
        <div className="space-y-2">{filteredCustomers.map(customer => { const VehicleIcon = VEHICLE_ICONS[customer.vehicleType]; return (
          <div key={customer.id} onClick={() => setSelectedCustomerId(customer.id)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors">
            <div className="flex items-start gap-3"><div className="bg-gray-100 p-2 rounded-lg"><VehicleIcon className="w-5 h-5 text-gray-600" /></div><div className="flex-1 min-w-0"><div className="flex items-center gap-2"><span className="font-bold text-gray-900 truncate">{customer.name || 'New'}</span>{customer.tags.length > 0 && <div className="flex gap-1">{customer.tags.slice(0, 2).map(tag => { const colors = TAG_COLORS[tag.color] || TAG_COLORS.blue; return <span key={tag.id} className={`${colors.bg} ${colors.text} px-1.5 py-0.5 rounded text-[9px] font-bold`}>{tag.text}</span>; })}</div>}</div><div className="text-sm text-gray-500 truncate">{customer.vehicleInfo || getVehicleLabel(customer.vehicleType)}</div><div className="flex items-center gap-4 mt-1 text-xs text-gray-400"><span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />${customer.totalSpent}</span><span className="flex items-center gap-1"><Star className="w-3 h-3" />{customer.visitCount}</span></div></div><ChevronRight className="w-5 h-5 text-gray-300" /></div>
          </div>
        ); })}</div>
      )}
    </div>
  );

  // ==================== 渲染: 客户详情 ====================
  const renderCustomerDetail = () => {
    if (!selectedCustomer) return null; const customer = isEditingCustomer && editingCustomerData ? editingCustomerData : selectedCustomer; const VehicleIcon = VEHICLE_ICONS[customer.vehicleType]; const customerBookings = bookings.filter(b => b.customerId === customer.id);
    return (
      <div className="space-y-4">
        <button onClick={() => { setSelectedCustomerId(null); setIsEditingCustomer(false); setEditingCustomerData(null); }} className="flex items-center gap-1 text-gray-500 hover:text-gray-700"><ChevronLeft className="w-4 h-4" /><span className="text-sm font-medium">{t.customers}</span></button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><div className="bg-white/20 p-2 rounded-lg"><VehicleIcon className="w-6 h-6" /></div>{isEditingCustomer ? <input type="text" value={editingCustomerData?.name || ''} onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, name: e.target.value } : null)} className="bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:outline-none" placeholder={t.name} /> : <span className="font-bold text-xl">{customer.name}</span>}</div>{!isEditingCustomer ? <button onClick={() => { setIsEditingCustomer(true); setEditingCustomerData({ ...customer }); }} className="bg-white/20 p-2 rounded-lg hover:bg-white/30"><Edit2 className="w-4 h-4" /></button> : <div className="flex gap-2"><button onClick={() => { setIsEditingCustomer(false); setEditingCustomerData(null); }} className="bg-white/20 p-2 rounded-lg hover:bg-white/30"><X className="w-4 h-4" /></button><button onClick={handleSaveCustomer} className="bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50"><Save className="w-4 h-4" /></button></div>}</div>
            <div className="grid grid-cols-3 gap-2 text-center"><div className="bg-white/10 rounded-lg p-2"><div className="text-lg font-bold">${customer.totalSpent}</div><div className="text-[10px] opacity-80">{t.totalSpent}</div></div><div className="bg-white/10 rounded-lg p-2"><div className="text-lg font-bold">{customer.visitCount}</div><div className="text-[10px] opacity-80">{t.visits}</div></div><div className="bg-white/10 rounded-lg p-2"><div className="text-sm font-bold">{customer.lastVisit || '-'}</div><div className="text-[10px] opacity-80">{t.lastVisit}</div></div></div>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2"><div className="flex items-center gap-3"><Phone className="w-4 h-4 text-gray-400" />{isEditingCustomer ? <input type="tel" value={editingCustomerData?.phone || ''} onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, phone: e.target.value } : null)} className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t.phone} /> : <span className="text-gray-700">{customer.phone || '-'}</span>}</div><div className="flex items-center gap-3"><Mail className="w-4 h-4 text-gray-400" />{isEditingCustomer ? <input type="email" value={editingCustomerData?.email || ''} onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, email: e.target.value } : null)} className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t.email} /> : <span className="text-gray-700">{customer.email || '-'}</span>}</div><div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-gray-400" />{isEditingCustomer ? <input type="text" value={editingCustomerData?.address || ''} onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, address: e.target.value } : null)} className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={t.address} /> : <span className="text-gray-700">{customer.address || '-'}</span>}</div></div>
            <div><div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><Tag className="w-3 h-3" />{t.customerTags}</div><div className="flex flex-wrap gap-2 mb-3">{customer.tags.map(tag => { const colors = TAG_COLORS[tag.color] || TAG_COLORS.blue; return <span key={tag.id} className={`${colors.bg} ${colors.text} ${colors.border} border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>{tag.text}<button onClick={() => handleRemoveTag(customer.id, tag.id)} className="hover:opacity-50 ml-1"><X className="w-3 h-3" /></button></span>; })}</div><div className="space-y-2 pt-2 border-t border-gray-100"><div className="flex gap-2">{Object.keys(TAG_COLORS).map(color => <button key={color} onClick={() => setNewTagColor(color)} className={`w-6 h-6 rounded-full border-2 transition-transform ${newTagColor === color ? 'border-gray-900 scale-110' : 'border-transparent'}`} style={{ backgroundColor: color === 'yellow' ? '#fef08a' : color === 'red' ? '#fecaca' : color === 'green' ? '#bbf7d0' : color === 'purple' ? '#e9d5ff' : '#bfdbfe' }} />)}</div><div className="flex gap-2"><input type="text" placeholder={t.addTag} className="flex-1 p-2 bg-gray-50 rounded-lg text-sm outline-none border focus:border-blue-500" value={newTagText} onChange={(e) => setNewTagText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddTag(customer.id); }} /><button onClick={() => handleAddTag(customer.id)} className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"><Plus className="w-4 h-4" /></button></div></div></div>
            <div><div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2"><FileText className="w-3 h-3" />{t.internalNotes}</div>{isEditingCustomer ? <textarea value={editingCustomerData?.notes || ''} onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, notes: e.target.value } : null)} className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" rows={3} placeholder={t.notes} /> : <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 min-h-[60px]">{customer.notes || '-'}</div>}</div>
          </div>
          {isEditingCustomer && <div className="px-4 pb-4"><button onClick={() => handleDeleteCustomer(customer.id)} className="w-full p-3 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" />{t.deleteCustomer}</button></div>}
        </div>
        {customerBookings.length > 0 && <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><div className="text-xs font-bold text-gray-500 uppercase mb-3">{lang === 'zh' ? '预约历史' : 'History'}</div><div className="space-y-2">{customerBookings.map(booking => { const pkg = packages.find(p => p.id === booking.packageId); return <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"><div><div className="font-medium text-sm">{pkg ? getPackageName(pkg) : booking.packageId}</div><div className="text-xs text-gray-500">{booking.date} • {booking.time}</div></div><div className="text-right"><div className="font-bold">${booking.total}</div><div className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>{getStatusLabel(booking.status)}</div></div></div>; })}</div></div>}
      </div>
    );
  };

  // ==================== 渲染: 设置页面 ====================
  const renderSettings = () => (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Settings className="w-4 h-4 text-blue-500" />{t.businessSettings}</h3><div className="space-y-3"><div><label className="text-xs text-gray-500 font-medium block mb-1">Business Name (EN)</label><input type="text" value={merchantSettings.businessName} onChange={(e) => setMerchantSettings(prev => ({ ...prev, businessName: e.target.value }))} className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none" /></div><div><label className="text-xs text-gray-500 font-medium block mb-1">商家名称 (中文)</label><input type="text" value={merchantSettings.businessNameZh} onChange={(e) => setMerchantSettings(prev => ({ ...prev, businessNameZh: e.target.value }))} className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none" /></div></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg ${merchantSettings.winterModeActive ? 'bg-cyan-100' : 'bg-gray-100'}`}><Snowflake className={`w-5 h-5 ${merchantSettings.winterModeActive ? 'text-cyan-600' : 'text-gray-400'}`} /></div><div><div className="font-bold">{t.winterMode}</div><div className="text-xs text-gray-500">{lang === 'zh' ? '启用后显示冬季专属套餐' : 'Show winter packages'}</div></div></div><button onClick={() => setMerchantSettings(prev => ({ ...prev, winterModeActive: !prev.winterModeActive }))} className={`w-12 h-6 rounded-full transition-colors ${merchantSettings.winterModeActive ? 'bg-cyan-500' : 'bg-gray-300'}`}><div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${merchantSettings.winterModeActive ? 'translate-x-6' : 'translate-x-0.5'}`} /></button></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">{t.pricingRules}</h3><div className="grid grid-cols-2 gap-3"><div><label className="text-xs text-gray-500 font-medium block mb-1">{t.suvSurcharge}</label><div className="flex items-center gap-1"><span className="text-gray-400">$</span><input type="number" value={merchantSettings.suvSurcharge} onChange={(e) => setMerchantSettings(prev => ({ ...prev, suvSurcharge: Number(e.target.value) }))} className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none" /></div></div><div><label className="text-xs text-gray-500 font-medium block mb-1">{t.truckSurcharge}</label><div className="flex items-center gap-1"><span className="text-gray-400">$</span><input type="number" value={merchantSettings.truckSurcharge} onChange={(e) => setMerchantSettings(prev => ({ ...prev, truckSurcharge: Number(e.target.value) }))} className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none" /></div></div></div><div className="mt-3"><label className="text-xs text-gray-500 font-medium block mb-1">{t.hst}</label><div className="flex items-center gap-1"><input type="number" step="0.01" value={merchantSettings.hstRate * 100} onChange={(e) => setMerchantSettings(prev => ({ ...prev, hstRate: Number(e.target.value) / 100 }))} className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none" /><span className="text-gray-400">%</span></div></div></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-800">{t.packageManagement}</h3><button onClick={() => setShowAddPackage(true)} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"><Plus className="w-4 h-4" />{t.addPackage}</button></div><div className="space-y-2">{packages.map(pkg => <div key={pkg.id} className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"><div className="flex-1"><div className="flex items-center gap-2"><span className="font-medium">{pkg.name}</span>{pkg.seasonal === 'winter' && <Snowflake className="w-3 h-3 text-cyan-500" />}</div><div className="text-sm text-gray-500">${pkg.price} • {pkg.duration}min</div></div><div className="flex items-center gap-2"><button onClick={() => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, active: !p.active } : p))} className={`px-2 py-1 rounded text-xs font-medium ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{pkg.active ? 'On' : 'Off'}</button><button onClick={() => handleDeletePackage(pkg.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button></div></div>)}</div>{showAddPackage && <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100"><div className="text-sm font-medium text-blue-800 mb-3">{t.addPackage}</div><div className="space-y-2"><input type="text" value={newPackage.name || ''} onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))} className="w-full p-2 bg-white rounded text-sm border" placeholder="Name (EN)" /><input type="text" value={newPackage.nameZh || ''} onChange={(e) => setNewPackage(prev => ({ ...prev, nameZh: e.target.value }))} className="w-full p-2 bg-white rounded text-sm border" placeholder="名称 (中文)" /><div className="grid grid-cols-2 gap-2"><input type="number" value={newPackage.price || ''} onChange={(e) => setNewPackage(prev => ({ ...prev, price: Number(e.target.value) }))} className="p-2 bg-white rounded text-sm border" placeholder="Price ($)" /><input type="number" value={newPackage.duration || ''} onChange={(e) => setNewPackage(prev => ({ ...prev, duration: Number(e.target.value) }))} className="p-2 bg-white rounded text-sm border" placeholder="Duration" /></div><select value={newPackage.seasonal || 'all'} onChange={(e) => setNewPackage(prev => ({ ...prev, seasonal: e.target.value as Package['seasonal'] }))} className="w-full p-2 bg-white rounded text-sm border"><option value="all">{t.allSeason}</option><option value="winter">{t.winterPackages}</option></select><div className="flex justify-end gap-2"><button onClick={() => { setShowAddPackage(false); setNewPackage({}); }} className="px-3 py-1 text-gray-500 text-sm">Cancel</button><button onClick={handleAddPackage} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button></div></div></div>}</div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"><div className="flex items-center justify-between mb-4"><h3 className="font-bold text-gray-800">{t.addonManagement}</h3><button onClick={() => setShowAddAddon(true)} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"><Plus className="w-4 h-4" />{t.addAddon}</button></div><div className="space-y-2">{addons.map(addon => <div key={addon.id} className="border border-gray-100 rounded-lg p-3 flex items-center justify-between"><div><div className="flex items-center gap-2"><span className="font-medium">{addon.name}</span>{addon.seasonal === 'winter' && <Snowflake className="w-3 h-3 text-cyan-500" />}</div><div className="text-sm text-gray-500">${addon.price}</div></div><div className="flex items-center gap-2"><button onClick={() => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, active: !a.active } : a))} className={`px-2 py-1 rounded text-xs font-medium ${addon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{addon.active ? 'On' : 'Off'}</button><button onClick={() => handleDeleteAddon(addon.id)} className="p-1 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4 text-red-400" /></button></div></div>)}</div>{showAddAddon && <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100"><div className="text-sm font-medium text-blue-800 mb-3">{t.addAddon}</div><div className="space-y-2"><input type="text" value={newAddon.name || ''} onChange={(e) => setNewAddon(prev => ({ ...prev, name: e.target.value }))} className="w-full p-2 bg-white rounded text-sm border" placeholder="Name (EN)" /><input type="text" value={newAddon.nameZh || ''} onChange={(e) => setNewAddon(prev => ({ ...prev, nameZh: e.target.value }))} className="w-full p-2 bg-white rounded text-sm border" placeholder="名称 (中文)" /><div className="grid grid-cols-2 gap-2"><input type="number" value={newAddon.price || ''} onChange={(e) => setNewAddon(prev => ({ ...prev, price: Number(e.target.value) }))} className="p-2 bg-white rounded text-sm border" placeholder="Price ($)" /><select value={newAddon.seasonal || 'all'} onChange={(e) => setNewAddon(prev => ({ ...prev, seasonal: e.target.value as Addon['seasonal'] }))} className="p-2 bg-white rounded text-sm border"><option value="all">{t.allSeason}</option><option value="winter">{t.winterPackages}</option></select></div><div className="flex justify-end gap-2"><button onClick={() => { setShowAddAddon(false); setNewAddon({}); }} className="px-3 py-1 text-gray-500 text-sm">Cancel</button><button onClick={handleAddAddon} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add</button></div></div></div>}</div>
    </div>
  );

  // ==================== 主渲染 ====================
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {renderNav()}
      {isOwnerMode && renderOwnerNav()}
      <main className="max-w-md mx-auto p-4">
        {showLogin && renderLogin()}
        {showInvoicePreview && renderInvoicePreview()}
        {!isOwnerMode && renderCustomerBooking()}
        {isOwnerMode && (
          <>{selectedCustomerId ? renderCustomerDetail() : (<>{ownerTab === 'calendar' && renderCalendar()}{ownerTab === 'customers' && renderCustomerList()}{ownerTab === 'revenue' && renderRevenue()}{ownerTab === 'supplies' && renderSupplies()}{ownerTab === 'settings' && renderSettings()}</>)}</>
        )}
      </main>
    </div>
  );
}