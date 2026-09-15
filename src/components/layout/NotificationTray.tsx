import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Bell, 
  Sparkles, 
  Trash2, 
  ChefHat, 
  CreditCard, 
  HeartHandshake, 
  UtensilsCrossed, 
  AlertTriangle,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AppNotification } from '../../types';

interface NotificationTrayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationTray: React.FC<NotificationTrayProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useAppStore();

  if (!isOpen) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'scrap_scanned':
        return <UtensilsCrossed className="w-4 h-4 text-emerald-400" />;
      case 'recipe_unlocked':
      case 'pos_pushed':
        return <ChefHat className="w-4 h-4 text-violet-400" />;
      case 'pos_ordered':
        return <CreditCard className="w-4 h-4 text-emerald-400" />;
      case 'stock_depleted':
        return <AlertTriangle className="w-4 h-4 text-coral" />;
      case 'flash_markdown':
        return <Zap className="w-4 h-4 text-amber" />;
      case 'ngo_broadcast':
      case 'ngo_claimed':
      case 'ngo_verified':
        return <HeartHandshake className="w-4 h-4 text-violet-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/40 backdrop-blur-xs transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FFFDF9] border-l border-[#E8DFD1] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8DFD1] flex items-center justify-between bg-[#FAF7F2]">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base text-stone-900">Live Event Ledger</h2>
                <p className="text-xs text-stone-500 font-mono">Cross-portal WebSocket stream</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-xs flex items-center space-x-1"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-stone-400">
                <CheckCircle2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-stone-600">All caught up!</p>
                <p className="text-xs text-stone-400 mt-1">Events from Kitchen, KDS, POS & NGO will stream here live.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs ${
                    notif.read
                      ? 'bg-stone-50 border-[#E8DFD1] opacity-75'
                      : 'bg-[#FAF7F2] border-[#E8DFD1] hover:border-emerald-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-white border border-[#E8DFD1] shrink-0 mt-0.5 shadow-xs">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{notif.title}</h4>
                        <span className="text-[10px] font-mono text-stone-400 shrink-0 ml-2">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-[#E8DFD1] bg-[#FAF7F2] text-center">
            <span className="text-[11px] text-stone-500 font-mono">
              Events are synced across Kitchen, KDS, POS, and NGO stations.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
