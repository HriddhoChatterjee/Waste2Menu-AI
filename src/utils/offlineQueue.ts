import { SurplusAlertPayload } from '../types';

const QUEUE_STORAGE_KEY = 'waste2menu_offline_surplus_queue';

/**
 * Get all queued surplus alerts waiting for network sync
 */
export function getQueuedAlerts(): SurplusAlertPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SurplusAlertPayload[];
  } catch (err) {
    console.error('Error reading offline surplus queue:', err);
    return [];
  }
}

/**
 * Enqueue a surplus alert when offline or dispatching locally
 */
export function enqueueSurplusAlert(alert: Omit<SurplusAlertPayload, 'id' | 'timestamp' | 'status'>): SurplusAlertPayload {
  const newAlert: SurplusAlertPayload = {
    ...alert,
    id: `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    status: 'queued'
  };

  try {
    const current = getQueuedAlerts();
    const updated = [newAlert, ...current];
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updated));

    // Attempt to register background sync if available
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((reg: any) => {
        return reg.sync.register('sync-surplus-alerts');
      }).catch((syncErr) => {
        console.warn('Background sync registration not available:', syncErr);
      });
    }
  } catch (err) {
    console.error('Error saving surplus alert to offline queue:', err);
  }

  return newAlert;
}

/**
 * Remove an alert from the queue once synced or handled
 */
export function removeQueuedAlert(id: string): void {
  try {
    const current = getQueuedAlerts();
    const filtered = current.filter(a => a.id !== id);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Error removing alert from queue:', err);
  }
}

/**
 * Mark status of an alert (e.g. shared_sms, shared_whatsapp, synced_online)
 */
export function updateAlertStatus(id: string, status: SurplusAlertPayload['status']): void {
  try {
    const current = getQueuedAlerts();
    const updated = current.map(a => a.id === id ? { ...a, status } : a);
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error updating alert status:', err);
  }
}

/**
 * Generate a 6-digit verification OTP for shelter driver handover
 */
export function generateHandoverOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Ultra-compact SMS / USSD string (< 100 bytes) for zero-data environments:
 * e.g. "SURPLUS: Rice Kanji | 12p | Pin: 600089 | OTP: 482910 | Waste2Menu"
 */
export function formatCompactSmsString(alert: SurplusAlertPayload): string {
  return `SURPLUS: ${alert.itemName} | ${alert.portions}p | ${alert.kitchenName} | Pin:${alert.locationPin} | OTP:${alert.otp} | Waste2Menu`;
}

/**
 * WhatsApp share URL with pre-filled message for community shelter groups
 */
export function getWhatsAppShareUrl(alert: SurplusAlertPayload): string {
  const text = encodeURIComponent(
    `🍲 *ZERO-COST COMMUNITY FOOD SURPLUS ALERT* 🍲\n\n` +
    `• *Item:* ${alert.itemName}\n` +
    `• *Available Portions:* ${alert.portions} meals\n` +
    `• *Kitchen / Vendor:* ${alert.kitchenName}\n` +
    `• *Location / PIN:* ${alert.locationPin}\n` +
    `• *Pickup Verification OTP:* ${alert.otp}\n\n` +
    `_Generated via Waste2Menu Community Kiosk (Offline-First)_`
  );
  return `https://wa.me/?text=${text}`;
}

/**
 * Native SMS deep-link (works completely offline with 0 internet connection)
 */
export function getNativeSmsUri(alert: SurplusAlertPayload): string {
  const body = encodeURIComponent(formatCompactSmsString(alert));
  return `sms:?body=${body}`;
}

/**
 * Trigger Web Share API if supported by the mobile browser/PWA
 */
export async function triggerWebShare(alert: SurplusAlertPayload): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Food Surplus Alert: ${alert.itemName}`,
        text: formatCompactSmsString(alert)
      });
      updateAlertStatus(alert.id, 'shared_sms');
      return true;
    } catch (err) {
      if ((err as any).name !== 'AbortError') {
        console.warn('Web Share failed, falling back to SMS link:', err);
      }
      return false;
    }
  }
  return false;
}
