import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  KeyRound, 
  Delete, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  HeartHandshake,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const CashierOtpKeypad: React.FC = () => {
  const { verifyNgoOtp, ngoBatches } = useAppStore();
  const [pin, setPin] = useState<string>('');
  const [resultMessage, setResultMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDigitPress = (digit: string) => {
    if (pin.length < 6) {
      sounds.playPosTap();
      const nextPin = pin + digit;
      setPin(nextPin);
      setResultMessage(null);

      // Auto verify when 6 digits are reached
      if (nextPin.length === 6) {
        verifyCode(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    sounds.playPosTap();
    setPin(pin.slice(0, -1));
    setResultMessage(null);
  };

  const handleClear = () => {
    sounds.playPosTap();
    setPin('');
    setResultMessage(null);
  };

  const verifyCode = (codeToVerify: string) => {
    const res = verifyNgoOtp(codeToVerify);
    if (res.success) {
      setResultMessage({ type: 'success', text: res.message });
      setPin('');
    } else {
      setResultMessage({ type: 'error', text: res.message });
    }
  };

  // Find claimed batches for quick tester reference
  const claimedBatches = ngoBatches.filter((b) => b.status === 'claimed');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-charcoal-light flex flex-col items-center justify-between max-w-md mx-auto w-full">
      
      {/* Header */}
      <div className="text-center space-y-1 w-full pb-4 border-b border-charcoal-light">
        <div className="w-12 h-12 rounded-xl bg-violet-500/20 border border-violet-500/40 text-violet-400 mx-auto flex items-center justify-center mb-2 shadow-glow-violet/30">
          <KeyRound className="w-6 h-6" />
        </div>
        <h3 className="font-heading font-black text-lg text-white">
          Cashier Handover OTP Verification
        </h3>
        <p className="text-xs text-textMuted font-mono">
          Enter the 6-digit PIN presented by the NGO Pickup Volunteer.
        </p>
      </div>

      {/* 6 Digit Display Boxes */}
      <div className="my-5 w-full">
        <div className="flex items-center justify-center space-x-2.5">
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const char = pin[index] || '';
            return (
              <div
                key={index}
                className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl border flex items-center justify-center font-heading font-black text-2xl transition-all ${
                  char
                    ? 'bg-charcoal border-emerald-400 text-emerald-400 shadow-glow-emerald/40'
                    : 'bg-obsidian-dark border-charcoal-light text-textMuted'
                }`}
              >
                {char || '•'}
              </div>
            );
          })}
        </div>

        {/* Feedback Message */}
        {resultMessage && (
          <div className={`mt-3 p-3 rounded-xl text-xs font-mono flex items-center space-x-2 ${
            resultMessage.type === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-coral/20 text-coral border border-coral/40 animate-pulse'
          }`}>
            {resultMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-coral shrink-0" />
            )}
            <span className="leading-tight">{resultMessage.text}</span>
          </div>
        )}
      </div>

      {/* Touch PIN Keypad */}
      <div className="w-full max-w-xs space-y-2">
        
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigitPress(digit)}
              className="h-12 rounded-xl bg-charcoal hover:bg-charcoal-lighter active:bg-violet-600 text-white font-heading font-bold text-lg border border-charcoal-light shadow-sm transition-all transform active:scale-95 flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          
          {/* Bottom row: Clear, 0, Backspace */}
          <button
            onClick={handleClear}
            className="h-12 rounded-xl bg-charcoal/50 hover:bg-charcoal text-textMuted hover:text-white border border-charcoal-light flex items-center justify-center text-xs font-mono font-bold"
            title="Clear"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleDigitPress('0')}
            className="h-12 rounded-xl bg-charcoal hover:bg-charcoal-lighter active:bg-violet-600 text-white font-heading font-bold text-lg border border-charcoal-light shadow-sm transition-all transform active:scale-95 flex items-center justify-center"
          >
            0
          </button>

          <button
            onClick={handleBackspace}
            className="h-12 rounded-xl bg-charcoal/50 hover:bg-charcoal text-textMuted hover:text-coral border border-charcoal-light flex items-center justify-center"
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Quick Tester Cheat Sheet (shows active claimed OTPs for immediate verification testing) */}
      {claimedBatches.length > 0 && (
        <div className="mt-5 w-full p-3 rounded-xl bg-obsidian-dark border border-charcoal-light/60 text-left">
          <div className="text-[10px] font-mono text-textMuted uppercase flex items-center justify-between mb-1">
            <span>Pending Claimed OTPs (Click to test):</span>
            <span className="text-emerald-400 font-bold">{claimedBatches.length} Ready</span>
          </div>
          <div className="space-y-1">
            {claimedBatches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setPin(b.pickupOtp);
                  verifyCode(b.pickupOtp);
                }}
                className="w-full text-left p-1.5 rounded bg-charcoal/70 hover:bg-charcoal-lighter border border-charcoal-light text-[11px] font-mono text-textPrimary flex items-center justify-between transition-colors"
              >
                <span className="truncate">{b.ngoName?.split(' ')[0]}: {b.dishName}</span>
                <span className="text-emerald-400 font-bold px-1.5 py-0.2 bg-emerald-500/10 rounded">
                  {b.pickupOtp}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
