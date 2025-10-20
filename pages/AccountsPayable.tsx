import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Payable, PayableStatus, Supplier } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import AddPayableModal from '../components/accounts-payable/AddPayableModal';
import PayableAiSummaryModal from '../components/accounts-payable/PayableAiSummaryModal';

export const initialPayables: Payable[] = [
    {id: 'PAY-201', supplierId: 'S-001', supplierName: 'موردون ألفا', issueDate: '2024-07-05', dueDate: '2024-08-04', amount: 18000, status: 'مستحقة'},
    {id: 'PAY-202', supplierId: 'S-002', supplierName: 'شركة بيتا للتوريدات', issueDate: '2024-06-20', dueDate: '2024-07-20', amount: 7500, status: 'مدفوعة'},
    {id: 'PAY-203', supplierId: 'S-003', supplierName: 'مؤسسة جاما', issueDate: '2024-05-10', dueDate: '2024-06-10', amount: 42000, status: 'متأخرة'},
    {id: 'PAY-204', supplierId: 'S-001', supplierName: 'موردون ألفا', issueDate: '2024-07-15', dueDate: '2024-08-15', amount: 9500, status: 'مستحقة'},
];

interface AccountsPayableProps {
    suppliers: Supplier[];
    onSaveSupplier: (supplierData: Omit<Supplier, 'id'>) => Supplier;
}

const AccountsPayable: React.FC<AccountsPayableProps> = ({ suppliers, onSaveSupplier }) => {
    const [payables, setPayables] = useState<Payable[]>(initialPayables);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PayableStatus | 'الكل'>('الكل');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isAiModalOpen, setAiModalOpen] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);

    const filteredPayables = useMemo(() => {
        return payables.filter(payable => {
            const matchesSearch = payable.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) || payable.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'الكل' || payable.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [payables, searchTerm, statusFilter]);
    
    const handleAddPayable = (newPayableData: Omit<Payable, 'id'>) => {
        const newPayable: Payable = {
            ...newPayableData,
            id: `PAY-${Math.floor(Math.random() * 1000) + 205}`
        };
        setPayables([newPayable, ...payables]);
        setAddModalOpen(false);
    }
    
    const handleGenerateSummary = async () => {
        setIsLoadingAi(true);
        setAiSummary('');
        setAiModalOpen(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const duePayables = payables.filter(p => p.status === 'مستحقة' || p.status === 'متأخرة');
            if (duePayables.length === 0) {
                setAiSummary('لا توجد فواتير مستحقة للدفع. التدفق النقدي في حالة ممتازة!');
                setIsLoadingAi(false);
                return;
            }
            const prompt = `
            أنت مدير مالي استراتيجي. بناءً على قائمة الفواتير المستحقة والمتأخرة التالية بالريال السعودي، قدم ملخصًا وخطة عمل لإدارة المدفوعات بفعالية.
            
            فواتير الموردين:
            ${duePayables.map(p => `- فاتورة ${p.id} للمورد '${p.supplierName}' بمبلغ ${p.amount.toLocaleString()} ر.س، تاريخ الاستحقاق ${p.dueDate}`).join('\n')}
            
            التحليل المطلوب:
            1.  تقييم موجز للالتزامات المالية القادمة.
            2.  اقتراح خطة دفع ذات أولوية للحفاظ على علاقات جيدة مع الموردين وتجنب الرسوم المتأخرة.
            3.  نصيحة حول إدارة التدفق النقدي بناءً على هذه الالتزامات.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiSummary(response.text);

        } catch (error) {
            console.error("Error generating AI summary:", error);
            setAiSummary('عذرًا، حدث خطأ أثناء إنشاء الملخص. يرجى المحاولة مرة أخرى.');
        } finally {
            setIsLoadingAi(false);
        }
    };

    return (
        <div className="space-y-6">
            <AddPayableModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                onAdd={handleAddPayable}
                suppliers={suppliers}
                onAddSupplier={onSaveSupplier}
            />
            <PayableAiSummaryModal isOpen={isAiModalOpen} onClose={() => setAiModalOpen(false)} summary={aiSummary} isLoading={isLoadingAi} />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة حسابات الموردين</h2>
                    <p className="text-slate-500 mt-1">تتبع وإدارة فواتير الموردين والمدفوعات.</p>
                </div>
                <div className="flex items-center gap-2">
                     <Button variant="secondary" onClick={handleGenerateSummary} disabled={isLoadingAi}>
                        <Icon name="ai" className="w-5 h-5 ml-2"/>
                        {isLoadingAi ? '...جاري التحليل' : 'مستشار الدفع AI'}
                    </Button>
                    <Button onClick={() => setAddModalOpen(true)}>
                        <Icon name="add" className="w-5 h-5 ml-2"/>
                        فاتورة مورد جديدة
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative">
                        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
                        <input
                            type="text"
                            placeholder="بحث عن فاتورة أو مورد..."
                            className="bg-slate-50 rounded-lg py-2 pr-10 pl-4 w-full md:w-80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        {(['الكل', 'مدفوعة', 'مستحقة', 'متأخرة'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${statusFilter === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
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
                                <th scope="col" className="px-6 py-3">رقم الفاتورة</th>
                                <th scope="col" className="px-6 py-3">اسم المورد</th>
                                <th scope="col" className="px-6 py-3">تاريخ الإصدار</th>
                                <th scope="col" className="px-6 py-3">تاريخ الاستحقاق</th>
                                <th scope="col" className="px-6 py-3">المبلغ</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayables.map(payable => (
                                <tr key={payable.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{payable.id}</td>
                                    <td className="px-6 py-4">{payable.supplierName}</td>
                                    <td className="px-6 py-4">{payable.issueDate}</td>
                                    <td className="px-6 py-4">{payable.dueDate}</td>
                                    <td className="px-6 py-4 font-semibold">{payable.amount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={payable.status} /></td>
                                    <td className="px-6 py-4 flex items-center gap-3 justify-end">
                                        <button className="text-slate-500 hover:text-indigo-600"><Icon name="edit" className="w-5 h-5"/></button>
                                        <button className="text-slate-500 hover:text-red-600"><Icon name="delete" className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountsPayable;