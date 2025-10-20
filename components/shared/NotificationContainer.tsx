import React from 'react';
import { Icon } from './Icon';
import type { Notification } from '../../contexts/NotificationContext';

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const notificationStyles = {
  error: {
    bg: 'bg-red-100',
    border: 'border-red-500',
    text: 'text-red-700',
    iconName: 'info' as const,
    title: 'خطأ'
  },
  success: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-700',
    iconName: 'checkmark' as const,
    title: 'نجاح'
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    text: 'text-blue-700',
    iconName: 'info' as const,
    title: 'معلومة'
  }
};

const NotificationContainer: React.FC<NotificationContainerProps> = ({ notifications, removeNotification }) => {
  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3" aria-live="assertive">
        {notifications.map(notification => {
          const styles = notificationStyles[notification.type];
          return (
            <div
              key={notification.id}
              className={`flex items-start p-4 rounded-lg shadow-lg border-l-4 ${styles.bg} ${styles.border} animate-fade-in-right w-full max-w-sm`}
              role="alert"
            >
              <Icon name={styles.iconName} className={`w-6 h-6 ${styles.text} ml-3 flex-shrink-0 mt-0.5`} />
              <div className="flex-grow mr-2">
                <p className={`font-bold ${styles.text}`}>{styles.title}</p>
                <p className={`text-sm ${styles.text}`}>{notification.message}</p>
              </div>
              <button onClick={() => removeNotification(notification.id)} className={`mr-auto -mt-1 -mb-1 p-1 rounded-full hover:bg-black/10`} aria-label="إغلاق">
                  <Icon name="close" className={`w-5 h-5 ${styles.text}`} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default NotificationContainer;
