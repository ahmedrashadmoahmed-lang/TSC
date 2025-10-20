import React, { useMemo } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import { Icon } from '../shared/Icon';
import type { Offer, PurchaseOrder, PurchaseOrderItem } from '../../types';

interface GeneratePoModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer;
  onUpdate: (offer: Offer) => void;
  onAddPurchaseOrders: (orders: Omit<PurchaseOrder, 'id'>[]) => void;
}

const GeneratePoModal: React.FC<GeneratePoModalProps> = ({ isOpen, onClose, offer, onUpdate, onAddPurchaseOrders }) => {
    
    const purchaseOrdersToCreate = useMemo(() => {
        if (!offer.items || offer.items.length === 0) {
            return [];
        }

        const itemsBySupplier = offer.items.reduce((acc, item) => {
            if (!item.supplierQuotes || item.supplierQuotes.length === 0) {
                return acc; 
            }
            
            const chosenQuote = item.supplierQuotes[0];
            
            const supplierId = chosenQuote.supplierId;
            if (!acc[supplierId]) {
                acc[supplierId] = {
                    supplierName: chosenQuote.supplierName,
                    items: []
                };
            }
            
            acc[supplierId].items.push({
                productId: item.id,
                productName: item.description,
                quantity: item.quantity,
                unitPrice: chosenQuote.price
            });
            
            return acc;
        }, {} as Record<string, { supplierName: string; items: PurchaseOrderItem[] }>);

        return Object.entries(itemsBySupplier).map(([supplierId, data]) => {
            const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
            
            const newPO: Omit<PurchaseOrder, 'id'> & { tempId: string } = {
                tempId: `PO-TEMP-${supplierId}`,
                supplierId: supplierId,
                supplierName: data.supplierName,
                orderDate: new Date().toISOString().split('T')[0],
                expectedDeliveryDate: '',
                items: data.items,
                totalAmount: totalAmount,
                status: 'مرسل'
            };
            return newPO;
        });
    }, [offer]);


    const handleConfirm = () => {
        const posForState = purchaseOrdersToCreate.map(({ tempId, ...rest }) => rest);
        onAddPurchaseOrders(posForState);
        onUpdate({ ...offer, status: 'تم إنشاء أمر شراء' });
        onClose();
    };

    const hasItems = offer.items && offer.items.length > 0 && purchaseOrdersToCreate.length > 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`إنشاء أمر شراء من العرض ${offer.id}`}>
            <div className="space-y-4">
                <p className="text-slate-600">
                    سيتم إنشاء أوامر الشراء التالية للموردين. يرجى المراجعة والتأكيد.
                </p>

                {hasItems ? (
                    <div className="space-y-4 max-h-80 overflow-y-auto p-2 bg-slate-50 rounded-lg">
                        {purchaseOrdersToCreate.map((po) => (
                            <div key={po.tempId} className="p-3 border border-slate-200 rounded-md bg-white">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-bold text-slate-800">المورد: {po.supplierName}</h4>
                                    <span className="font-bold text-indigo-600">{po.totalAmount.toLocaleString()} ر.س</span>
                                </div>
                                <table className="w-full text-xs text-right">
                                    <thead className="text-slate-500">
                                        <tr>
                                            <th className="py-1 px-2 text-right">المنتج</th>
                                            <th className="py-1 px-2 text-center">الكمية</th>
                                            <th className="py-1 px-2 text-center">السعر</th>
                                            <th className="py-1 px-2 text-left">الإجمالي</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {po.items.map(item => (
                                            <tr key={item.productId} className="border-t border-slate-100">
                                                <td className="py-1 px-2 text-right">{item.productName}</td>
                                                <td className="py-1 px-2 text-center">{item.quantity}</td>
                                                <td className="py-1 px-2 text-center">{item.unitPrice.toLocaleString()}</td>
                                                <td className="py-1 px-2 text-left">{(item.quantity * item.unitPrice).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-lg">
                        <Icon name="info" className="w-8 h-8 mx-auto text-slate-400"/>
                        <p className="text-slate-500 mt-2">لا توجد بنود مسعّرة في عرض السعر هذا لإنشاء أوامر شراء.</p>
                    </div>
                )}
                
                <div className="flex justify-end pt-4 gap-2 border-t border-slate-200">
                    <Button type="button" variant="secondary" onClick={onClose}>إلغاء</Button>
                    <Button type="button" onClick={handleConfirm} disabled={!hasItems}>
                        تأكيد وإنشاء {purchaseOrdersToCreate.length} أمر شراء
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default GeneratePoModal;
