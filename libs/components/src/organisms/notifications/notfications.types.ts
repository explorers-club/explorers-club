export type NotificationType = 'error' | 'info' | 'success' | 'warning';

export type NotificationOptions = {
  type: NotificationType;
  dismissable?: boolean;
  autoHide?: boolean;
  autoHideMs?: number;
  primaryCtaLabel?: string;
  primaryCtaCallback?: () => void;
};
