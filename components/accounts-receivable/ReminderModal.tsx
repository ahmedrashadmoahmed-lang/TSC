import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { Invoice, Customer } from '../../types';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  customer: Customer;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, invoice, customer }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReminder = async () => {
    setIsLoading(true);
    setContent('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const isOverdue = new Date(invoice.dueDate) < new Date();
      const statusText = isOverdue ? 'متأخرة' : 'ستستحق قريباً';

      const prompt = `
        أنت مساعد محاسبة ودود ومحترف. مهمتك هي كتابة مسودة بريد إلكتروني لتذكير عميل بفاتورة ${statusText}.
        
        **تفاصيل الفاتورة:**
        - **العميل:** ${customer.name}
        - **جهة الاتصال:** ${customer.contactPerson}
        - **رقم الفاتورة:** ${invoice.id}
        - **المبلغ:** ${invoice.amount.toLocaleString()} ر.س
        - **تاريخ الاستحقاق:** ${invoice.dueDate}

        **المطلوب:**
        1.  اكتب مسودة بريد إلكتروني باللغة العربية.
        2.  استخدم عنوانًا واضحًا للبريد الإلكتروني (مثال: تذكير بخصوص الفاتورة رقم ${invoice.id}).
        3.  ابدأ بتحية مهذبة موجهة إلى ${customer.contactPerson}.
        4.  اذكر بلطف أن هذا تذكير بخصوص الفاتورة المذكورة أعلاه.
        5.  وضح المبلغ وتاريخ الاستحقاق.
        6.  إذا كانت الفاتورة متأخرة، اطلب تحديثًا عن حالة الدفع. إذا كانت ستستحق قريباً، اذكر أنها للمعلومية.
        7.  اختتم البريد الإلكتروني بشكل احترافي مع دعوة للتواصل في حال وجود أي استفسارات.

        اجعل النص مهذبًا ومباشرًا.
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      setContent(response.text);

    } catch (error) {
      console.error("Error generating AI reminder:", error);
      setContent('عذرًا، حدث خطأ أثناء إنشاء التذكير. يرجى المحاولة مرة أخرى أو كتابة الرسالة يدويًا.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleGenerateReminder();
    }
  }, [isOpen, invoice.id]); // Re-generate if a different invoice is selected while modal is conceptually open

  const handleSend = () => {
    alert(`تم إرسال تذكير بالبريد الإلكتروني إلى ${customer.email} بخصوص الفاتورة ${invoice.id}.`);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`إرسال تذكير للفاتورة ${invoice.id}`}>
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon name="ai" className="w-12 h-12 text-indigo-500 animate-pulse" />
            <p className="mt-4 text-slate-600">...جاري إنشاء مسودة التذكير</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                <p><span className="font-semibold text-slate-500">إلى:</span> {customer.name} ({customer.email})</p>
                <p><span className="font-semibold text-slate-500">الموضوع:</span> تذكير ودي بخصوص الفاتورة رقم {invoice.id}</p>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 whitespace-pre-wrap leading-relaxed"
              placeholder="اكتب رسالتك هنا..."
            />
            <div className="flex justify-end pt-2 gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                <Button type="button" onClick={handleSend}>
                    <Icon name="send" className="w-5 h-5 ml-2"/>
                    إرسال التذكير
                </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ReminderModal;