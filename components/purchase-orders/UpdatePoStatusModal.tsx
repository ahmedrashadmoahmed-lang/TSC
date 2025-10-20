import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { PurchaseOrder, PurchaseOrderStatus } from '../../types';

interface UpdatePoStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPo: PurchaseOrder) => void;
  purchaseOrder: PurchaseOrder;
}

const allStatuses: PurchaseOrderStatus[] = ['مسودة', 'مرسل', 'مستلم جزئياً', 'مستلم', 'ملغي'];

const UpdatePoStatusModal: React.FC<UpdatePoStatusModalProps> = ({ isOpen, onClose, onSave, purchaseOrder }) => {
  const [newStatus, setNewStatus] = useState<PurchaseOrderStatus>(purchaseOrder.status);

  useEffect(() => {
    if (isOpen) {
      setNewStatus(purchaseOrder.status);
    }
  }, [isOpen, purchaseOrder]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...purchaseOrder, status: newStatus });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`تحديث حالة أمر الشراء ${purchaseOrder.id}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="mb-2">المورد: <span className="font-semibold">{purchaseOrder.supplierName}</span></p>
          <p>الحالة الحالية: <span className="font-semibold">{purchaseOrder.status}</span></p>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">الحالة الجديدة</label>
          <select
            id="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as PurchaseOrderStatus)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {allStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div className="flex justify-end pt-4 gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
          <Button type="submit">حفظ التغييرات</Button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdatePoStatusModal;