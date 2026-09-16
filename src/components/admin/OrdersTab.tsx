import React, { useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types/cms';
import gsap from 'gsap';
import { CheckCircle, Clock, Truck, Package, XCircle } from 'lucide-react';

export const OrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useStore();
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (tableBodyRef.current) {
      gsap.fromTo(
        tableBodyRef.current.children,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-black">Order Fulfillment & Logistics</h2>
          <p className="text-xs text-gray-500 font-semibold mt-0.5">Manage customer purchases, shipping status, and tracking</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-extrabold">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Items</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Update Status</th>
              </tr>
            </thead>
            <tbody ref={tableBodyRef} className="divide-y divide-gray-100 font-medium">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/80">
                  <td className="py-3.5 px-4 font-mono font-bold text-black">{order.id}</td>
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-gray-900">{order.customerName}</p>
                    <p className="text-[10px] text-gray-400">{order.customerEmail}</p>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-bold">{order.items.length} items</td>
                  <td className="py-3.5 px-4 font-mono font-extrabold text-black">${order.totalAmount.toFixed(2)}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      order.fulfillmentStatus === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                      order.fulfillmentStatus === 'shipped' ? 'bg-sky-100 text-sky-800' :
                      order.fulfillmentStatus === 'processing' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.fulfillmentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={order.fulfillmentStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['fulfillmentStatus'])}
                      className="border border-gray-200 p-1.5 rounded text-xs font-bold focus:outline-none focus:border-black cursor-pointer uppercase"
                    >
                      <option value="unfulfilled">Unfulfilled</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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
