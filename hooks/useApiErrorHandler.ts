import { useNotification } from '../contexts/NotificationContext';
import { useCallback } from 'react';

const getFriendlyErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return 'حدث خطأ في المصادقة. يرجى التأكد من مفتاح API الخاص بك.';
        }
        if (error.name === 'TypeError' && error.message.toLowerCase().includes('failed to fetch')) {
            return 'حدث خطأ في الشبكة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.';
        }
        if (error.message.includes('429')) { // Too Many Requests
            return 'تم استلام عدد كبير جدًا من الطلبات. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.';
        }
         if (error.message.includes('500')) { // Server error
            return 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقًا.';
        }
         return 'عذرًا، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى لاحقًا.';
    }
    return 'حدث خطأ غير معروف.';
};

export const useApiErrorHandler = () => {
    const { addNotification } = useNotification();

    const handleError = useCallback((error: unknown, context: string) => {
        console.error(`API Error in ${context}:`, error); // Detailed logging for debugging
        const friendlyMessage = getFriendlyErrorMessage(error);
        addNotification(friendlyMessage, 'error');
    }, [addNotification]);
    
    return handleError;
};
