import React from 'react';
import { GoogleGenAI } from "@google/genai";
import Modal from '../shared/Modal';
import { Icon } from '../shared/Icon';
import Button from '../shared/Button';
import type { Offer, Communication } from '../../types';
import { initialInventoryItems } from '../../pages/Inventory';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';

interface AiPricingAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  customerCommunications: Communication[];
}

const AiPricingAdvisorModal: React.FC<AiPricingAdvisorModalProps> = ({ isOpen, onClose, offer, customerCommunications }) => {
  const [advice, setAdvice] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const handleApiError = useApiErrorHandler();

  const handleGenerateAdvice = async () => {
    setIsLoading(true);
    setAdvice('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const itemsWithCosts = offer.items.map(item => {
            const bestQuote = item.supplierQuotes.reduce((best, current) => (current.price < best.price ? current : best), { price: Infinity });
            const cost = bestQuote.price !== Infinity ? bestQuote.price * item.quantity : 0;
            return `- ${item.description} (الكمية: ${item.quantity}, أفضل تكلفة: ${cost.toLocaleString()} ر.س)`;
        }).join('\n');

        const totalCost = offer.items.reduce((total, item) => {
            const bestQuote = item.supplierQuotes.reduce((best, current) => (current.price < best.price ? current : best), { price: Infinity });
            return total + (bestQuote.price !== Infinity ? bestQuote.price * item.quantity : 0);
        }, 0);

        const prompt = `
        أنت خبير استراتيجي في المبيعات ومُعزز مبيعات ذكي لشركة تقنية سعودية تعمل في قطاع B2B. مهمتك هي تحليل عرض السعر وبيانات العميل التالية لزيادة الإيرادات وفرص إغلاق الصفقة.

        **تفاصيل عرض السعر:**
        - العميل: ${offer.customerName}
        - الموضوع: ${offer.subject}
        - البنود والتكاليف:
        ${itemsWithCosts.length > 0 ? itemsWithCosts : '  - لا توجد بنود مسعرة بعد.'}
        - إجمالي التكلفة من الموردين: ${totalCost.toLocaleString()} ر.س
        - سعر البيع المقترح: ${offer.totalSellingPrice.toLocaleString()} ر.س

        **سجل تواصل العميل:**
        ${customerCommunications.length > 0 ? customerCommunications.map(c => `- ${c.date}: ${c.summary}`).join('\n') : '- لا يوجد سجل تواصل سابق.'}

        **المنتجات المتاحة للبيع الإضافي (Upsell/Cross-sell):**
        ${initialInventoryItems.map(i => `- ${i.name} (السعر: ${i.sellingPrice.toLocaleString()} ر.س)`).join('\n')}

        **المطلوب (باللغة العربية):**
        أنشئ استراتيجية مبيعات شاملة ومنظمة.
        
        1.  **تحليل السعر والتوصية:**
            *   احسب هامش الربح الحالي.
            *   بناءً على البنود وسجل العميل، أوصِ باستراتيجية تسعير نهائية (مثال: "الحفاظ على السعر"، "عرض خصم 5% للإغلاق السريع"، "زيادة السعر بسبب القيمة المضافة العالية"). برر توصيتك.

        2.  **فرص البيع الإضافي (Upsell & Cross-Sell):**
            *   حدد 1-2 منتجات **محددة** من قائمة المنتجات المتاحة تكون ذات صلة ببنود العرض الحالي.
            *   لكل اقتراح، قدم مبررًا موجزًا يشرح لماذا هو مناسب لهذا العميل.

        3.  **مسودة رسالة متابعة شخصية:**
            *   اكتب مسودة رسالة بريد إلكتروني قصيرة ومقنعة.
            *   ادمج اقتراح البيع الإضافي بشكل طبيعي في الرسالة.
            *   سلط الضوء على القيمة المقترحة واخلق شعوراً بالفرصة.

        4.  **نقاط القوة في التفاوض:**
            *   ضع 2-3 نقاط يمكن لمندوب المبيعات استخدامها في المفاوضات لتعزيز قيمة العرض.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setAdvice(response.text);

    } catch (error) {
        handleApiError(error, 'AI Pricing Advisor');
        setAdvice('عذرًا، حدث خطأ أثناء إنشاء النصيحة. يرجى مراجعة الإشعارات والمحاولة مرة أخرى.');
    } finally {
        setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
        handleGenerateAdvice();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="مُعزز المبيعات الذكي">
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon name="ai" className="w-12 h-12 text-indigo-500 animate-pulse" />
            <p className="mt-4 text-slate-600">...جاري تحليل العرض ووضع الاستراتيجية</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                    <h4 className="font-bold text-slate-800">تحليل عرض سعر لـ: {offer.customerName}</h4>
                    <Button size="sm" variant="secondary" onClick={handleGenerateAdvice} disabled={isLoading}>
                        إعادة التحليل
                    </Button>
                </div>
            </div>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed max-h-[50vh] overflow-y-auto pr-2">
              {advice}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiPricingAdvisorModal;
