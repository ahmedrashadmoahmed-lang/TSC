import React, { useState, useMemo } from 'react';
import type { PurchaseOrder } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import { Icon } from '../components/shared/Icon';
import UpdatePoStatusModal from '../components/purchase-orders/UpdatePoStatusModal';

interface PurchaseOrdersProps {
    purchaseOrders: PurchaseOrder[];
    onUpdatePurchaseOrder: (po: PurchaseOrder) => void;
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ purchaseOrders, onUpdatePurchaseOrder }) => {
    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState<string>('الكل');

    const handleOpenUpdateModal = (po: PurchaseOrder) => {
        setSelectedPo(po);
        setUpdateModalOpen(true);
    };

    const handleSaveStatus = (updatedPo: PurchaseOrder) => {
        onUpdatePurchaseOrder(updatedPo);
        setUpdateModalOpen(false);
        setSelectedPo(null);
    };

    const uniqueSuppliers = useMemo(() => {
        const supplierNames = purchaseOrders.map(po => po.supplierName);
        return ['الكل', ...Array.from(new Set(supplierNames))];
    }, [purchaseOrders]);

    const filteredPurchaseOrders = useMemo(() => {
        return purchaseOrders.filter(po => {
            const matchesSearch = po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  po.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSupplier = supplierFilter === 'الكل' || po.supplierName === supplierFilter;
            return matchesSearch && matchesSupplier;
        });
    }, [purchaseOrders, searchTerm, supplierFilter]);


    return (
        <div className="space-y-6">
            {selectedPo && (
                <UpdatePoStatusModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setUpdateModalOpen(false)}
                    purchaseOrder={selectedPo}
                    onSave={handleSaveStatus}
                />
            )}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة أوامر الشراء</h2>
                    <p className="text-slate-500 mt-1">تتبع أوامر الشراء المرسلة للموردين.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative">
                        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
                        <input
                            type="text"
                            placeholder="بحث بالرقم أو المورد..."
                            className="bg-slate-50 rounded-lg py-2 pr-10 pl-4 w-full md:w-80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="supplier-filter" className="text-sm font-medium text-slate-600">المورد:</label>
                        <select
                            id="supplier-filter"
                            value={supplierFilter}
                            onChange={(e) => setSupplierFilter(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            {uniqueSuppliers.map(supplier => (
                                <option key={supplier} value={supplier}>{supplier === 'الكل' ? 'كل الموردين' : supplier}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">رقم الأمر</th>
                                <th scope="col" className="px-6 py-3">المورد</th>
                                <th scope="col" className="px-6 py-3">تاريخ الطلب</th>
                                <th scope="col" className="px-6 py-3">الإجمالي</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPurchaseOrders.length > 0 ? filteredPurchaseOrders.map(po => (
                                <tr key={po.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-indigo-600">{po.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{po.supplierName}</td>
                                    <td className="px-6 py-4">{po.orderDate}</td>
                                    <td className="px-6 py-4 font-semibold">{po.totalAmount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                    <td className="px-6 py-4 text-left">
                                        <button onClick={() => handleOpenUpdateModal(po)} className="text-slate-500 hover:text-indigo-600" title="تحديث الحالة">
                                            <Icon name="edit" className="w-5 h-5"/>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">
                                        لا توجد أوامر شراء تطابق معايير البحث.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrders;