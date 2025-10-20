import React, { useState, useMemo } from 'react';
import type { Offer, OfferStatus, PurchaseOrder, Communication, Customer } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import AddOfferModal from '../components/offers/AddOfferModal';
import OfferDetailModal from '../components/offers/OfferDetailModal';

export const initialOffers: Offer[] = [
    { id: 'Q-2024-001', customerId: 'C-001', customerName: 'شركة النور', subject: 'توريد وتركيب نظام كاميرات مراقبة', issueDate: '2024-07-20', validUntil: '2024-08-05', status: 'قيد التسعير', items: [
        { id: 'item-1', description: 'كاميرا مراقبة خارجية 4K', quantity: 10, supplierQuotes: [{ supplierId: 'S-001', supplierName: 'موردون ألفا', price: 350 }] },
        { id: 'item-2', description: 'جهاز تسجيل شبكي (NVR) 16 قناة', quantity: 1, supplierQuotes: [{ supplierId: 'S-001', supplierName: 'موردون ألفا', price: 1200 }] },
    ], totalSellingPrice: 0 },
    { id: 'Q-2024-002', customerId: 'C-002', customerName: 'مؤسسة الأمل', subject: 'تجهيز قاعة اجتماعات', issueDate: '2024-07-18', validUntil: '2024-08-02', status: 'مرسل', items: [], totalSellingPrice: 45000 },
    { id: 'Q-2024-003', customerId: 'C-003', customerName: 'شركة المستقبل', subject: 'عقد صيانة سنوي لأنظمة الشبكات', issueDate: '2024-07-15', validUntil: '2024-07-30', status: 'مقبول', items: [
        { id: 'item-3', description: 'عقد صيانة سنوي شامل', quantity: 1, supplierQuotes: [{ supplierId: 'S-004', supplierName: 'خدمات الشبكة المتقدمة', price: 40000 }] },
    ], totalSellingPrice: 75000 },
];

interface OffersProps {
    customers: Customer[];
    communications: Communication[];
    onAddPurchaseOrders: (orders: Omit<PurchaseOrder, 'id'>[]) => void;
    onLogCommunication: (communicationData: Omit<Communication, 'id'>) => void;
    onSaveCustomer: (customerData: Omit<Customer, 'id' | 'registrationDate'>) => Customer;
}

const Offers: React.FC<OffersProps> = ({ customers, communications, onAddPurchaseOrders, onLogCommunication, onSaveCustomer }) => {
    const [offers, setOffers] = useState<Offer[]>(initialOffers);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<OfferStatus | 'الكل'>('الكل');
    const [isAddOfferModalOpen, setAddOfferModalOpen] = useState(false);
    const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

    const filteredOffers = useMemo(() => {
        return offers.filter(offer => {
            const matchesSearch = offer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || offer.id.toLowerCase().includes(searchTerm.toLowerCase()) || offer.subject.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'الكل' || offer.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [offers, searchTerm, statusFilter]);
    
    const handleAddOffer = (newOfferData: Omit<Offer, 'id' | 'status' | 'items' | 'totalSellingPrice'>) => {
        const newOffer: Offer = {
            ...newOfferData,
            id: `Q-${new Date().getFullYear()}-${String(offers.length + 1).padStart(3, '0')}`,
            status: 'جديد',
            items: [],
            totalSellingPrice: 0,
        };
        setOffers([newOffer, ...offers]);
        setAddOfferModalOpen(false);
    };

    const handleUpdateOffer = (updatedOffer: Offer) => {
        setOffers(offers.map(o => o.id === updatedOffer.id ? updatedOffer : o));
        setSelectedOffer(null); // Close detail modal
    };
    
    return (
        <div className="space-y-6">
            <AddOfferModal 
                isOpen={isAddOfferModalOpen} 
                onClose={() => setAddOfferModalOpen(false)} 
                onAdd={handleAddOffer}
                customers={customers}
                onAddCustomer={onSaveCustomer}
            />
            {selectedOffer && (
                <OfferDetailModal
                    isOpen={!!selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                    offer={selectedOffer}
                    onUpdate={handleUpdateOffer}
                    onAddPurchaseOrders={onAddPurchaseOrders}
                    onLogCommunication={onLogCommunication}
                    communications={communications}
                />
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة عروض الأسعار</h2>
                    <p className="text-slate-500 mt-1">إنشاء وتتبع عروض الأسعار المقدمة للعملاء.</p>
                </div>
                <Button onClick={() => setAddOfferModalOpen(true)}>
                    <Icon name="add" className="w-5 h-5 ml-2"/>
                    عرض سعر جديد
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative">
                        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
                        <input
                            type="text"
                            placeholder="بحث بالرقم، العميل، أو الموضوع..."
                            className="bg-slate-50 rounded-lg py-2 pr-10 pl-4 w-full md:w-80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <div className="flex items-center gap-2 overflow-x-auto pb-2">
                        {(['الكل', 'جديد', 'قيد التسعير', 'مرسل', 'مقبول', 'مرفوض'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${statusFilter === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">رقم العرض</th>
                                <th scope="col" className="px-6 py-3">العميل</th>
                                <th scope="col" className="px-6 py-3">الموضوع</th>
                                <th scope="col" className="px-6 py-3">المبلغ</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">تاريخ الإصدار</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffers.map(offer => (
                                <tr key={offer.id} className="bg-white border-b hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                                    <td className="px-6 py-4 font-medium text-indigo-600">{offer.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{offer.customerName}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{offer.subject}</td>
                                    <td className="px-6 py-4 font-semibold">{offer.totalSellingPrice.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={offer.status} /></td>
                                    <td className="px-6 py-4">{offer.issueDate}</td>
                                    <td className="px-6 py-4 text-left"><Icon name="edit" className="w-5 h-5 text-slate-400"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Offers;