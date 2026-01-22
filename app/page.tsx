"use client";

import React, { useState, useEffect } from 'react';
import { 
  CloudRain, Sun, Tag, Trash2, Plus, Lock, DollarSign,
  Car, Truck, Bus, Loader2, Users, Calendar, Settings,
  ChevronLeft, ChevronRight, Search, Phone, Mail, Clock,
  Edit2, Save, X, User, MapPin, FileText, Star, AlertCircle
} from 'lucide-react';

// ============================================================
// 类型定义
// ============================================================

interface Package {
  id: string;
  name: string;
  nameZh: string;
  nameFr: string;
  price: number;
  desc: string;
  descZh: string;
  descFr: string;
  duration: number; // 分钟
  active: boolean;
}

interface Addon {
  id: string;
  name: string;
  nameZh: string;
  nameFr: string;
  price: number;
  active: boolean;
}

interface CustomerTag {
  id: string;
  text: string;
  color: string;
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  vehicleType: 'sedan' | 'suv' | 'truck';
  vehicleInfo: string;
  tags: CustomerTag[];
  notes: string;
  totalSpent: number;
  visitCount: number;
  lastVisit: string | null;
  createdAt: string;
}

interface Booking {
  id: string;
  customerId: string;
  packageId: string;
  addonIds: string[];
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  total: number;
  notes: string;
}

interface MerchantSettings {
  businessName: string;
  businessNameZh: string;
  suvSurcharge: number;
  truckSurcharge: number;
  rainModeActive: boolean;
}

interface WeatherData {
  current: {
    temperature_2m: number;
    precipitation: number;
  };
}

// ============================================================
// 常量
// ============================================================

const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
  green: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
  red: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
};

const VEHICLE_ICONS = {
  sedan: Car,
  suv: Bus,
  truck: Truck,
};

// ============================================================
// 多语言
// ============================================================

const translations = {
  en: {
    brand: "Ruiyu Auto Spa",
    // 导航
    customers: "Customers",
    calendar: "Calendar",
    settings: "Settings",
    booking: "New Booking",
    // 车型
    vehicleType: "Vehicle Type",
    sedan: "Sedan/Coupe",
    suv: "SUV/Crossover",
    truck: "Truck/Minivan",
    // 预约
    packages: "Select Package",
    addons: "Add-ons",
    contact: "Contact Info",
    pay: "Book Now",
    total: "Total",
    name: "Full Name",
    phone: "Phone Number",
    email: "Email",
    address: "Service Address",
    notes: "Notes",
    // 客户
    searchCustomers: "Search customers...",
    addCustomer: "Add Customer",
    noCustomers: "No customers yet",
    customerDetails: "Customer Details",
    editCustomer: "Edit",
    saveCustomer: "Save",
    deleteCustomer: "Delete",
    totalSpent: "Total Spent",
    visits: "Visits",
    lastVisit: "Last Visit",
    memberSince: "Member Since",
    vehicleInfo: "Vehicle Info",
    customerTags: "Tags",
    addTag: "Add Tag",
    internalNotes: "Internal Notes",
    // 设置
    businessSettings: "Business Settings",
    packageManagement: "Package Management",
    addonManagement: "Add-on Management",
    pricingRules: "Pricing Rules",
    suvSurcharge: "SUV Surcharge",
    truckSurcharge: "Truck Surcharge",
    addPackage: "Add Package",
    addAddon: "Add Add-on",
    duration: "Duration (min)",
    active: "Active",
    // 天气
    rainMode: "Rain Mode",
    weather: "Weather",
    // 状态
    pending: "Pending",
    confirmed: "Confirmed",
    completed: "Completed",
    cancelled: "Cancelled",
    noShow: "No-Show",
    // 验证
    valName: "Please enter customer name",
    valPhone: "Please enter a valid phone number",
    bookingSuccess: "Booking created successfully!",
    // 登录
    ownerLogin: "Owner Access",
    loginPin: "Enter PIN",
    login: "Login",
    logout: "Logout",
    // 日历
    today: "Today",
    noBookings: "No bookings",
  },
  zh: {
    brand: "瑞宇汽车美容",
    customers: "客户管理",
    calendar: "日程安排",
    settings: "系统设置",
    booking: "新建预约",
    vehicleType: "车型选择",
    sedan: "轿车/跑车",
    suv: "SUV/越野车",
    truck: "皮卡/MPV",
    packages: "选择套餐",
    addons: "附加服务",
    contact: "联系方式",
    pay: "立即预约",
    total: "合计",
    name: "姓名",
    phone: "电话",
    email: "邮箱",
    address: "服务地址",
    notes: "备注",
    searchCustomers: "搜索客户...",
    addCustomer: "添加客户",
    noCustomers: "暂无客户",
    customerDetails: "客户详情",
    editCustomer: "编辑",
    saveCustomer: "保存",
    deleteCustomer: "删除",
    totalSpent: "累计消费",
    visits: "服务次数",
    lastVisit: "上次服务",
    memberSince: "加入时间",
    vehicleInfo: "车辆信息",
    customerTags: "客户标签",
    addTag: "添加标签",
    internalNotes: "内部备注",
    businessSettings: "商家设置",
    packageManagement: "套餐管理",
    addonManagement: "附加服务管理",
    pricingRules: "价格规则",
    suvSurcharge: "SUV 加价",
    truckSurcharge: "皮卡/MPV 加价",
    addPackage: "添加套餐",
    addAddon: "添加附加服务",
    duration: "时长(分钟)",
    active: "启用",
    rainMode: "雨天模式",
    weather: "天气",
    pending: "待确认",
    confirmed: "已确认",
    completed: "已完成",
    cancelled: "已取消",
    noShow: "未到场",
    valName: "请输入客户姓名",
    valPhone: "请输入有效的电话号码",
    bookingSuccess: "预约创建成功！",
    ownerLogin: "店主登录",
    loginPin: "输入PIN码",
    login: "登录",
    logout: "退出",
    today: "今天",
    noBookings: "暂无预约",
  },
  fr: {
    brand: "Ruiyu Auto Spa",
    customers: "Clients",
    calendar: "Calendrier",
    settings: "Paramètres",
    booking: "Réservation",
    vehicleType: "Type de Véhicule",
    sedan: "Berline/Coupé",
    suv: "VUS/Crossover",
    truck: "Camion/Minivan",
    packages: "Forfaits",
    addons: "Suppléments",
    contact: "Contact",
    pay: "Réserver",
    total: "Total",
    name: "Nom",
    phone: "Téléphone",
    email: "Courriel",
    address: "Adresse",
    notes: "Notes",
    searchCustomers: "Rechercher...",
    addCustomer: "Ajouter",
    noCustomers: "Aucun client",
    customerDetails: "Détails",
    editCustomer: "Modifier",
    saveCustomer: "Enregistrer",
    deleteCustomer: "Supprimer",
    totalSpent: "Total Dépensé",
    visits: "Visites",
    lastVisit: "Dernière Visite",
    memberSince: "Membre Depuis",
    vehicleInfo: "Véhicule",
    customerTags: "Tags",
    addTag: "Ajouter Tag",
    internalNotes: "Notes Internes",
    businessSettings: "Paramètres",
    packageManagement: "Forfaits",
    addonManagement: "Suppléments",
    pricingRules: "Tarification",
    suvSurcharge: "Supplément VUS",
    truckSurcharge: "Supplément Camion",
    addPackage: "Ajouter Forfait",
    addAddon: "Ajouter Supplément",
    duration: "Durée (min)",
    active: "Actif",
    rainMode: "Mode Pluie",
    weather: "Météo",
    pending: "En attente",
    confirmed: "Confirmé",
    completed: "Terminé",
    cancelled: "Annulé",
    noShow: "Absent",
    valName: "Entrez le nom",
    valPhone: "Numéro invalide",
    bookingSuccess: "Réservation créée!",
    ownerLogin: "Accès Propriétaire",
    loginPin: "Entrez PIN",
    login: "Connexion",
    logout: "Déconnexion",
    today: "Aujourd'hui",
    noBookings: "Aucune réservation",
  }
};

// ============================================================
// 初始数据
// ============================================================

const initialPackages: Package[] = [
  { 
    id: 'express', 
    name: 'Express Wash', 
    nameZh: '快速清洗', 
    nameFr: 'Lavage Express',
    price: 45, 
    desc: 'Exterior wash & wax, rim cleaning',
    descZh: '外观清洗打蜡、轮毂清洁',
    descFr: 'Lavage extérieur, cire, jantes',
    duration: 45,
    active: true 
  },
  { 
    id: 'standard', 
    name: 'Standard Detail', 
    nameZh: '标准养护', 
    nameFr: 'Détail Standard',
    price: 120, 
    desc: 'Full interior vacuum, wipe down, exterior hand wash',
    descZh: '全车内饰吸尘、擦拭，外观手工清洗',
    descFr: 'Aspirateur intérieur, nettoyage, lavage main',
    duration: 120,
    active: true 
  },
  { 
    id: 'premium', 
    name: 'Premium Detail', 
    nameZh: '尊享护理', 
    nameFr: 'Détail Premium',
    price: 250, 
    desc: 'Steam cleaning, leather conditioning, clay bar',
    descZh: '蒸汽清洗、皮革护理、粘土去污',
    descFr: 'Vapeur, cuir, barre d\'argile',
    duration: 240,
    active: true 
  },
];

const initialAddons: Addon[] = [
  { id: 'dogHair', name: 'Pet Hair Removal', nameZh: '宠物毛发清理', nameFr: 'Poils d\'animaux', price: 50, active: true },
  { id: 'biohazard', name: 'Biohazard / Vomit', nameZh: '异味/呕吐物处理', nameFr: 'Risque biologique', price: 80, active: true },
  { id: 'sand', name: 'Excessive Sand', nameZh: '重度泥沙清理', nameFr: 'Sable excessif', price: 30, active: true },
];

const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Mike Ross',
    phone: '5191234567',
    email: 'mike@example.com',
    address: '123 Richmond St, London ON',
    vehicleType: 'sedan',
    vehicleInfo: 'Tesla Model S - White',
    tags: [
      { id: 't1', text: 'VIP', color: 'yellow' },
      { id: 't2', text: 'Weekly', color: 'blue' },
    ],
    notes: 'Prefers text over call. Watch out for curbs.',
    totalSpent: 890,
    visitCount: 6,
    lastVisit: '2025-01-15',
    createdAt: '2024-08-20',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    phone: '5199876543',
    email: 'sarah.chen@email.com',
    address: '456 Oxford St W, London ON',
    vehicleType: 'suv',
    vehicleInfo: 'BMW X5 - Black',
    tags: [
      { id: 't3', text: 'Monthly', color: 'green' },
    ],
    notes: 'Has a German Shepherd - always needs pet hair removal.',
    totalSpent: 540,
    visitCount: 3,
    lastVisit: '2025-01-10',
    createdAt: '2024-11-05',
  },
  {
    id: '3',
    name: 'James Wilson',
    phone: '2269991234',
    email: 'jwilson@work.com',
    address: '789 Wonderland Rd, London ON',
    vehicleType: 'truck',
    vehicleInfo: 'Ford F-150 - Blue',
    tags: [
      { id: 't4', text: 'Fleet', color: 'purple' },
    ],
    notes: 'Company vehicle. Invoice to Wilson Construction Ltd.',
    totalSpent: 1250,
    visitCount: 8,
    lastVisit: '2025-01-18',
    createdAt: '2024-06-12',
  },
];

