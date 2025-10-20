import React, { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Icon } from '../shared/Icon';
import StatusBadge from '../shared/StatusBadge';
import AiPricingAdvisorModal from './AiPricingAdvisorModal';
import AiComposeModal from './AiComposeModal';
import GeneratePoModal from './GeneratePoModal';
import type { Offer, PurchaseOrder, Communication } from '../../types';

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  onUpdate: (offer: Offer) => void;
  onAddPurchaseOrders: (orders: Omit<PurchaseOrder, 'id'>[]) => void;
  onLogCommunication: (communicationData: Omit<Communication, 'id'>) => void;
  communications: Communication[];
}

const COMMISSION_RATE = 0.05; // 5%

const OfferDetailModal: React.FC<OfferDetailModalProps> = ({ isOpen, onClose, offer: initialOffer, onUpdate, onAddPurchaseOrders, onLogCommunication, communications }) => {
  const [offer, setOffer] = useState<Offer>(initialOffer);
  const [isPricingAdvisorOpen, setPricingAdvisorOpen] = useState(false);
  const [isComposeModalOpen, setComposeModalOpen] = useState(false);
  const [composeMode, setComposeMode] = useState<'email' | 'whatsapp'>('email');
  const [isGeneratePoModalOpen, setGeneratePoModalOpen] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Offer['status'];
    
    // Calculate commission if status is changed to 'مقبول' and it hasn't been calculated yet
    if (newStatus === 'مقبول' && !offer.commission && offer.totalSellingPrice > 0) {
        const commission = offer.totalSellingPrice * COMMISSION_RATE;
        setOffer(prev => ({...prev, status: newStatus, commission: commission }));
    } else {
        setOffer(prev => ({...prev, status: newStatus}));
    }
  }

  const handleUpdate = () => {
    onUpdate(offer);
    onClose();
  }

  const openComposeModal = (mode: 'email' | 'whatsapp') => {
      setComposeMode(mode);
      setComposeModalOpen(true);
  }

  const customerCommunications = communications.filter(c => c.customerId === offer.customerId);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل عرض السعر: ${offer.id}`}>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="font-semibold text-slate-500">العميل:</span> <span className="text-slate-800">{offer.customerName}</span></div>
                <div><span className="font-semibold text-slate-500">الموضوع:</span> <span className="text-slate-800">{offer.subject}</span></div>
                <div><span className="font-semibold text-slate-500">تاريخ الإصدار:</span> <span className="text-slate-800">{offer.issueDate}</span></div>
                <div><span className="font-semibold text-slate-500">صالح حتى:</span> <span className="text-slate-800">{offer.validUntil}</span></div>
                <div>
                    <span className="font-semibold text-slate-500">الحالة:</span>
                    <select 
                      value={offer.status} 
                      onChange={handleStatusChange} 
                      className="mr-2 border-slate-300 rounded-md"
                      disabled={offer.status === 'تم إنشاء أمر شراء'}
                    >
                        <option value="جديد">جديد</option>
                        <option value="قيد التسعير">قيد التسعير</option>
                        <option value="مرسل">مرسل</option>
                        <option value="مقبول">مقبول</option>
                        <option value="مرفوض">مرفوض</option>
                        <option value="قيد التفاوض">قيد التفاوض</option>
                        <option value="تم إنشاء أمر شراء">تم إنشاء أمر شراء</option>
                    </select>
                </div>
            </div>
          </div>

          <div>
             <h4 className="font-bold text-slate-800 mb-2">بنود عرض السعر</h4>
             <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg">
                <p className="text-slate-500">إدارة بنود عرض السعر سيتم تفعيلها قريباً.</p>
             </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-slate-200">
             <div>
                <span className="font-bold text-slate-500">الإجمالي: </span>
                <span className="text-2xl font-bold text-indigo-600">{offer.totalSellingPrice.toLocaleString()} ر.س</span>
                 {offer.commission && (
                    <div className="mt-1">
                        <span className="font-bold text-slate-500">العمولة: </span>
                        <span className="text-lg font-bold text-green-600">{offer.commission.toLocaleString()} ر.س</span>
                    </div>
                )}
             </div>
             <div className="flex gap-2">
                {offer.status === 'مقبول' && (
                  <Button variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-400" onClick={() => setGeneratePoModalOpen(true)}>
                      <Icon name="purchase-order" className="w-5 h-5 ml-2"/>
                      إنشاء أمر شراء
                  </Button>
                )}
                <Button variant="secondary" onClick={() => setPricingAdvisorOpen(true)}>
                    <Icon name="ai" className="w-5 h-5 ml-2"/>
                    مُعزز المبيعات الذكي
                </Button>
                <Button onClick={() => openComposeModal('email')}>
                    <Icon name="email" className="w-5 h-5 ml-2"/>
                    إرسال
                </Button>
             </div>
          </div>
          
          <div className="flex justify-end pt-4 gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
            <Button type="button" onClick={handleUpdate}>حفظ التغييرات</Button>
          </div>
        </div>
      </Modal>

      {isPricingAdvisorOpen && (
          <AiPricingAdvisorModal 
              isOpen={isPricingAdvisorOpen}
              onClose={() => setPricingAdvisorOpen(false)}
              offer={offer}
              customerCommunications={customerCommunications}
          />
      )}
       {isComposeModalOpen && (
          <AiComposeModal 
              isOpen={isComposeModalOpen}
              onClose={() => setComposeModalOpen(false)}
              offer={offer}
              mode={composeMode}
              onSend={onLogCommunication}
          />
      )}
       {isGeneratePoModalOpen && (
          <GeneratePoModal 
              isOpen={isGeneratePoModalOpen}
              onClose={() => setGeneratePoModalOpen(false)}
              offer={offer}
              onUpdate={onUpdate}
              onAddPurchaseOrders={onAddPurchaseOrders}
          />
      )}
    </>
  );
};

export default OfferDetailModal;