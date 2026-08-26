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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-obsidian-dark border border-charcoal-light rounded-2xl max-w-sm w-full p-6 shadow-2xl relative space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-textMuted hover:text-white hover:bg-charcoal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="font-heading font-black text-xl text-white">Payment Successful</h3>
          <p className="text-xs font-mono text-emerald-400">Order {order.orderNumber} • {order.paymentMethod}</p>
        </div>

        {/* Thermal Receipt Paper Visual */}
        <div className="bg-[#1C2636] p-5 rounded-xl border border-charcoal-light font-mono text-xs text-textPrimary space-y-3 shadow-inner">
          
          <div className="text-center border-b border-charcoal-light pb-2">
            <div className="font-heading font-black text-sm text-white">WASTE2MENU KITCHEN #4</div>
            <div className="text-[10px] text-textMuted">Brigade Gateway Plaza, Bangalore</div>
            <div className="text-[10px] text-textMuted mt-0.5">
              {new Date(order.timestamp).toLocaleTimeString()} • Cashier: {order.cashierName}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2 py-2 border-b border-charcoal-light">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-start">
                <div className="pr-2">
                  <div className="font-semibold text-white flex items-center gap-1">
                    <span>{item.quantity}x {item.title}</span>
                  </div>
                  {item.isSpecial && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      ★ Upcycled Daily Special
                    </span>
                  )}
                </div>
                <span className="font-bold text-white shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-textMuted">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-textMuted">
              <span>GST / Tax (0% Zero-Waste Disc.):</span>
              <span>₹0.00</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-charcoal-light">
              <span>Total Paid ({order.paymentMethod}):</span>
              <span className="text-emerald-400">₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* ESG Badge */}
          {upcycledItemsCount > 0 && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
              <div className="flex items-center justify-center space-x-1 text-emerald-400 font-bold text-[11px]">
                <Leaf className="w-3.5 h-3.5" />
                <span>Zero-Food-Waste Impact Verified</span>
              </div>
              <div className="text-[9px] text-textMuted">
                This order diverted ~{(upcycledItemsCount * 0.25).toFixed(2)} kg prep scraps from landfill.
              </div>
            </div>
          )}

          {/* Simulated QR Code Barcode */}
          <div className="text-center pt-1">
            <div className="h-6 w-full bg-[repeating-linear-gradient(90deg,#94A3B8_0px,#94A3B8_2px,transparent_2px,transparent_4px)] opacity-50" />
            <div className="text-[9px] text-textMuted mt-1">Scan for Digital ESG Tax Invoice</div>
          </div>

        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-1">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-3 rounded-xl bg-charcoal hover:bg-charcoal-lighter text-white border border-charcoal-light font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian font-bold text-xs shadow-glow-emerald transition-all"
          >
            New Order
          </button>
        </div>

      </div>
    </div>
  );
};