const sampleBookings: Booking[] = [
  {
    id: 'b1',
    customerId: '1',
    packageId: 'standard',
    addonIds: [],
    date: '2025-01-21',
    time: '14:00',
    status: 'confirmed',
    total: 120,
    notes: '',
  },
  {
    id: 'b2',
    customerId: '2',
    packageId: 'premium',
    addonIds: ['dogHair'],
    date: '2025-01-21',
    time: '09:00',
    status: 'confirmed',
    total: 320,
    notes: 'Gate code: 1234',
  },
  {
    id: 'b3',
    customerId: '3',
    packageId: 'express',
    addonIds: ['sand'],
    date: '2025-01-22',
    time: '10:00',
    status: 'pending',
    total: 115,
    notes: '',
  },
];

// ============================================================
// 主组件
// ============================================================

export default function MobileDetailingCRM() {
  // 语言与视图
  const [lang, setLang] = useState<'en' | 'zh' | 'fr'>('en');
  const [isOwnerMode, setIsOwnerMode] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pinInput, setPinInput] = useState('');
  
  // 商家后台导航
  const [ownerTab, setOwnerTab] = useState<'calendar' | 'customers' | 'settings'>('calendar');
  
  // 数据状态
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [bookings, setBookings] = useState<Booking[]>(sampleBookings);
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>({
    businessName: 'Ruiyu Auto Spa',
    businessNameZh: '瑞宇汽车美容',
    suvSurcharge: 20,
    truckSurcharge: 40,
    rainModeActive: false,
  });
  
  // 天气
  const [weather, setWeather] = useState({ temp: 0, isRaining: false });
  
  // 客户详情
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editingCustomerData, setEditingCustomerData] = useState<Customer | null>(null);
  
  // 日历
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 客户端预约表单
  const [bookingForm, setBookingForm] = useState({
    vehicleType: 'sedan' as 'sedan' | 'suv' | 'truck',
    packageId: 'standard',
    addonIds: [] as string[],
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 设置页面状态
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);
  const [editingAddonId, setEditingAddonId] = useState<string | null>(null);
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [showAddAddon, setShowAddAddon] = useState(false);
  const [newPackage, setNewPackage] = useState<Partial<Package>>({
    name: '', nameZh: '', nameFr: '', price: 0, desc: '', descZh: '', descFr: '', duration: 60, active: true
  });
  const [newAddon, setNewAddon] = useState<Partial<Addon>>({
    name: '', nameZh: '', nameFr: '', price: 0, active: true
  });
  
  // 新标签状态
  const [newTagText, setNewTagText] = useState('');
  const [newTagColor, setNewTagColor] = useState('blue');
  
  const t = translations[lang];
  
  // 获取天气
  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=42.98&longitude=-81.24&current=temperature_2m,precipitation&timezone=America%2FNew_York')
      .then(res => res.json())
      .then((data: WeatherData) => {
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          isRaining: data.current.precipitation > 0,
        });
        if (data.current.precipitation > 0) {
          setMerchantSettings(prev => ({ ...prev, rainModeActive: true }));
        }
      })
      .catch(err => console.error("Weather fetch failed", err));
  }, []);
  
  // ============================================================
  // 计算函数
  // ============================================================
  
  const calculateTotal = (
    pkgId: string, 
    vehicleType: string, 
    selectedAddons: string[]
  ): number => {
    const pkg = packages.find(p => p.id === pkgId);
    let total = pkg?.price || 0;
    
    if (vehicleType === 'suv') total += merchantSettings.suvSurcharge;
    if (vehicleType === 'truck') total += merchantSettings.truckSurcharge;
    
    selectedAddons.forEach(addonId => {
      const addon = addons.find(a => a.id === addonId);
      if (addon) total += addon.price;
    });
    
    return total;
  };
  
  const getPackageName = (pkg: Package): string => {
    if (lang === 'zh') return pkg.nameZh || pkg.name;
    if (lang === 'fr') return pkg.nameFr || pkg.name;
    return pkg.name;
  };
  
  const getPackageDesc = (pkg: Package): string => {
    if (lang === 'zh') return pkg.descZh || pkg.desc;
    if (lang === 'fr') return pkg.descFr || pkg.desc;
    return pkg.desc;
  };
  
  const getAddonName = (addon: Addon): string => {
    if (lang === 'zh') return addon.nameZh || addon.name;
    if (lang === 'fr') return addon.nameFr || addon.name;
    return addon.name;
  };
  
  const getVehicleLabel = (type: string): string => {
    if (type === 'sedan') return t.sedan;
    if (type === 'suv') return t.suv;
    return t.truck;
  };
  
  // ============================================================
  // 客户端预约处理
  // ============================================================
  
  const handleBookingSubmit = () => {
    if (!bookingForm.name.trim()) {
      alert(t.valName);
      return;
    }
    if (!/^\d{10,11}$/.test(bookingForm.phone.replace(/\D/g, ''))) {
      alert(t.valPhone);
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      // 检查是否是已有客户
      let customer = customers.find(
        c => c.phone.replace(/\D/g, '') === bookingForm.phone.replace(/\D/g, '')
      );
      
      if (!customer) {
        // 创建新客户
        customer = {
          id: Date.now().toString(),
          name: bookingForm.name,
          phone: bookingForm.phone,
          email: bookingForm.email,
          address: bookingForm.address,
          vehicleType: bookingForm.vehicleType,
          vehicleInfo: '',
          tags: [],
          notes: '',
          totalSpent: 0,
          visitCount: 0,
          lastVisit: null,
          createdAt: new Date().toISOString().split('T')[0],
        };
        setCustomers(prev => [...prev, customer!]);
      }
      
      // 创建预约
      const total = calculateTotal(bookingForm.packageId, bookingForm.vehicleType, bookingForm.addonIds);
      const newBooking: Booking = {
        id: 'b' + Date.now(),
        customerId: customer.id,
        packageId: bookingForm.packageId,
        addonIds: bookingForm.addonIds,
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        status: 'pending',
        total,
        notes: bookingForm.notes,
      };
      setBookings(prev => [...prev, newBooking]);
      
      setIsSubmitting(false);
      alert(`${t.bookingSuccess}\n${t.total}: $${total}`);
      
      // 重置表单
      setBookingForm({
        vehicleType: 'sedan',
        packageId: 'standard',
        addonIds: [],
        name: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
    }, 1000);
  };
  
  const toggleAddon = (addonId: string) => {
    setBookingForm(prev => ({
      ...prev,
      addonIds: prev.addonIds.includes(addonId)
        ? prev.addonIds.filter(id => id !== addonId)
        : [...prev.addonIds, addonId]
    }));
  };
  
  // ============================================================
  // 客户管理
  // ============================================================
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.phone.includes(customerSearch) ||
    c.email.toLowerCase().includes(customerSearch.toLowerCase())
  );
  
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  
  const handleSaveCustomer = () => {
    if (!editingCustomerData) return;
    
    setCustomers(prev => prev.map(c => 
      c.id === editingCustomerData.id ? editingCustomerData : c
    ));
    setIsEditingCustomer(false);
    setEditingCustomerData(null);
  };
  
  const handleDeleteCustomer = (customerId: string) => {
    if (confirm('Are you sure you want to delete this customer?')) {
      setCustomers(prev => prev.filter(c => c.id !== customerId));
      setSelectedCustomerId(null);
    }
  };
  
  const handleAddTag = (customerId: string) => {
    if (!newTagText.trim()) return;
    
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        tags: [...c.tags, { id: Date.now().toString(), text: newTagText, color: newTagColor }]
      };
    }));
    setNewTagText('');
  };
  
  const handleRemoveTag = (customerId: string, tagId: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id !== customerId) return c;
      return {
        ...c,
        tags: c.tags.filter(tag => tag.id !== tagId)
      };
    }));
  };
  
  // ============================================================
  // 套餐和附加服务管理
  // ============================================================
  
  const handleSavePackage = (pkgId: string, updatedPkg: Partial<Package>) => {
    setPackages(prev => prev.map(p => 
      p.id === pkgId ? { ...p, ...updatedPkg } : p
    ));
    setEditingPackageId(null);
  };
  
  const handleAddPackage = () => {
    if (!newPackage.name) return;
    
    const pkg: Package = {
      id: 'pkg_' + Date.now(),
      name: newPackage.name || '',
      nameZh: newPackage.nameZh || '',
      nameFr: newPackage.nameFr || '',
      price: newPackage.price || 0,
      desc: newPackage.desc || '',
      descZh: newPackage.descZh || '',
      descFr: newPackage.descFr || '',
      duration: newPackage.duration || 60,
      active: true,
    };
    
    setPackages(prev => [...prev, pkg]);
    setNewPackage({ name: '', nameZh: '', nameFr: '', price: 0, desc: '', descZh: '', descFr: '', duration: 60, active: true });
    setShowAddPackage(false);
  };
  
  const handleDeletePackage = (pkgId: string) => {
    if (confirm('Delete this package?')) {
      setPackages(prev => prev.filter(p => p.id !== pkgId));
    }
  };
  
  const handleSaveAddon = (addonId: string, updatedAddon: Partial<Addon>) => {
    setAddons(prev => prev.map(a => 
      a.id === addonId ? { ...a, ...updatedAddon } : a
    ));
    setEditingAddonId(null);
  };
  
  const handleAddAddon = () => {
    if (!newAddon.name) return;
    
    const addon: Addon = {
      id: 'addon_' + Date.now(),
      name: newAddon.name || '',
      nameZh: newAddon.nameZh || '',
      nameFr: newAddon.nameFr || '',
      price: newAddon.price || 0,
      active: true,
    };
    
    setAddons(prev => [...prev, addon]);
    setNewAddon({ name: '', nameZh: '', nameFr: '', price: 0, active: true });
    setShowAddAddon(false);
  };
  
  const handleDeleteAddon = (addonId: string) => {
    if (confirm('Delete this add-on?')) {
      setAddons(prev => prev.filter(a => a.id !== addonId));
    }
  };
  
  // ============================================================
  // 日历相关
  // ============================================================
  
  const getBookingsForDate = (date: string): (Booking & { customer: Customer | undefined })[] => {
    return bookings
      .filter(b => b.date === date)
      .map(b => ({ ...b, customer: customers.find(c => c.id === b.customerId) }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };
  
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(lang === 'zh' ? 'zh-CN' : lang === 'fr' ? 'fr-CA' : 'en-CA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const navigateDate = (days: number) => {
    const current = new Date(selectedDate + 'T00:00:00');
    current.setDate(current.getDate() + days);
    setSelectedDate(current.toISOString().split('T')[0]);
  };
  
  const getStatusColor = (status: Booking['status']): string => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'no-show': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusLabel = (status: Booking['status']): string => {
    switch (status) {
      case 'pending':
        return t.pending;
      case 'confirmed':
        return t.confirmed;
      case 'completed':
        return t.completed;
      case 'cancelled':
        return t.cancelled;
      case 'no-show':
        return t.noShow;
      default:
        return status;
    }
  };

  // ============================================================
  // 渲染: 导航栏
  // ============================================================
  
  const renderNav = () => (
    <nav className="bg-white px-4 py-3 flex justify-between items-center shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="font-black text-lg tracking-tight text-blue-700">
        {lang === 'zh' ? merchantSettings.businessNameZh : merchantSettings.businessName}
      </div>
      <div className="flex gap-2 items-center">
        {(['en', 'zh', 'fr'] as const).map((l) => (
          <button 
            key={l} 
            onClick={() => setLang(l)} 
            className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
              lang === l ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
        {isOwnerMode ? (
          <button 
            onClick={() => { setIsOwnerMode(false); setSelectedCustomerId(null); }}
            className="ml-2 text-xs text-red-500 font-bold border border-red-200 px-2 py-1 rounded hover:bg-red-50"
          >
            {t.logout}
          </button>
        ) : (
          <button 
            onClick={() => setShowLogin(true)}
            className="ml-2 text-gray-400 hover:text-gray-600"
          >
            <Lock className="w-4 h-4" />
          </button>
        )}
      </div>
    </nav>
  );
  
  // ============================================================
  // 渲染: 商家后台导航
  // ============================================================
  
  const renderOwnerNav = () => (
    <div className="bg-white border-b border-gray-200 px-4">
      <div className="max-w-md mx-auto flex">
        {[
          { key: 'calendar', icon: Calendar, label: t.calendar },
          { key: 'customers', icon: Users, label: t.customers },
          { key: 'settings', icon: Settings, label: t.settings },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => { setOwnerTab(key as typeof ownerTab); setSelectedCustomerId(null); }}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium transition-colors border-b-2 ${
              ownerTab === key 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
  
  // ============================================================
  // 渲染: 登录弹窗
  // ============================================================
  
  const renderLogin = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-lg font-bold mb-4 text-center">{t.ownerLogin}</h2>
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 p-3 rounded-full">
            <Lock className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        <input 
          type="password" 
          placeholder={t.loginPin}
          className="w-full text-center text-2xl tracking-widest p-3 bg-gray-50 rounded-xl border mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          value={pinInput}
          onChange={(e) => setPinInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && pinInput === '8888') {
              setIsOwnerMode(true);
              setShowLogin(false);
              setPinInput('');
            }
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => { setShowLogin(false); setPinInput(''); }}
            className="p-3 rounded-xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (pinInput === '8888') {
                setIsOwnerMode(true);
                setShowLogin(false);
                setPinInput('');
              } else {
                alert('Demo PIN: 8888');
              }
            }}
            className="p-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700"
          >
            {t.login}
          </button>
        </div>
      </div>
    </div>
  );
  
  // ============================================================
  // 渲染: 客户端预约界面
  // ============================================================
  
  const renderCustomerBooking = () => {
    const activePackages = packages.filter(p => p.active);
    const activeAddons = addons.filter(a => a.active);
    const total = calculateTotal(bookingForm.packageId, bookingForm.vehicleType, bookingForm.addonIds);
    
    return (
      <div className="space-y-4 pb-28">
        {/* 雨天提醒 */}
        {merchantSettings.rainModeActive && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-amber-800">
                {lang === 'zh' ? '雨天服务提醒' : 'Rain Mode Active'}
              </div>
              <div className="text-sm text-amber-700">
                {lang === 'zh' 
                  ? '当前天气可能影响户外服务，建议选择有遮蔽的服务地点'
                  : 'Current weather may affect outdoor service. A covered location is recommended.'}
              </div>
            </div>
          </div>
        )}
        
        {/* 车型选择 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.vehicleType}</h2>
          <div className="grid grid-cols-3 gap-2">
            {(['sedan', 'suv', 'truck'] as const).map((type) => {
              const Icon = VEHICLE_ICONS[type];
              const surcharge = type === 'suv' 
                ? merchantSettings.suvSurcharge 
                : type === 'truck' 
                  ? merchantSettings.truckSurcharge 
                  : 0;
              
              return (
                <button 
                  key={type}
                  onClick={() => setBookingForm(prev => ({ ...prev, vehicleType: type }))}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                    bookingForm.vehicleType === type 
                      ? 'border-blue-600 bg-blue-50 text-blue-700' 
                      : 'border-gray-100 text-gray-400 hover:border-gray-200'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-bold text-center leading-tight">{getVehicleLabel(type)}</span>
                  {surcharge > 0 && (
                    <span className="text-[9px] text-gray-400 mt-1">+${surcharge}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 套餐选择 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.packages}</h2>
          <div className="space-y-2">
            {activePackages.map(pkg => (
              <div 
                key={pkg.id}
                onClick={() => setBookingForm(prev => ({ ...prev, packageId: pkg.id }))}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  bookingForm.packageId === pkg.id 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-bold ${bookingForm.packageId === pkg.id ? 'text-blue-900' : 'text-gray-900'}`}>
                    {getPackageName(pkg)}
                  </span>
                  <span className="font-black text-lg">${pkg.price}</span>
                </div>
                <p className="text-xs text-gray-500">{getPackageDesc(pkg)}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{pkg.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 附加服务 */}
        {activeAddons.length > 0 && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">{t.addons}</h2>
            <div className="space-y-2">
              {activeAddons.map(addon => (
                <label 
                  key={addon.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={bookingForm.addonIds.includes(addon.id)}
                      onChange={() => toggleAddon(addon.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">{getAddonName(addon)}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">+${addon.price}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* 联系方式 */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t.contact}</h2>
          <input 
            type="text" 
            placeholder={t.name}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={bookingForm.name}
            onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
          />
          <input 
            type="tel" 
            placeholder={t.phone}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={bookingForm.phone}
            onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
          />
          <input 
            type="email" 
            placeholder={t.email}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={bookingForm.email}
            onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
          />
          <input 
            type="text" 
            placeholder={t.address}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={bookingForm.address}
            onChange={(e) => setBookingForm(prev => ({ ...prev, address: e.target.value }))}
          />
          <textarea 
            placeholder={t.notes}
            rows={2}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
            value={bookingForm.notes}
            onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>
        
        {/* 底部固定预约栏 */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-gray-500 font-medium">{t.total}</div>
              <div className="text-2xl font-black text-gray-900">${total}</div>
            </div>
            <button 
              onClick={handleBookingSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  {t.pay}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // ============================================================
  // 渲染: 日历视图
  // ============================================================
  
  const renderCalendar = () => {
    const todayBookings = getBookingsForDate(selectedDate);
    const isToday = selectedDate === new Date().toISOString().split('T')[0];
    
    return (
      <div className="space-y-4">
        {/* 天气卡片 */}
        <div className={`p-4 rounded-xl text-white shadow-lg ${
          merchantSettings.rainModeActive ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-blue-500 to-blue-600'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                {merchantSettings.rainModeActive ? (
                  <CloudRain className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <span className="font-medium">{weather.temp}°C London, ON</span>
              </div>
            </div>
            <button 
              onClick={() => setMerchantSettings(prev => ({ ...prev, rainModeActive: !prev.rainModeActive }))}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                merchantSettings.rainModeActive 
                  ? 'bg-white text-red-500' 
                  : 'bg-blue-700 text-blue-200'
              }`}
            >
              {t.rainMode}: {merchantSettings.rainModeActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
        
        {/* 日期选择 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="font-bold text-lg">{formatDate(selectedDate)}</div>
              {isToday && (
                <div className="text-xs text-blue-600 font-medium">{t.today}</div>
              )}
            </div>
            <button 
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* 当日预约列表 */}
          {todayBookings.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div>{t.noBookings}</div>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBookings.map(booking => {
                const pkg = packages.find(p => p.id === booking.packageId);
                const VehicleIcon = booking.customer?.vehicleType 
                  ? VEHICLE_ICONS[booking.customer.vehicleType] 
                  : Car;
                
                return (
                  <div 
                    key={booking.id}
                    onClick={() => {
                      if (booking.customer) {
                        setSelectedCustomerId(booking.customer.id);
                        setOwnerTab('customers');
                      }
                    }}
                    className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <VehicleIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-bold">{booking.customer?.name || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{booking.customer?.vehicleInfo}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{booking.time}</div>
                        <div className={`text-xs font-medium px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>
                          {getStatusLabel(booking.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{pkg ? getPackageName(pkg) : booking.packageId}</span>
                      <span className="font-bold">${booking.total}</span>
                    </div>
                    {booking.customer?.tags && booking.customer.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {booking.customer.tags.map(tag => {
                          const colors = TAG_COLORS[tag.color] || TAG_COLORS.blue;
                          return (
                            <span 
                              key={tag.id}
                              className={`${colors.bg} ${colors.text} ${colors.border} border px-2 py-0.5 rounded text-[10px] font-bold`}
                            >
                              {tag.text}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // ============================================================
  // 渲染: 客户列表
  // ============================================================
  
  const renderCustomerList = () => (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchCustomers}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customerSearch}
              onChange={(e) => setCustomerSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              const newCustomer: Customer = {
                id: Date.now().toString(),
                name: '',
                phone: '',
                email: '',
                address: '',
                vehicleType: 'sedan',
                vehicleInfo: '',
                tags: [],
                notes: '',
                totalSpent: 0,
                visitCount: 0,
                lastVisit: null,
                createdAt: new Date().toISOString().split('T')[0],
              };
              setCustomers(prev => [newCustomer, ...prev]);
              setSelectedCustomerId(newCustomer.id);
              setIsEditingCustomer(true);
              setEditingCustomerData(newCustomer);
            }}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* 客户列表 */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <div>{t.noCustomers}</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredCustomers.map(customer => {
            const VehicleIcon = VEHICLE_ICONS[customer.vehicleType];
            
            return (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <VehicleIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 truncate">{customer.name || 'New Customer'}</span>
                      {customer.tags.length > 0 && (
                        <div className="flex gap-1">
                          {customer.tags.slice(0, 2).map(tag => {
                            const colors = TAG_COLORS[tag.color] || TAG_COLORS.blue;
                            return (
                              <span 
                                key={tag.id}
                                className={`${colors.bg} ${colors.text} px-1.5 py-0.5 rounded text-[9px] font-bold`}
                              >
                                {tag.text}
                              </span>
                            );
                          })}
                          {customer.tags.length > 2 && (
                            <span className="text-[9px] text-gray-400">+{customer.tags.length - 2}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{customer.vehicleInfo || getVehicleLabel(customer.vehicleType)}</div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />${customer.totalSpent}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />{customer.visitCount} {t.visits.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
  // ============================================================
  // 渲染: 客户详情
  // ============================================================
  
  const renderCustomerDetail = () => {
    if (!selectedCustomer) return null;
    
    const customer = isEditingCustomer && editingCustomerData ? editingCustomerData : selectedCustomer;
    const VehicleIcon = VEHICLE_ICONS[customer.vehicleType];
    const customerBookings = bookings.filter(b => b.customerId === customer.id);
    
    return (
      <div className="space-y-4">
        {/* 返回按钮 */}
        <button
          onClick={() => {
            setSelectedCustomerId(null);
            setIsEditingCustomer(false);
            setEditingCustomerData(null);
          }}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">{t.customers}</span>
        </button>
        
        {/* 客户信息卡片 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* 头部 */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <VehicleIcon className="w-6 h-6" />
                </div>
                {isEditingCustomer ? (
                  <input
                    type="text"
                    value={editingCustomerData?.name || ''}
                    onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, name: e.target.value } : null)}
                    className="bg-white/20 rounded-lg px-3 py-1 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder={t.name}
                  />
                ) : (
                  <span className="font-bold text-xl">{customer.name}</span>
                )}
              </div>
              {!isEditingCustomer ? (
                <button
                  onClick={() => {
                    setIsEditingCustomer(true);
                    setEditingCustomerData({ ...customer });
                  }}
                  className="bg-white/20 p-2 rounded-lg hover:bg-white/30"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditingCustomer(false);
                      setEditingCustomerData(null);
                    }}
                    className="bg-white/20 p-2 rounded-lg hover:bg-white/30"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveCustomer}
                    className="bg-white text-blue-600 p-2 rounded-lg hover:bg-blue-50"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold">${customer.totalSpent}</div>
                <div className="text-[10px] opacity-80">{t.totalSpent}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-lg font-bold">{customer.visitCount}</div>
                <div className="text-[10px] opacity-80">{t.visits}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-sm font-bold">{customer.lastVisit || '-'}</div>
                <div className="text-[10px] opacity-80">{t.lastVisit}</div>
              </div>
            </div>
          </div>
          
          {/* 详细信息 */}
          <div className="p-4 space-y-4">
            {/* 联系方式 */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-400" />
                {isEditingCustomer ? (
                  <input
                    type="tel"
                    value={editingCustomerData?.phone || ''}
                    onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, phone: e.target.value } : null)}
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.phone}
                  />
                ) : (
                  <span className="text-gray-700">{customer.phone || '-'}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                {isEditingCustomer ? (
                  <input
                    type="email"
                    value={editingCustomerData?.email || ''}
                    onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, email: e.target.value } : null)}
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.email}
                  />
                ) : (
                  <span className="text-gray-700">{customer.email || '-'}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                {isEditingCustomer ? (
                  <input
                    type="text"
                    value={editingCustomerData?.address || ''}
                    onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, address: e.target.value } : null)}
                    className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t.address}
                  />
                ) : (
                  <span className="text-gray-700">{customer.address || '-'}</span>
                )}
              </div>
            </div>
            
            {/* 车辆信息 */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase mb-2">{t.vehicleInfo}</div>
              {isEditingCustomer ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-2">
                    {(['sedan', 'suv', 'truck'] as const).map(type => {
                      const Icon = VEHICLE_ICONS[type];
                      return (
                        <button
                          key={type}
                          onClick={() => setEditingCustomerData(prev => prev ? { ...prev, vehicleType: type } : null)}
                          className={`p-2 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                            editingCustomerData?.vehicleType === type
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : 'border-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[10px] font-medium">{getVehicleLabel(type)}</span>
                        </button>
                      );
                    })}
                  </div>
                  <input
                    type="text"
                    value={editingCustomerData?.vehicleInfo || ''}
                    onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, vehicleInfo: e.target.value } : null)}
                    className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Tesla Model S - White"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-700">
                  <VehicleIcon className="w-4 h-4 text-gray-400" />
                  <span>{customer.vehicleInfo || getVehicleLabel(customer.vehicleType)}</span>
                </div>
              )}
            </div>
            
            {/* 客户标签 */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <Tag className="w-3 h-3" />
                {t.customerTags}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {customer.tags.map(tag => {
                  const colors = TAG_COLORS[tag.color] || TAG_COLORS.blue;
                  return (
                    <span 
                      key={tag.id}
                      className={`${colors.bg} ${colors.text} ${colors.border} border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}
                    >
                      {tag.text}
                      <button 
                        onClick={() => handleRemoveTag(customer.id, tag.id)}
                        className="hover:opacity-50 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
              
              {/* 添加标签 */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  {Object.keys(TAG_COLORS).map(color => (
                    <button 
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        newTagColor === color ? 'border-gray-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ 
                        backgroundColor: color === 'yellow' ? '#fef08a' 
                          : color === 'red' ? '#fecaca' 
                          : color === 'green' ? '#bbf7d0' 
                          : color === 'purple' ? '#e9d5ff' 
                          : '#bfdbfe' 
                      }} 
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={t.addTag}
                    className="flex-1 p-2 bg-gray-50 rounded-lg text-sm outline-none border focus:border-blue-500"
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddTag(customer.id);
                    }}
                  />
                  <button 
                    onClick={() => handleAddTag(customer.id)}
                    className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* 内部备注 */}
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                <FileText className="w-3 h-3" />
                {t.internalNotes}
              </div>
              {isEditingCustomer ? (
                <textarea
                  value={editingCustomerData?.notes || ''}
                  onChange={(e) => setEditingCustomerData(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={t.notes}
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 min-h-[60px]">
                  {customer.notes || '-'}
                </div>
              )}
            </div>
          </div>
          
          {/* 删除按钮 */}
          {isEditingCustomer && (
            <div className="px-4 pb-4">
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="w-full p-3 text-red-600 bg-red-50 rounded-xl font-medium hover:bg-red-100 flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {t.deleteCustomer}
              </button>
            </div>
          )}
        </div>
        
        {/* 预约历史 */}
        {customerBookings.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="text-xs font-bold text-gray-500 uppercase mb-3">
              {lang === 'zh' ? '预约历史' : 'Booking History'}
            </div>
            <div className="space-y-2">
              {customerBookings.map(booking => {
                const pkg = packages.find(p => p.id === booking.packageId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{pkg ? getPackageName(pkg) : booking.packageId}</div>
                      <div className="text-xs text-gray-500">{booking.date} • {booking.time}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${booking.total}</div>
                      <div className={`text-[10px] font-medium px-2 py-0.5 rounded ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // ============================================================
  // 渲染: 设置页面
  // ============================================================
  
  const renderSettings = () => (
    <div className="space-y-4">
      {/* 商家设置 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-500" />
          {t.businessSettings}
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">Business Name (EN)</label>
            <input
              type="text"
              value={merchantSettings.businessName}
              onChange={(e) => setMerchantSettings(prev => ({ ...prev, businessName: e.target.value }))}
              className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">商家名称 (中文)</label>
            <input
              type="text"
              value={merchantSettings.businessNameZh}
              onChange={(e) => setMerchantSettings(prev => ({ ...prev, businessNameZh: e.target.value }))}
              className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>
      
      {/* 价格规则 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-800 mb-4">{t.pricingRules}</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">{t.suvSurcharge}</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={merchantSettings.suvSurcharge}
                onChange={(e) => setMerchantSettings(prev => ({ ...prev, suvSurcharge: Number(e.target.value) }))}
                className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-medium block mb-1">{t.truckSurcharge}</label>
            <div className="flex items-center gap-1">
              <span className="text-gray-400">$</span>
              <input
                type="number"
                value={merchantSettings.truckSurcharge}
                onChange={(e) => setMerchantSettings(prev => ({ ...prev, truckSurcharge: Number(e.target.value) }))}
                className="w-full p-2 bg-gray-50 rounded-lg text-sm border focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* 套餐管理 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">{t.packageManagement}</h3>
          <button
            onClick={() => setShowAddPackage(true)}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t.addPackage}
          </button>
        </div>
        
        <div className="space-y-2">
          {packages.map(pkg => (
            <div key={pkg.id} className="border border-gray-100 rounded-lg p-3">
              {editingPackageId === pkg.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={pkg.name}
                    onChange={(e) => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, name: e.target.value } : p))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="Name (EN)"
                  />
                  <input
                    type="text"
                    value={pkg.nameZh}
                    onChange={(e) => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, nameZh: e.target.value } : p))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="名称 (中文)"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={pkg.price}
                      onChange={(e) => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, price: Number(e.target.value) } : p))}
                      className="p-2 bg-gray-50 rounded text-sm border"
                      placeholder="Price"
                    />
                    <input
                      type="number"
                      value={pkg.duration}
                      onChange={(e) => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, duration: Number(e.target.value) } : p))}
                      className="p-2 bg-gray-50 rounded text-sm border"
                      placeholder="Duration"
                    />
                  </div>
                  <textarea
                    value={pkg.desc}
                    onChange={(e) => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, desc: e.target.value } : p))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="Description (EN)"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingPackageId(null)}
                      className="px-3 py-1 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSavePackage(pkg.id, pkg)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{pkg.name}</span>
                      <span className="text-xs text-gray-400">{pkg.nameZh}</span>
                    </div>
                    <div className="text-sm text-gray-500">${pkg.price} • {pkg.duration}min</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, active: !p.active } : p))}
                      className={`px-2 py-1 rounded text-xs font-medium ${pkg.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {pkg.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => setEditingPackageId(pkg.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 添加套餐表单 */}
        {showAddPackage && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-sm font-medium text-blue-800 mb-3">{t.addPackage}</div>
            <div className="space-y-2">
              <input
                type="text"
                value={newPackage.name || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="Name (EN)"
              />
              <input
                type="text"
                value={newPackage.nameZh || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, nameZh: e.target.value }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="名称 (中文)"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  value={newPackage.price || ''}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="p-2 bg-white rounded text-sm border"
                  placeholder="Price ($)"
                />
                <input
                  type="number"
                  value={newPackage.duration || ''}
                  onChange={(e) => setNewPackage(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="p-2 bg-white rounded text-sm border"
                  placeholder="Duration (min)"
                />
              </div>
              <textarea
                value={newPackage.desc || ''}
                onChange={(e) => setNewPackage(prev => ({ ...prev, desc: e.target.value }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="Description (EN)"
                rows={2}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddPackage(false); setNewPackage({}); }}
                  className="px-3 py-1 text-gray-500 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPackage}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* 附加服务管理 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">{t.addonManagement}</h3>
          <button
            onClick={() => setShowAddAddon(true)}
            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"
          >
            <Plus className="w-4 h-4" />
            {t.addAddon}
          </button>
        </div>
        
        <div className="space-y-2">
          {addons.map(addon => (
            <div key={addon.id} className="border border-gray-100 rounded-lg p-3">
              {editingAddonId === addon.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, name: e.target.value } : a))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="Name (EN)"
                  />
                  <input
                    type="text"
                    value={addon.nameZh}
                    onChange={(e) => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, nameZh: e.target.value } : a))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="名称 (中文)"
                  />
                  <input
                    type="number"
                    value={addon.price}
                    onChange={(e) => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, price: Number(e.target.value) } : a))}
                    className="w-full p-2 bg-gray-50 rounded text-sm border"
                    placeholder="Price"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingAddonId(null)}
                      className="px-3 py-1 text-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveAddon(addon.id, addon)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{addon.name}</span>
                      <span className="text-xs text-gray-400">{addon.nameZh}</span>
                    </div>
                    <div className="text-sm text-gray-500">${addon.price}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAddons(prev => prev.map(a => a.id === addon.id ? { ...a, active: !a.active } : a))}
                      className={`px-2 py-1 rounded text-xs font-medium ${addon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {addon.active ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => setEditingAddonId(addon.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddon(addon.id)}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* 添加附加服务表单 */}
        {showAddAddon && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="text-sm font-medium text-blue-800 mb-3">{t.addAddon}</div>
            <div className="space-y-2">
              <input
                type="text"
                value={newAddon.name || ''}
                onChange={(e) => setNewAddon(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="Name (EN)"
              />
              <input
                type="text"
                value={newAddon.nameZh || ''}
                onChange={(e) => setNewAddon(prev => ({ ...prev, nameZh: e.target.value }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="名称 (中文)"
              />
              <input
                type="number"
                value={newAddon.price || ''}
                onChange={(e) => setNewAddon(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full p-2 bg-white rounded text-sm border"
                placeholder="Price ($)"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowAddAddon(false); setNewAddon({}); }}
                  className="px-3 py-1 text-gray-500 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAddon}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  // ============================================================
  // 主渲染
  // ============================================================
  
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {renderNav()}
      
      {isOwnerMode && renderOwnerNav()}
      
      <main className="max-w-md mx-auto p-4">
        {showLogin && renderLogin()}
        
        {!isOwnerMode && renderCustomerBooking()}
        
        {isOwnerMode && (
          <>
            {selectedCustomerId ? (
              renderCustomerDetail()
            ) : (
              <>
                {ownerTab === 'calendar' && renderCalendar()}
                {ownerTab === 'customers' && renderCustomerList()}
                {ownerTab === 'settings' && renderSettings()}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}