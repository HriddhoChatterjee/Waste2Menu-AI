import React from 'react';
import { CompletedOrder } from '../../types';
import { X, Printer, CheckCircle2, Sparkles, Leaf, Share2 } from 'lucide-react';

interface ReceiptModalProps {
  order: CompletedOrder | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const upcycledItemsCount = order.items.filter((i) => i.isSpecial).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-sm flex justify-center items-start p-4 pt-24 sm:pt-28 pb-12">
      <div className="bg-[#FFFDF9] border border-[#E8DFD1] rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mx-auto flex items-center justify-center mb-2 shadow-xs">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-xl text-stone-900">Payment Successful</h3>
          <p className="text-xs font-mono text-emerald-700 font-semibold">Order {order.orderNumber} • {order.paymentMethod}</p>
        </div>

        {/* Thermal Receipt Paper Visual */}
        <div className="bg-[#FAF7F2] p-5 rounded-xl border border-[#E8DFD1] font-mono text-xs text-stone-800 space-y-3 shadow-inner">
          
          <div className="text-center border-b border-[#E8DFD1] pb-2">
            <div className="font-heading font-black text-sm text-stone-900">WASTE2MENU KITCHEN #4</div>
            <div className="text-[10px] text-stone-500">Brigade Gateway Plaza, Bangalore</div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              {new Date(order.timestamp).toLocaleTimeString()} • Cashier: {order.cashierName}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 py-2 border-b border-[#E8DFD1]">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="pr-2">
                  <div className="font-semibold text-stone-900 flex items-center gap-1">
                    <span>{item.quantity}x {item.title}</span>
                  </div>
                  {item.isSpecial && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-violet-100 text-violet-800 border border-violet-200">
                      ★ Upcycled Daily Special
                    </span>
                  )}
                </div>
                <span className="font-bold text-stone-900 shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-stone-500">
              <span>Subtotal:</span>
              <span className="text-stone-800">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>GST / Tax (0% Zero-Waste Disc.):</span>
              <span className="text-stone-800">₹0.00</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-[#E8DFD1]">
              <span>Total Paid ({order.paymentMethod}):</span>
              <span className="text-emerald-700 font-black">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* ESG Badge */}
          {upcycledItemsCount > 0 && (
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1 text-emerald-800 font-bold text-[11px]">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero-Food-Waste Impact Verified</span>
              </div>
              <div className="text-[9px] text-stone-600">
                This order diverted ~{(upcycledItemsCount * 0.25).toFixed(2)} kg prep scraps from landfill.
              </div>
            </div>
          )}

          {/* Simulated QR Code Barcode */}
          <div className="text-center pt-1">
            <div className="h-6 w-full bg-[repeating-linear-gradient(90deg,#78716C_0px,#78716C_2px,transparent_2px,transparent_4px)] opacity-40" />
            <div className="text-[9px] text-stone-500 mt-1">Scan for Digital ESG Tax Invoice</div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-700 border border-[#E8DFD1] font-bold text-xs flex items-center justify-center space-x-2 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-emerald-700" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
          >
            New Order
          </button>
        </div>

      </div>
    </div>
  );
};
