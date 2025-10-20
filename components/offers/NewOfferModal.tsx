import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Offer, Customer } from '../../types';

interface NewOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (offerData: Omit<Offer, 'id' | 'status' | 'items' | 'totalSellingPrice'>) => void;
  customers: Customer[];
  onAddCustomer: (customerData: Omit<Customer, 'id' | 'registrationDate'>) => Customer;
}

const NewOfferModal: React.FC<NewOfferModalProps> = ({ isOpen, onClose, onAdd, customers, onAddCustomer }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [subject, setSubject] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');

  useEffect(() => {
    if (isOpen) {
        setSelectedCustomerId('');
        setNewCustomerName('');
        setSubject('');
        setIssueDate(new Date().toISOString().split('T')[0]);
        setValidUntil('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isNewCustomer = selectedCustomerId === 'new';
    
    if ((!isNewCustomer && !selectedCustomerId) || (isNewCustomer && !newCustomerName.trim()) || !subject || !issueDate || !validUntil) {
        alert("يرجى ملء جميع الحقول");
        return;
    }
    
    let customerForOffer: { id: string, name: string };

    if (isNewCustomer) {
        const newCustomer = onAddCustomer({
            name: newCustomerName.trim(),
            contactPerson: 'غير محدد',
            email: 'غير محدد',
            phone: 'غير محدد'
        });
        customerForOffer = { id: newCustomer.id, name: newCustomer.name };
    } else {
        const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
         if (!selectedCustomer) {
            alert("العميل المحدد غير صالح.");
            return;
        }
        customerForOffer = { id: selectedCustomer.id, name: selectedCustomer.name };
    }
    
    onAdd({
        customerName: customerForOffer.name,
        customerId: customerForOffer.id,
        subject,
        issueDate,
        validUntil,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إنشاء عرض سعر جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-slate-700 mb-1">العميل</label>
           <select
            id="customer"
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
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
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">الموضوع</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="مثال: عرض سعر لنظام نقاط البيع"
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
                <label htmlFor="validUntil" className="block text-sm font-medium text-slate-700 mb-1">صالح حتى تاريخ</label>
                <input
                    type="date"
                    id="validUntil"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
        </div>
        <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">إنشاء العرض</Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewOfferModal;