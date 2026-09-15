import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Sparkles, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';
import { CompletedOrder } from '../../types';

export const OrderReceipt: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, checkoutCart } = useAppStore();
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash'>('UPI');
  const [lastOrder, setLastOrder] = useState<CompletedOrder | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCharge = () => {
    if (cart.length === 0) return;
    const order = checkoutCart(paymentMethod, 'Aarav (POS-01)');
    if (order) {
      setLastOrder(order);
    }
  };

  return (
    <>
      <div className="bg-[#FFFDF9] rounded-2xl p-5 border border-[#E8DFD1] flex flex-col h-full justify-between shadow-sm">
        
        {/* Receipt Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1]">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-stone-900 text-base">Current Order Receipt</h3>
                <span className="text-[10px] font-mono text-stone-500">Terminal: POS-01 (Table / Takeout)</span>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-all text-xs flex items-center space-x-1"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-14 text-stone-400">
                <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-stone-600">Cart is empty</p>
                <p className="text-[11px] text-stone-400 mt-1">Tap dishes on the menu to add to this ticket.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-between gap-2 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-stone-900 truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-mono font-bold text-emerald-700">
                        ₹{item.price.toFixed(2)}
                      </span>
                      {item.isSpecial && (
                        <span className="text-[9px] font-mono px-1 rounded bg-violet-100 text-violet-800 border border-violet-200">
                          Special
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Steppers */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8DFD1] flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-stone-900 w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8DFD1] flex items-center justify-center text-stone-600 hover:text-stone-900 hover:bg-stone-50 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono text-xs font-black text-stone-900 w-14 text-right">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer: Totals, Payment Method & Charge Button */}
        <div className="mt-4 pt-4 border-t border-[#E8DFD1] space-y-4">
          
          {/* Payment Method Selector */}
          <div>
            <span className="text-[10px] font-mono text-stone-500 uppercase font-semibold block mb-1.5">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-100 border-emerald-600 text-emerald-900 shadow-xs font-black'
                    : 'bg-white border-[#E8DFD1] text-stone-600 hover:text-stone-900'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'Card'
                    ? 'bg-emerald-100 border-emerald-600 text-emerald-900 shadow-xs font-black'
                    : 'bg-white border-[#E8DFD1] text-stone-600 hover:text-stone-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'Cash'
                    ? 'bg-emerald-100 border-emerald-600 text-emerald-900 shadow-xs font-black'
                    : 'bg-white border-[#E8DFD1] text-stone-600 hover:text-stone-900'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash</span>
              </button>
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E8DFD1] space-y-1 text-xs font-mono">
            <div className="flex justify-between text-stone-500">
              <span>Total Items:</span>
              <span className="text-stone-800 font-semibold">{totalItems} units</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Subtotal:</span>
              <span className="text-stone-800 font-semibold">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-[#E8DFD1]">
              <span className="font-heading font-black">Total Payable:</span>
              <span className="text-emerald-700 font-heading font-black text-base">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Charge Button */}
          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-heading font-black text-sm transition-all transform active:scale-98 flex items-center justify-center space-x-2 ${
              cart.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                : 'bg-stone-200 text-stone-400 border border-[#E8DFD1] cursor-not-allowed opacity-60'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Charge ₹{subtotal.toFixed(2)} ({paymentMethod})</span>
          </button>

        </div>

      </div>

      {/* Printable Receipt Modal */}
      <ReceiptModal
        order={lastOrder}
        onClose={() => setLastOrder(null)}
      />
    </>
  );
};
