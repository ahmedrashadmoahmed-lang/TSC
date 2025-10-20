import React from 'react';
import type { TransactionStatus, OfferStatus, PurchaseOrderStatus, InventoryStatus } from '../../types';

type Status = TransactionStatus | OfferStatus | PurchaseOrderStatus | InventoryStatus;

interface StatusBadgeProps {
  status: Status;
}

const statusStyles: Record<Status, { bg: string; text: string; dot?: string; }> = {
  // Financial Statuses
  'مدفوعة': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'مستحقة': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  'متأخرة': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  
  // Offer Statuses
  'جديد': { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  'قيد التسعير': { bg: 'bg-cyan-100', text: 'text-cyan-800', dot: 'bg-cyan-500' },
  'مرسل': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'مقبول': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'مرفوض': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  'قيد التفاوض': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  'تحول لفاتورة': { bg: 'bg-indigo-100', text: 'text-indigo-800', dot: 'bg-indigo-500' },
  'تم إنشاء أمر شراء': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },

  // Purchase Order Statuses
  'مسودة': { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' },
  'مستلم جزئياً': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  'مستلم': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'ملغي': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },

  // Inventory Statuses
  'متوفر': { bg: 'bg-green-100', text: 'text-green-800' },
  'كمية قليلة': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  'نفذ المخزون': { bg: 'bg-red-100', text: 'text-red-800' },
};


const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const style = statusStyles[status];
    if (!style) {
        return null;
    }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      {style.dot && <span className={`w-2 h-2 ml-2 rounded-full ${style.dot}`}></span>}
      {status}
    </span>
  );
};

export default StatusBadge;