import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import Modal from '../shared/Modal';
import { Icon } from '../shared/Icon';
import type { InventoryItem } from '../../types';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';

interface AiInventoryAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
}

const AiInventoryAdvisorModal: React.FC<AiInventoryAdvisorModalProps> = ({ isOpen, onClose, inventoryItems }) => {
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleApiError = useApiErrorHandler();

  const generateAdvice = async () => {
      setIsLoading(true);
      setAdvice('');

      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const prompt = `
            أنت خبير في إدارة سلسلة التوريد والمخزون. بناءً على بيانات المخزون التالية، قم بتحليل الوضع وقدم توصيات واضحة وقابلة للتنفيذ.

            بيانات المخزون:
            ${inventoryItems.map(item => `- المنتج: ${item.name} (SKU: ${item.sku}), الكمية الحالية: ${item.quantity}, نقطة إعادة الطلب: ${item.reorderPoint}, سرعة المبيعات (شهريًا): ${item.salesVelocity}, مدة التوريد (أيام): ${item.leadTimeDays}`).join('\n')}

            التحليل المطلوب:
            1.  **ملخص الوضع العام:** قدم نظرة عامة موجزة عن صحة المخزون.
            2.  **إجراءات عاجلة:** حدد المنتجات التي وصلت إلى نقطة إعادة الطلب أو أقل منها وتحتاج إلى طلب شراء فوري.
            3.  **توصيات إعادة الطلب:** لكل منتج عاجل، اقترح كمية الطلب المثالية مع الأخذ في الاعتبار سرعة المبيعات ومدة التوريد لتغطية الفترة القادمة (مثلاً، شهرين).
            4.  **تنبيهات مستقبلية:** حدد المنتجات التي تقترب من نقطة إعادة الطلب ويجب مراقبتها عن كثب.
            5.  **نصيحة إضافية:** قدم نصيحة واحدة لتحسين إدارة المخزون بشكل عام بناءً على البيانات.
            
            اجعل النص منظمًا وسهل القراءة باستخدام العناوين والنقاط.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        
        setAdvice(response.text);

      } catch (error) {
          handleApiError(error, 'AI Inventory Advisor');
          setAdvice("عذرًا، حدث خطأ أثناء تحليل المخزون. يرجى مراجعة الإشعارات والمحاولة مرة أخرى.");
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
      if (isOpen) {
          generateAdvice();
      }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مستشار المخزون بالذكاء الاصطناعي">
      <div className="min-h-[300px] max-h-[60vh] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon name="ai" className="w-12 h-12 text-indigo-500 animate-pulse" />
            <p className="mt-4 text-slate-600">...جاري تحليل بيانات المخزون</p>
          </div>
        ) : (
          <div className="text-slate-700 whitespace-pre-wrap leading-relaxed">
            {advice}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiInventoryAdvisorModal;
