import React from 'react';
import type { PurchaseOrder } from '../types';
import StatusBadge from '../components/shared/StatusBadge';
import { Icon } from '../components/shared/Icon';

interface PurchaseOrdersProps {
    purchaseOrders: PurchaseOrder[];
}

const PurchaseOrders: React.FC<PurchaseOrdersProps> = ({ purchaseOrders }) => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة أوامر الشراء</h2>
                    <p className="text-slate-500 mt-1">تتبع أوامر الشراء المرسلة للموردين.</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">رقم الأمر</th>
                                <th scope="col" className="px-6 py-3">المورد</th>
                                <th scope="col" className="px-6 py-3">تاريخ الطلب</th>
                                <th scope="col" className="px-6 py-3">الإجمالي</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseOrders.length > 0 ? purchaseOrders.map(po => (
                                <tr key={po.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-indigo-600">{po.id}</td>
                                    <td className="px-6 py-4 text-slate-800">{po.supplierName}</td>
                                    <td className="px-6 py-4">{po.orderDate}</td>
                                    <td className="px-6 py-4 font-semibold">{po.totalAmount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                    <td className="px-6 py-4 text-left"><Icon name="info" className="w-5 h-5 text-slate-400"/></td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-slate-500">
                                        لا توجد أوامر شراء لعرضها.
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