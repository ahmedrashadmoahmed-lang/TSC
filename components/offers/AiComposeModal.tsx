import React from 'react';
import { GoogleGenAI } from "@google/genai";
import Modal from '../shared/Modal';
import { Icon } from '../shared/Icon';
import Button from '../shared/Button';
import type { Offer, Communication } from '../../types';
import { useApiErrorHandler } from '../../hooks/useApiErrorHandler';

interface AiComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  mode: 'email' | 'whatsapp';
  onSend: (communicationData: Omit<Communication, 'id'>) => void;
}

const AiComposeModal: React.FC<AiComposeModalProps> = ({ isOpen, onClose, offer, mode, onSend }) => {
  const [content, setContent] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const handleApiError = useApiErrorHandler();

  const handleGenerateContent = async () => {
    setIsLoading(true);
    setContent('');

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        
        const communicationType = mode === 'email' ? 'بريد إلكتروني احترافي' : 'رسالة واتساب ودية ومختصرة';
        const closing = mode === 'email' ? 'مع خالص التقدير،' : 'تحياتي،';

        const prompt = `
        أنت مساعد مبيعات خبير ومتخصص في صياغة المراسلات التجارية باللغة العربية. مهمتك هي كتابة ${communicationType} بناءً على تفاصيل عرض السعر التالي.
        
        **بيانات العرض:**
        - **العميل:** ${offer.customerName}
        - **الموضوع:** ${offer.subject}
        - **إجمالي سعر البيع:** ${offer.totalSellingPrice.toLocaleString()} ر.س
        - **صالح حتى:** ${offer.validUntil}
        
        **المطلوب:**
        1.  اكتب ${communicationType} لإرساله إلى العميل.
        2.  ابدأ بتحية مناسبة.
        3.  أشر إلى عرض السعر المرفق بخصوص "${offer.subject}".
        4.  اذكر بإيجاز القيمة التي يقدمها العرض.
        5.  اذكر السعر الإجمالي وتاريخ صلاحية العرض.
        6.  ادعُ العميل لمناقشة أي تفاصيل أو أسئلة قد تكون لديه.
        7.  اختتم الرسالة بشكل احترافي مع ${closing}.
        
        اجعل النص مقنعًا وواضحًا وموجزًا.
        `;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        setContent(response.text);

    } catch (error) {
        handleApiError(error, 'AI Compose Modal');
        setContent('عذرًا، حدث خطأ أثناء إنشاء المحتوى. يرجى مراجعة الإشعارات والمحاولة مرة أخرى.');
    } finally {
        setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
        handleGenerateContent();
    }
  }, [isOpen]);

  const handleSendAndLog = () => {
    onSend({
        customerId: offer.customerId,
        date: new Date().toISOString().split('T')[0],
        type: mode === 'email' ? 'Email' : 'WhatsApp',
        summary: `أرسل عرض السعر #${offer.id} (${offer.subject})`,
        offerId: offer.id
    });
    alert(`تم تسجيل إرسال ${mode === 'email' ? 'البريد الإلكتروني' : 'رسالة الواتساب'} في سجل العميل.\n\nتم نسخ النص إلى الحافظة.`);
    navigator.clipboard.writeText(content);
    onClose();
  };
  
  const title = mode === 'email' ? 'مساعد إنشاء البريد الإلكتروني' : 'مساعد إنشاء رسالة واتساب';
  const iconName = mode === 'email' ? 'email' : 'whatsapp';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Icon name="ai" className="w-12 h-12 text-indigo-500 animate-pulse" />
            <p className="mt-4 text-slate-600">...جاري إنشاء المسودة</p>
          </div>
        ) : (
          <div>
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                         <Icon name={iconName} className="w-6 h-6 text-indigo-600" />
                        <h4 className="font-bold text-slate-800">مسودة مقترحة لـ: {offer.customerName}</h4>
                    </div>
                    <Button size="sm" variant="secondary" onClick={handleGenerateContent} disabled={isLoading}>
                        إعادة الإنشاء
                    </Button>
                </div>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 whitespace-pre-wrap leading-relaxed"
            />
            <div className="flex justify-end mt-4">
                <Button onClick={handleSendAndLog}>
                    <Icon name="send" className="w-5 h-5 ml-2" />
                    إرسال وتسجيل
                </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AiComposeModal;
