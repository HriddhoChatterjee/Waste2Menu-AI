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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-obsidian-dark border-l border-charcoal-light shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-5 border-b border-charcoal-light flex items-center justify-between bg-charcoal/50">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-base text-white">Live Event Ledger</h2>
                <p className="text-xs text-textMuted font-mono">Cross-portal WebSocket stream</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-2 rounded-lg text-textMuted hover:text-coral hover:bg-charcoal transition-colors text-xs flex items-center space-x-1"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-textMuted hover:text-white hover:bg-charcoal transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-textMuted">
                <CheckCircle2 className="w-12 h-12 text-charcoal-light mx-auto mb-3" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs text-textMuted mt-1">Events from Kitchen, KDS, POS & NGO will stream here live.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    notif.read
                      ? 'bg-charcoal/40 border-charcoal-light/40 opacity-70'
                      : 'bg-charcoal border-charcoal-light shadow-md hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-obsidian border border-charcoal-light shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                        <span className="text-[10px] font-mono text-textMuted shrink-0 ml-2">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-textMuted mt-1 leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="p-4 border-t border-charcoal-light bg-charcoal/30 text-center">
            <span className="text-[11px] text-textMuted font-mono">
              Events are synced across Kitchen, KDS, POS, and NGO stations.
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
