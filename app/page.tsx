"use client";

import React, { useState } from 'react';
import { CloudRain, DollarSign, Calendar, Tag, Trash2, Plus, User, Lock, ChevronRight } from 'lucide-react';

export default function MobileDetailingSaaS() {
  // --- 状态管理 (相当于 App 的内存) ---
  
  // 1. 视图控制：默认是 'customer' (客户), 只有登录后才能变 'owner' (老板)
  const [viewMode, setViewMode] = useState('customer'); 
  const [passwordInput, setPasswordInput] = useState('');
  const [showLogin, setShowLogin] = useState(false);

  // 2. 品牌名称 (你可以随时在这里改)
  const brandName = "Ruiyu Auto Spa";

  // 3. 客户表单数据
  const [customerForm, setCustomerForm] = useState({
    name: '',
    phone: '',
    notes: '' // 新增：客户备注
  });

  // 4. 老板视角的标签系统 (现在是动态数组了，可以增删)
  const [tags, setTags] = useState([
    { id: 1, text: 'VIP 客户', color: 'bg-yellow-100 text-yellow-800' },
    { id: 2, text: '周更用户', color: 'bg-blue-100 text-blue-800' },
    { id: 3, text: '内饰洁癖', color: 'bg-purple-100 text-purple-800' }
  ]);
  const [newTagText, setNewTagText] = useState('');

  // --- 功能函数 ---

  // 客户提交预约
  const handleBooking = () => {
    if (!customerForm.name || !customerForm.phone) {
      alert("请填写姓名和电话");
      return;
    }
    alert(`预约成功！\n姓名: ${customerForm.name}\n电话: ${customerForm.phone}\n备注: ${customerForm.notes || '无'}\n\n(模拟：数据已发送给老板)`);
    setCustomerForm({ name: '', phone: '', notes: '' }); // 清空表单
  };

  // 老板登录逻辑
  const handleLogin = () => {
    if (passwordInput === '8888') { // 简单的模拟密码
      setViewMode('owner');
      setShowLogin(false);
      setPasswordInput('');
    } else {
      alert("密码错误 (提示: 试视 8888)");
    }
  };

  // 标签管理：添加标签
  const handleAddTag = () => {
    if (!newTagText.trim()) return;
    const newTag = {
      id: Date.now(), // 用时间戳做唯一ID
      text: newTagText,
      color: 'bg-gray-100 text-gray-800' // 默认灰色，以后可以做颜色选择
    };
    setTags([...tags, newTag]); // 把新标签加入数组
    setNewTagText('');
  };

  // 标签管理：删除标签
  const handleDeleteTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id)); // 留下ID不等于被删ID的标签
  };

  // --- 界面渲染 ---

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 顶部导航 */}
      <nav className="flex justify-between items-center p-4 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
        <div className="text-xl font-black tracking-tighter text-blue-600">{brandName}</div>
        
        {/* 如果是老板模式，显示退出按钮 */}
        {viewMode === 'owner' && (
          <button 
            onClick={() => setViewMode('customer')}
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            退出管理
          </button>
        )}
      </nav>

      <main className="max-w-md mx-auto p-6 pb-24">
        
        {/* --- 视图 A: 客户预约界面 --- */}
        {viewMode === 'customer' && !showLogin && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-extrabold text-gray-900">让爱车焕然一新</h1>
              <p className="text-gray-500">专业上门洗车服务，风雨无阻。</p>
            </div>

            {/* 模拟套餐卡片 (你的想法：套餐绑定) */}
            <div className="p-4 rounded-2xl border-2 border-blue-500 bg-blue-50 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg">新人特惠</div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">标准精洗套餐</span>
                <span className="text-2xl font-black text-blue-600">$45</span>
              </div>
              <ul className="text-sm text-gray-600 space-y-1 mb-4">
                <li>• 全车泡沫清洗 & 镀膜</li>
                <li>• 内饰深度吸尘</li>
                <li>• 轮胎轮毂养护</li>
              </ul>
            </div>

            {/* 预约表单 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">您的称呼</label>
                <input 
                  type="text" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="例如: Alex Li"
                  value={customerForm.name}
                  onChange={e => setCustomerForm({...customerForm, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">联系电话</label>
                <input 
                  type="tel" 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="647-555-0123"
                  value={customerForm.phone}
                  onChange={e => setCustomerForm({...customerForm, phone: e.target.value})}
                />
              </div>

              {/* 新增：客户备注功能 */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">备注需求 (选填)</label>
                <textarea 
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={3}
                  placeholder="例如: 后备箱有很多杂物请勿清理..."
                  value={customerForm.notes}
                  onChange={e => setCustomerForm({...customerForm, notes: e.target.value})}
                />
              </div>

              <button 
                onClick={handleBooking}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transform active:scale-95 transition-all shadow-xl"
              >
                立即预约
              </button>
            </div>

            {/* 底部：老板登录入口 */}
            <div className="pt-10 text-center">
              <button 
                onClick={() => setShowLogin(true)}
                className="text-xs text-gray-300 hover:text-gray-500 flex items-center justify-center mx-auto gap-1"
              >
                <Lock className="w-3 h-3" /> 店主入口
              </button>
            </div>
          </div>
        )}

        {/* --- 视图 B: 登录界面 (模拟) --- */}
        {showLogin && (
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-2xl animate-in zoom-in duration-300">
            <h2 className="text-xl font-bold mb-4 text-center">店主验证</h2>
            <input 
              type="password" 
              placeholder="输入密码 (8888)"
              className="w-full p-3 mb-4 rounded-xl border"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={() => setShowLogin(false)} className="flex-1 p-3 rounded-xl bg-gray-200 font-bold text-gray-600">取消</button>
              <button onClick={handleLogin} className="flex-1 p-3 rounded-xl bg-blue-600 text-white font-bold">进入后台</button>
            </div>
          </div>
        )}

        {/* --- 视图 C: 老板后台 (CRM) --- */}
        {viewMode === 'owner' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">今日概览</h1>
                <p className="text-sm text-gray-500">欢迎回来, Boss.</p>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <CloudRain className="w-4 h-4" /> 适合洗车
              </div>
            </div>

            {/* CRM 核心功能：客户标签管理 */}
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" /> 客户标签库 (可编辑)
              </h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map(tag => (
                  <span key={tag.id} className={`${tag.color} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                    {tag.text}
                    {/* 删除标签按钮 */}
                    <button onClick={() => handleDeleteTag(tag.id)} className="hover:text-red-600 ml-1">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* 添加标签 */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="输入新标签..."
                  className="flex-1 p-2 bg-gray-50 rounded-lg text-sm outline-none border focus:border-blue-500"
                  value={newTagText}
                  onChange={e => setNewTagText(e.target.value)}
                />
                <button 
                  onClick={handleAddTag}
                  className="bg-black text-white px-3 py-2 rounded-lg text-sm font-bold flex items-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 模拟的今日预约列表 */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800">待服务客户 (3)</h3>
              
              {/* 卡片 1 */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all cursor-pointer">
                <div>
                  <div className="font-bold text-gray-900">Mike Ross (Tesla Model 3)</div>
                  <div className="text-xs text-gray-500 mt-1">预约时间: 2:00 PM</div>
                  <div className="mt-2 flex gap-1">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-bold">VIP 客户</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px]">备注: 有狗毛</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
              </div>

               {/* 卡片 2 */}
               <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center group hover:border-blue-300 transition-all cursor-pointer">
                <div>
                  <div className="font-bold text-gray-900">Sarah Jen (BMW X5)</div>
                  <div className="text-xs text-gray-500 mt-1">预约时间: 4:30 PM</div>
                  <div className="mt-2">
                     <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">周更用户</span>
                  </div>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}