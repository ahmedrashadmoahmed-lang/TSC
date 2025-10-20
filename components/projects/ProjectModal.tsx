import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { Project, Customer, ProjectStatus } from '../../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Omit<Project, 'id'> & { id?: string }) => void;
  customers: Customer[];
  project: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSave, customers, project }) => {
  const [name, setName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('تخطيط');

  useEffect(() => {
    if (isOpen) {
      if (project) {
        setName(project.name);
        setCustomerId(project.customerId);
        setStatus(project.status);
      } else {
        setName('');
        setCustomerId('');
        setStatus('تخطيط');
      }
    }
  }, [isOpen, project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (!name.trim() || !customerId || !selectedCustomer) {
      alert("يرجى ملء جميع الحقول واختيار عميل صالح.");
      return;
    }
    
    onSave({
        id: project?.id,
        name,
        customerId,
        customerName: selectedCustomer.name,
        status,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project ? "تعديل مشروع" : "إضافة مشروع جديد"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-slate-700 mb-1">اسم المشروع</label>
          <input
            type="text"
            id="projectName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="customer" className="block text-sm font-medium text-slate-700 mb-1">العميل</label>
          <select
            id="customer"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          >
            <option value="" disabled>-- اختر عميلاً --</option>
            {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>
        
        <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">{project ? "حفظ التغييرات" : "إضافة المشروع"}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;