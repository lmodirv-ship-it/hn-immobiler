import { useAuth } from '@/hooks/useAuth';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';

/** Mounts realtime message subscription globally so users get toasts on any page. */
const NotificationBridge = () => {
  const { user } = useAuth();
  useUnreadMessages(user?.id);
  return null;
};

export default NotificationBridge;