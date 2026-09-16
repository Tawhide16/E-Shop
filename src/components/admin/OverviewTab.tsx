import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import gsap from 'gsap';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar 
} from 'lucide-react';

export const OverviewTab: React.FC = () => {
  const { orders, products, customers } = useStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '6m' | '1y'>('30d');
  
  const statsContainerRef = useRef<HTMLDivElement>(null);
  const chartPathRef = useRef<SVGPathElement>(null);
  const tableRowsRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    // Animate Stat Cards Stagger
    if (statsContainerRef.current) {
      gsap.fromTo(
        statsContainerRef.current.children,
        { opacity: 0, y: 20, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' }
      );
    }

    // Animate Chart Path Draw
    if (chartPathRef.current) {
      const pathLength = chartPathRef.current.getTotalLength();
      gsap.fromTo(
        chartPathRef.current,
        { strokeDasharray: pathLength, strokeDashoffset: pathLength },
        { strokeDashoffset: 0, duration: 1.2, ease: 'power2.out' }
      );
    }

    // Animate Table Rows
    if (tableRowsRef.current) {
      gsap.fromTo(
        tableRowsRef.current.children,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power1.out', delay: 0.2 }
      );
    }
  }, [timeRange]);

  const stats = [
    { title: 'Total Revenue', value: '$24,580', change: '+18.5%', isUp: true, icon: DollarSign },
    { title: 'Total Orders', value: '1,284', change: '+12.4%', isUp: true, icon: ShoppingBag },
    { title: 'Customers', value: '8,492', change: '+9.2%', isUp: true, icon: Users },
    { title: 'Active Products', value: `${products.length}`, change: 'In Stock', isUp: true, icon: Package },
    { title: 'Conversion Rate', value: '4.82%', change: '+1.4%', isUp: true, icon: TrendingUp },
    { title: 'Average Order Value', value: '$74.20', change: '+2.1%', isUp: true, icon: CreditCard }
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">E-Commerce Overview</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Real-time storefront performance and order analytics</p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg text-xs font-bold text-gray-700">
          {(['7d', '30d', '3m', '6m', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                timeRange === range ? 'bg-white text-black shadow-xs font-extrabold' : 'hover:text-black'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Large Stats Cards */}
      <div ref={statsContainerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-xl border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{stat.title}</span>
                <div className="p-2.5 bg-gray-50 text-black rounded-lg shadow-xs">
                  <Icon size={18} />
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-black text-black font-mono tracking-tight">{stat.value}</span>
                <span className={`text-xs font-extrabold flex items-center gap-0.5 ${stat.isUp ? 'text-emerald-600' : 'text-red-500'}`}>
                  {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue SVG Interactive Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">Revenue Trend</h3>
            <p className="text-xs text-gray-400 font-semibold">Daily sales overview ({timeRange})</p>
          </div>
          <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full animate-pulse">
            ● Live Sync
          </span>
        </div>

        <div className="h-56 w-full pt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
            {/* Grid lines */}
            <line x1="0" y1="30" x2="500" y2="30" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="#f3f4f6" strokeWidth="1" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="#f3f4f6" strokeWidth="1" />

            {/* Gradient Fill */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Smooth Area */}
            <path 
              d="M 0 120 C 60 90, 120 110, 180 50 C 240 30, 300 70, 360 40 C 420 20, 460 60, 500 30 L 500 140 L 0 140 Z" 
              fill="url(#chartGradient)" 
            />

            {/* Smooth Line with Ref for Animation */}
            <path 
              ref={chartPathRef}
              d="M 0 120 C 60 90, 120 110, 180 50 C 240 30, 300 70, 360 40 C 420 20, 460 60, 500 30" 
              fill="none" 
              stroke="#000000" 
              strokeWidth="3" 
            />

            {/* Data Points */}
            <circle cx="180" cy="50" r="4" fill="#000000" />
            <circle cx="360" cy="40" r="4" fill="#000000" />
            <circle cx="500" cy="30" r="4" fill="#000000" />
          </svg>
        </div>

        <div className="flex justify-between text-[11px] font-extrabold text-gray-400 font-mono pt-2 border-t border-gray-100">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-black uppercase tracking-wider">Recent Orders</h3>
          <span className="text-xs text-gray-500 font-semibold">{orders.length} orders total</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-400 uppercase font-extrabold">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody ref={tableRowsRef} className="divide-y divide-gray-100 font-medium">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 font-mono font-bold text-black">{order.id}</td>
                  <td className="py-3 px-2 font-bold text-gray-900">{order.customerName}</td>
                  <td className="py-3 px-2 text-gray-500">{order.date}</td>
                  <td className="py-3 px-2 font-bold text-black">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3 px-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      order.fulfillmentStatus === 'delivered' || order.fulfillmentStatus === 'shipped' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
