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
      <div className="glass-panel rounded-2xl p-5 border border-charcoal-light flex flex-col h-full justify-between">
        
        {/* Receipt Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-charcoal-light">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-white text-base">Current Order Receipt</h3>
                <span className="text-[10px] font-mono text-textMuted">Terminal: POS-01 (Table / Takeout)</span>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 rounded-lg text-textMuted hover:text-coral hover:bg-charcoal transition-all text-xs flex items-center space-x-1"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Item List */}
          <div className="mt-4 space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-14 text-textMuted">
                <ShoppingCart className="w-10 h-10 text-charcoal-light mx-auto mb-2" />
                <p className="text-xs font-semibold">Cart is empty</p>
                <p className="text-[11px] text-textMuted mt-1">Tap dishes on the menu to add to this ticket.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-charcoal border border-charcoal-light flex items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white truncate">{item.title}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        ₹{item.price.toFixed(2)}
                      </span>
                      {item.isSpecial && (
                        <span className="text-[9px] font-mono px-1 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          Special
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Steppers */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-lg bg-obsidian border border-charcoal-light flex items-center justify-center text-textMuted hover:text-white"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold text-white w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-lg bg-obsidian border border-charcoal-light flex items-center justify-center text-textMuted hover:text-white"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="font-mono text-xs font-black text-white w-14 text-right">
                    ₹{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer: Totals, Payment Method & Charge Button */}
        <div className="mt-4 pt-4 border-t border-charcoal-light space-y-4">
          
          {/* Payment Method Selector */}
          <div>
            <span className="text-[10px] font-mono text-textMuted uppercase block mb-1.5">
              Payment Method
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`flex items-center justify-center space-x-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/30'
                    : 'bg-charcoal border-charcoal-light text-textMuted hover:text-white'
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
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/30'
                    : 'bg-charcoal border-charcoal-light text-textMuted hover:text-white'
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
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-glow-emerald/30'
                    : 'bg-charcoal border-charcoal-light text-textMuted hover:text-white'
                }`}
              >
                <Banknote className="w-3.5 h-3.5" />
                <span>Cash</span>
              </button>
            </div>
          </div>

          {/* Subtotal & Total */}
          <div className="bg-obsidian/90 p-3.5 rounded-xl border border-charcoal-light space-y-1 text-xs font-mono">
            <div className="flex justify-between text-textMuted">
              <span>Total Items:</span>
              <span>{totalItems} units</span>
            </div>
            <div className="flex justify-between text-textMuted">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1.5 border-t border-charcoal-light">
              <span className="font-heading font-black">Total Payable:</span>
              <span className="text-emerald-400 font-heading font-black text-base">₹{subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Charge Button */}
          <button
            onClick={handleCharge}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-heading font-black text-sm transition-all transform active:scale-98 flex items-center justify-center space-x-2 ${
              cart.length > 0
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-obsidian shadow-glow-emerald'
                : 'bg-charcoal text-textMuted border border-charcoal-light cursor-not-allowed opacity-50'
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
