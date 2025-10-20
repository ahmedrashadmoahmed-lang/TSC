import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Customer, Communication } from '../../types';
import { Icon } from '../shared/Icon';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }) => void;
  customer: Customer | null;
  communications: Communication[];
}

const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, onSave, customer, communications = [] }) => {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setContactPerson(customer.contactPerson);
      setEmail(customer.email);
      setPhone(customer.phone);
    } else {
      // Reset form for new customer
      setName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
    }
  }, [customer, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contactPerson || !email) {
      alert("يرجى ملء الحقول الأساسية (الاسم، جهة الاتصال، البريد الإلكتروني).");
      return;
    }
    onSave({
      id: customer?.id,
      name,
      contactPerson,
      email,
      phone,
    });
  };

  const modalTitle = customer ? 'تعديل بيانات العميل' : 'إضافة عميل جديد';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-slate-700 mb-1">اسم الشركة</label>
          <input
            type="text"
            id="customerName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700 mb-1">جهة الاتصال الأساسية</label>
          <input
            type="text"
            id="contactPerson"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">رقم الهاتف</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {customer && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">سجل التواصل</h3>
            {communications.length > 0 ? (
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {communications.map(comm => (
                  <div key={comm.id} className="flex items-start gap-3 p-2 bg-slate-50 rounded-lg">
                    <Icon name={comm.type === 'Email' ? 'email' : 'whatsapp'} className="w-5 h-5 text-slate-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-700 text-sm">{comm.summary}</p>
                      <p className="text-xs text-slate-500">{comm.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">لا يوجد سجل تواصل لهذا العميل.</p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4 gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
          <Button type="submit">{customer ? 'حفظ التغييرات' : 'إضافة العميل'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomerModal;