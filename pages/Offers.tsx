import React, { useState, useMemo } from 'react';
import type { Offer, OfferStatus, PurchaseOrder, Communication, Customer } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import AddOfferModal from '../components/offers/AddOfferModal';
import OfferDetailModal from '../components/offers/OfferDetailModal';

interface OffersProps {
    customers: Customer[];
    offers: Offer[];
    communications: Communication[];
    onAddPurchaseOrders: (orders: Omit<PurchaseOrder, 'id'>[]) => void;
    onLogCommunication: (communicationData: Omit<Communication, 'id'>) => void;
    onSaveCustomer: (customerData: Omit<Customer, 'id' | 'registrationDate'>) => Customer;
    onAddOffer: (offerData: Omit<Offer, 'id' | 'status' | 'items' | 'totalSellingPrice' | 'commission'>) => void;
    onUpdateOffer: (offer: Offer) => void;
}

const Offers: React.FC<OffersProps> = ({ customers, offers, communications, onAddPurchaseOrders, onLogCommunication, onSaveCustomer, onAddOffer, onUpdateOffer }) => {
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
    
    return (
        <div className="space-y-6">
            <AddOfferModal 
                isOpen={isAddOfferModalOpen} 
                onClose={() => setAddOfferModalOpen(false)} 
                onAdd={onAddOffer}
                customers={customers}
                onAddCustomer={onSaveCustomer}
            />
            {selectedOffer && (
                <OfferDetailModal
                    isOpen={!!selectedOffer}
                    onClose={() => setSelectedOffer(null)}
                    offer={selectedOffer}
                    onUpdate={onUpdateOffer}
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
                                <th scope="col" className="px-6 py-3">الكمية</th>
                                <th scope="col" className="px-6 py-3">المبلغ</th>
                                <th scope="col" className="px-6 py-3">العمولة</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">تاريخ الإصدار</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffers.map(offer => {
                                const totalQuantity = offer.items.reduce((sum, item) => sum + item.quantity, 0);
                                return (
                                <tr key={offer.id} className="bg-white border-b hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedOffer(offer)}>
                                    <td className="px-6 py-4 font-medium text-indigo-600">{offer.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{offer.customerName}</td>
                                    <td className="px-6 py-4 max-w-xs truncate">{offer.subject}</td>
                                    <td className="px-6 py-4">{totalQuantity > 0 ? totalQuantity : '-'}</td>
                                    <td className="px-6 py-4 font-semibold">{offer.totalSellingPrice.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4 font-semibold text-green-600">
                                        {offer.commission ? `${offer.commission.toLocaleString()} ر.س` : '-'}
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={offer.status} /></td>
                                    <td className="px-6 py-4">{offer.issueDate}</td>
                                    <td className="px-6 py-4 text-left"><Icon name="edit" className="w-5 h-5 text-slate-400"/></td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Offers;