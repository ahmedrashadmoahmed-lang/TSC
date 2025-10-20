import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import type { Invoice, InvoiceStatus, Customer } from '../types';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import AddInvoiceModal from '../components/accounts-receivable/AddInvoiceModal';
import AiSummaryModal from '../components/accounts-receivable/AiSummaryModal';
import ReminderModal from '../components/accounts-receivable/ReminderModal';
import StatusBadge from '../components/shared/StatusBadge';
import { useApiErrorHandler } from '../hooks/useApiErrorHandler';

interface AccountsReceivableProps {
    invoices: Invoice[];
    setInvoices: React.Dispatch<React.SetStateAction<Invoice[]>>;
    customers: Customer[];
    onSaveCustomer: (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }) => Customer;
}

const AccountsReceivable: React.FC<AccountsReceivableProps> = ({ invoices, setInvoices, customers, onSaveCustomer }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'الكل'>('الكل');
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [isAiModalOpen, setAiModalOpen] = useState(false);
    const [aiSummary, setAiSummary] = useState('');
    const [isLoadingAi, setIsLoadingAi] = useState(false);
    const [invoiceForReminder, setInvoiceForReminder] = useState<Invoice | null>(null);
    const handleApiError = useApiErrorHandler();

    useEffect(() => {
        const checkAndUpdateInvoices = () => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Normalize to midnight for fair comparison
            
            let needsUpdate = false;
            const updatedInvoices = invoices.map(invoice => {
                if (invoice.status === 'مدفوعة') {
                    return invoice;
                }
                const dueDate = new Date(invoice.dueDate);
                const expectedStatus: InvoiceStatus = dueDate < today ? 'متأخرة' : 'مستحقة';
                
                if (invoice.status !== expectedStatus) {
                    needsUpdate = true;
                    return { ...invoice, status: expectedStatus };
                }
                return invoice;
            });

            if (needsUpdate) {
                setInvoices(updatedInvoices);
            }
        };

        checkAndUpdateInvoices();
        const intervalId = setInterval(checkAndUpdateInvoices, 3600000); // Check every hour
        
        return () => clearInterval(intervalId);
    }, [invoices, setInvoices]);

    const filteredInvoices = useMemo(() => {
        return invoices.filter(invoice => {
            const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'الكل' || invoice.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [invoices, searchTerm, statusFilter]);
    
    const handleAddInvoice = (newInvoiceData: Omit<Invoice, 'id'>) => {
        const newInvoice: Invoice = {
            ...newInvoiceData,
            id: `INV-${Math.floor(Math.random() * 1000) + 106}`
        };
        setInvoices(prev => [newInvoice, ...prev]);
        setAddModalOpen(false);
    }
    
    const handleGenerateSummary = async () => {
        setIsLoadingAi(true);
        setAiSummary('');
        setAiModalOpen(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const overdueInvoices = invoices.filter(inv => inv.status === 'متأخرة');
            if (overdueInvoices.length === 0) {
                setAiSummary('لا توجد فواتير متأخرة لتحليلها. عمل رائع!');
                setIsLoadingAi(false);
                return;
            }
            const prompt = `
            أنت مستشار مالي خبير. بناءً على قائمة الفواتير المتأخرة التالية بالريال السعودي، قدم ملخصًا للحالة وقائمة توصيات قابلة للتنفيذ لتحصيل هذه المبالغ. كن محددًا ومهنيًا في اقتراحاتك.
            
            الفواتير المتأخرة:
            ${overdueInvoices.map(inv => `- فاتورة ${inv.id} للعميل '${inv.customerName}' بمبلغ ${inv.amount.toLocaleString()} ر.س، تاريخ الاستحقاق ${inv.dueDate}`).join('\n')}
            
            الملخص المطلوب:
            1.  تقييم موجز للمخاطر المالية الحالية.
            2.  قائمة من 3-4 خطوات مقترحة حسب الأولوية (مثال: التواصل الهاتفي، إرسال بريد إلكتروني رسمي، النظر في الإجراءات القانونية).
            3.  صياغة نموذج بريد إلكتروني مهذب وقوي لإرساله إلى العملاء المتأخرين.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setAiSummary(response.text);

        } catch (error) {
            handleApiError(error, 'AccountsReceivable Summary');
            setAiSummary('عذرًا، حدث خطأ أثناء إنشاء الملخص. يرجى مراجعة الإشعارات والمحاولة مرة أخرى.');
        } finally {
            setIsLoadingAi(false);
        }
    };

    const customerForReminder = useMemo(() => {
        if (!invoiceForReminder) return null;
        return customers.find(c => c.id === invoiceForReminder.customerId) || null;
    }, [invoiceForReminder, customers]);

    return (
        <div className="space-y-6">
            <AddInvoiceModal 
                isOpen={isAddModalOpen} 
                onClose={() => setAddModalOpen(false)} 
                onAdd={handleAddInvoice} 
                customers={customers}
                onAddCustomer={onSaveCustomer}
            />
            <AiSummaryModal isOpen={isAiModalOpen} onClose={() => setAiModalOpen(false)} summary={aiSummary} isLoading={isLoadingAi} />
            {invoiceForReminder && customerForReminder && (
                <ReminderModal 
                    isOpen={!!invoiceForReminder}
                    onClose={() => setInvoiceForReminder(null)}
                    invoice={invoiceForReminder}
                    customer={customerForReminder}
                />
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة حسابات العملاء</h2>
                    <p className="text-slate-500 mt-1">تتبع وتحصيل فواتير العملاء.</p>
                </div>
                <div className="flex items-center gap-2">
                     <Button variant="secondary" onClick={handleGenerateSummary} disabled={isLoadingAi}>
                        <Icon name="ai" className="w-5 h-5 ml-2"/>
                        {isLoadingAi ? '...جاري التحليل' : 'تحليل AI للمتأخرات'}
                    </Button>
                    <Button onClick={() => setAddModalOpen(true)}>
                        <Icon name="add" className="w-5 h-5 ml-2"/>
                        فاتورة جديدة
                    </Button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    <div className="relative">
                        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
                        <input
                            type="text"
                            placeholder="بحث عن فاتورة أو عميل..."
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
                                <th scope="col" className="px-6 py-3">اسم العميل</th>
                                <th scope="col" className="px-6 py-3">تاريخ الإصدار</th>
                                <th scope="col" className="px-6 py-3">تاريخ الاستحقاق</th>
                                <th scope="col" className="px-6 py-3">المبلغ</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(invoice => (
                                <tr key={invoice.id} className={`bg-white border-b hover:bg-slate-50 transition-colors ${invoice.status === 'متأخرة' ? 'bg-red-50 hover:bg-red-100' : ''}`}>
                                    <td className="px-6 py-4 font-medium text-slate-900">{invoice.id}</td>
                                    <td className="px-6 py-4">{invoice.customerName}</td>
                                    <td className="px-6 py-4">{invoice.issueDate}</td>
                                    <td className="px-6 py-4">{invoice.dueDate}</td>
                                    <td className="px-6 py-4 font-semibold">{invoice.amount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={invoice.status} /></td>
                                    <td className="px-6 py-4 flex items-center gap-3 justify-end">
                                        {invoice.status !== 'مدفوعة' && (
                                            <button 
                                                onClick={() => setInvoiceForReminder(invoice)} 
                                                className="text-slate-500 hover:text-indigo-600"
                                                title="إرسال تذكير"
                                            >
                                                <Icon name="email" className="w-5 h-5"/>
                                            </button>
                                        )}
                                        <button className="text-slate-500 hover:text-indigo-600" title="تعديل"><Icon name="edit" className="w-5 h-5"/></button>
                                        <button className="text-slate-500 hover:text-red-600" title="حذف"><Icon name="delete" className="w-5 h-5"/></button>
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

export default AccountsReceivable;
