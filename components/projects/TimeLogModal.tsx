import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import type { TimeLog } from '../../types';

interface TimeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogTime: (timeLogData: Omit<TimeLog, 'id'>) => void;
  projectId: string;
}

const TimeLogModal: React.FC<TimeLogModalProps> = ({ isOpen, onClose, onLogTime, projectId }) => {
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [task, setTask] = useState('');
  const [userName, setUserName] = useState('أحمد محمود'); // Hardcoded for now

  useEffect(() => {
    if (isOpen) {
      setDate(new Date().toISOString().split('T')[0]);
      setHours('');
      setTask('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !hours || !task.trim() || !userName.trim()) {
      alert("يرجى ملء جميع الحقول.");
      return;
    }

    const hoursNumber = parseFloat(hours);
    if (isNaN(hoursNumber) || hoursNumber <= 0) {
        alert("يرجى إدخال عدد ساعات صحيح.");
        return;
    }
    
    onLogTime({
        projectId,
        date,
        hours: hoursNumber,
        task,
        userName,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تسجيل وقت عمل جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="userName" className="block text-sm font-medium text-slate-700 mb-1">اسم الموظف</label>
            <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"
                readOnly // Or make it a dropdown if there are multiple users
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-1">التاريخ</label>
                <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="hours" className="block text-sm font-medium text-slate-700 mb-1">عدد الساعات</label>
                <input
                    type="number"
                    id="hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    step="0.5"
                    min="0"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                />
            </div>
        </div>
        <div>
          <label htmlFor="task" className="block text-sm font-medium text-slate-700 mb-1">المهمة المنجزة</label>
          <textarea
            id="task"
            rows={3}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="مثال: اجتماع مع العميل لمناقشة المتطلبات."
            required
          />
        </div>
        
        <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="submit">تسجيل الوقت</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TimeLogModal;