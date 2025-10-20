import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Invoice, Customer } from '../../types';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (invoiceData: Omit<Invoice, 'id'>) => void;
  customers: Customer[];
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'registrationDate'>) => Customer;
}

const AddInvoiceModal: React.FC<AddInvoiceModalProps> = ({ isOpen, onClose, onAdd, customers, onAddCustomer }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelectedCustomerId('');
      setNewCustomerName('');
      setAmount('');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setDueDate('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNewCustomer = selectedCustomerId === 'new';
    
    if ((!isNewCustomer && !selectedCustomerId) || (isNewCustomer && !newCustomerName.trim()) || !amount || !issueDate || !dueDate) {
        alert("يرجى ملء جميع الحقول");
        return;
    }
    
    let customerForInvoice: { id: string, name: string };

    if (isNewCustomer) {
        const newCustomer = onAddCustomer({
            name: newCustomerName.trim(),
            contactPerson: 'غير محدد',
            email: 'غير محدد',
            phone: 'غير محدد'
        });
        customerForInvoice = { id: newCustomer.id, name: newCustomer.name };
    } else {
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
        if (!selectedCustomer) {
            alert("العميل المحدد غير صالح.");
            return;
        }
        customerForInvoice = { id: selectedCustomer.id, name: selectedCustomer.name };
    }

    const invoiceData: Omit<Invoice, 'id'> = {
        customerId: customerForInvoice.id,
        customerName: customerForInvoice.name,
        amount: parseFloat(amount),
        issueDate,
        dueDate,
        status: 'مستحقة'
    };

    onAdd(invoiceData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة فاتورة جديدة">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-slate-700 mb-1">العميل</label>
          <select
            id="customer"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>-- اختر عميلاً --</option>
            {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
            <option value="new">-- إضافة عميل جديد --</option>
          </select>
        </div>

        {selectedCustomerId === 'new' && (
             <div>
                <label htmlFor="newCustomerName" className="block text-sm font-medium text-slate-700 mb-1">اسم العميل الجديد</label>
                <input
                    type="text"
                    id="newCustomerName"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="أدخل اسم العميل الجديد"
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

export default AddInvoiceModal;