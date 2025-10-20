import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Payable, Supplier } from '../../types';

interface AddPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (payableData: Omit<Payable, 'id'>) => void;
  suppliers: Supplier[];
  onAddSupplier: (supplierData: Omit<Supplier, 'id'>) => Supplier;
}

const AddPayableModal: React.FC<AddPayableModalProps> = ({ isOpen, onClose, onAdd, suppliers, onAddSupplier }) => {
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
        setSelectedSupplierId('');
        setNewSupplierName('');
        setAmount('');
        setIssueDate(new Date().toISOString().split('T')[0]);
        setDueDate('');
    }
  }, [isOpen]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNewSupplier = selectedSupplierId === 'new';

    if ((!isNewSupplier && !selectedSupplierId) || (isNewSupplier && !newSupplierName.trim()) || !amount || !issueDate || !dueDate) {
        alert("يرجى ملء جميع الحقول");
        return;
    }
    
    let supplierForPayable: { id: string, name: string };

    if (isNewSupplier) {
        const newSupplier = onAddSupplier({
            name: newSupplierName.trim(),
            contactPerson: 'غير محدد',
            email: 'غير محدد',
            phone: 'غير محدد'
        });
        supplierForPayable = { id: newSupplier.id, name: newSupplier.name };
    } else {
        const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
        if (!selectedSupplier) {
            alert("المورد المحدد غير صالح.");
            return;
        }
        supplierForPayable = { id: selectedSupplier.id, name: selectedSupplier.name };
    }

    onAdd({
        supplierId: supplierForPayable.id,
        supplierName: supplierForPayable.name,
        amount: parseFloat(amount),
        issueDate,
        dueDate,
        status: 'مستحقة'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة فاتورة مورد جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-slate-700 mb-1">المورد</label>
          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>-- اختر موردًا --</option>
            {suppliers.map(supplier => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            ))}
            <option value="new">-- إضافة مورد جديد --</option>
          </select>
        </div>

        {selectedSupplierId === 'new' && (
             <div>
                <label htmlFor="newSupplierName" className="block text-sm font-medium text-slate-700 mb-1">اسم المورد الجديد</label>
                <input
                    type="text"
                    id="newSupplierName"
                    value={newSupplierName}
                    onChange={(e) => setNewSupplierName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="أدخل اسم المورد الجديد"
                    required
                />
            </div>
        )}

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-1">المبلغ (ر.س)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="issueDate" className="block text-sm font-medium text-slate-700 mb-1">تاريخ الإصدار</label>
                <input
                    type="date"
                    id="issueDate"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 mb-1">تاريخ الاستحقاق</label>
                <input
                    type="date"
                    id="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
        </div>
        <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">إضافة الفاتورة</Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPayableModal;