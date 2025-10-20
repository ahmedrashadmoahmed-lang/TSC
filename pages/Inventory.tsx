import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { InventoryItem, InventoryStatus } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import AiInventoryAdvisorModal from '../components/inventory/AiInventoryAdvisorModal';
import StatusBadge from '../components/shared/StatusBadge';

export const initialInventoryItems: InventoryItem[] = [
    { id: 'PROD-001', name: 'كاميرا مراقبة خارجية 4K', sku: 'CAM-4K-01', category: 'كاميرات مراقبة', quantity: 25, reorderPoint: 10, supplierId: 'S-001', costPrice: 350, sellingPrice: 550, status: 'متوفر', salesVelocity: 15, leadTimeDays: 7 },
    { id: 'PROD-002', name: 'جهاز تسجيل شبكي (NVR) 16 قناة', sku: 'NVR-16CH-01', category: 'أجهزة تسجيل', quantity: 8, reorderPoint: 5, supplierId: 'S-001', costPrice: 1200, sellingPrice: 1800, status: 'كمية قليلة', salesVelocity: 5, leadTimeDays: 10 },
    { id: 'PROD-003', name: 'شاشة عرض 55 بوصة', sku: 'DISP-55-LG', category: 'شاشات عرض', quantity: 15, reorderPoint: 5, supplierId: 'S-002', costPrice: 1500, sellingPrice: 2200, status: 'متوفر', salesVelocity: 8, leadTimeDays: 14 },
    { id: 'PROD-004', name: 'عقد صيانة سنوي', sku: 'SRV-MAINT-01', category: 'خدمات', quantity: 999, reorderPoint: 0, supplierId: 'S-004', costPrice: 40000, sellingPrice: 75000, status: 'متوفر', salesVelocity: 2, leadTimeDays: 0 },
    { id: 'PROD-005', name: 'محول شبكة (Switch) 24 منفذ', sku: 'SW-24P-CISC', category: 'معدات شبكات', quantity: 3, reorderPoint: 5, supplierId: 'S-003', costPrice: 800, sellingPrice: 1100, status: 'نفذ المخزون', salesVelocity: 10, leadTimeDays: 12 },
];

const Inventory: React.FC = () => {
    const [inventory, setInventory] = useState<InventoryItem[]>(initialInventoryItems);
    const [isAdvisorModalOpen, setAdvisorModalOpen] = useState(false);
    
    return (
        <div className="space-y-6">
            {isAdvisorModalOpen && (
                <AiInventoryAdvisorModal 
                    isOpen={isAdvisorModalOpen}
                    onClose={() => setAdvisorModalOpen(false)}
                    inventoryItems={inventory}
                />
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة المخزون</h2>
                    <p className="text-slate-500 mt-1">تتبع مستويات المخزون وقيمته.</p>
                </div>
                <Button variant="secondary" onClick={() => setAdvisorModalOpen(true)}>
                    <Icon name="ai" className="w-5 h-5 ml-2"/>
                    مستشار إعادة الطلب AI
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المنتج</th>
                                <th scope="col" className="px-6 py-3">SKU</th>
                                <th scope="col" className="px-6 py-3">الكمية الحالية</th>
                                <th scope="col" className="px-6 py-3">نقطة إعادة الطلب</th>
                                <th scope="col" className="px-6 py-3">قيمة المخزون (التكلفة)</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map(item => (
                                <tr key={item.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{item.sku}</td>
                                    <td className="px-6 py-4 font-semibold">{item.quantity}</td>
                                    <td className="px-6 py-4">{item.reorderPoint}</td>
                                    <td className="px-6 py-4">{ (item.quantity * item.costPrice).toLocaleString() } ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Inventory;