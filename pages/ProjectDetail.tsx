import React, { useState, useMemo } from 'react';
import type { Project, Offer, Invoice, PurchaseOrder, Communication, TimeLog } from '../types';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import SummaryCard from '../components/projects/SummaryCard';
import Button from '../components/shared/Button';
import TimeLogModal from '../components/projects/TimeLogModal';

interface ProjectDetailProps {
    projects: Project[];
    offers: Offer[];
    invoices: Invoice[];
    purchaseOrders: PurchaseOrder[];
    communications: Communication[];
    timeLogs: TimeLog[];
    onLogTime: (timeLogData: Omit<TimeLog, 'id'>) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = (props) => {
    const { projects = [], offers = [], invoices = [], purchaseOrders = [], communications = [], timeLogs = [], onLogTime } = props;
    const [activeTab, setActiveTab] = useState<'invoices' | 'pos' | 'offers' | 'time'>('invoices');
    const [isTimeLogModalOpen, setTimeLogModalOpen] = useState(false);

    const projectId = useMemo(() => {
        const hash = window.location.hash.replace('#', '');
        const params = new URLSearchParams(hash.split('?')[1] || '');
        return params.get('id');
    }, [location.hash]);

    const project = useMemo(() => projects.find((p: Project) => p.id === projectId), [projects, projectId]);

    const projectData = useMemo(() => {
        if (!project) return null;
        const projectOffers = offers.filter((o: Offer) => o.projectId === projectId);
        const projectInvoices = invoices.filter((i: Invoice) => i.projectId === projectId);
        const projectPOs = purchaseOrders.filter((po: PurchaseOrder) => po.projectId === projectId);
        const projectComms = communications.filter((c: Communication) => c.projectId === projectId);
        const projectTimeLogs = timeLogs.filter((t: TimeLog) => t.projectId === projectId);

        const totalRevenue = projectInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const totalCost = projectPOs.reduce((sum, po) => sum + po.totalAmount, 0);
        const profit = totalRevenue - totalCost;
        const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;
        const totalHours = projectTimeLogs.reduce((sum, log) => sum + log.hours, 0);

        return {
            projectOffers,
            projectInvoices,
            projectPOs,
            projectComms,
            projectTimeLogs,
            totalRevenue,
            totalCost,
            profit,
            profitMargin,
            totalHours
        };
    }, [project, offers, invoices, purchaseOrders, communications, timeLogs]);
    
    if (!project || !projectData) {
        return (
            <div className="text-center p-8">
                <h2 className="text-xl font-bold text-slate-700">المشروع غير موجود</h2>
                <p className="text-slate-500 mt-2">لم يتم العثور على المشروع الذي تبحث عنه.</p>
                <a href="#projects" className="mt-4 inline-block text-indigo-600 hover:underline">العودة إلى قائمة المشاريع</a>
            </div>
        );
    }
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'time':
                return (
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">التاريخ</th>
                                <th className="px-6 py-3">الموظف</th>
                                <th className="px-6 py-3">المهمة</th>
                                <th className="px-6 py-3">الساعات المسجلة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectData.projectTimeLogs.map(log => (
                                <tr key={log.id} className="border-b">
                                    <td className="px-6 py-4">{log.date}</td>
                                    <td className="px-6 py-4">{log.userName}</td>
                                    <td className="px-6 py-4 max-w-md">{log.task}</td>
                                    <td className="px-6 py-4 font-semibold">{log.hours.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'invoices':
                return (
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">رقم الفاتورة</th>
                                <th className="px-6 py-3">تاريخ الإصدار</th>
                                <th className="px-6 py-3">المبلغ</th>
                                <th className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectData.projectInvoices.map(inv => (
                                <tr key={inv.id} className="border-b">
                                    <td className="px-6 py-4">{inv.id}</td>
                                    <td className="px-6 py-4">{inv.issueDate}</td>
                                    <td className="px-6 py-4">{inv.amount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={inv.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'pos':
                 return (
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">رقم الأمر</th>
                                <th className="px-6 py-3">المورد</th>
                                <th className="px-6 py-3">تاريخ الطلب</th>
                                <th className="px-6 py-3">المبلغ</th>
                                <th className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectData.projectPOs.map(po => (
                                <tr key={po.id} className="border-b">
                                    <td className="px-6 py-4">{po.id}</td>
                                    <td className="px-6 py-4">{po.supplierName}</td>
                                    <td className="px-6 py-4">{po.orderDate}</td>
                                    <td className="px-6 py-4">{po.totalAmount.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            case 'offers':
                return (
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th className="px-6 py-3">رقم العرض</th>
                                <th className="px-6 py-3">الموضوع</th>
                                <th className="px-6 py-3">المبلغ</th>
                                <th className="px-6 py-3">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectData.projectOffers.map(offer => (
                                <tr key={offer.id} className="border-b">
                                    <td className="px-6 py-4">{offer.id}</td>
                                    <td className="px-6 py-4">{offer.subject}</td>
                                    <td className="px-6 py-4">{offer.totalSellingPrice.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4"><StatusBadge status={offer.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
            default: return null;
        }
    }

    return (
        <div className="space-y-6">
             <TimeLogModal
                isOpen={isTimeLogModalOpen}
                onClose={() => setTimeLogModalOpen(false)}
                onLogTime={onLogTime}
                projectId={project.id}
            />

            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <a href="#projects" className="text-sm text-indigo-600 hover:underline flex items-center mb-2">
                        <Icon name="receivable" className="w-4 h-4 ml-1 transform -scale-x-100" />
                        العودة إلى المشاريع
                    </a>
                    <h2 className="text-2xl font-bold text-slate-800">{project.name}</h2>
                    <p className="text-slate-500 mt-1">العميل: {project.customerName}</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <StatusBadge status={project.status as any} />
                    <Button onClick={() => setTimeLogModalOpen(true)} size="md">
                        <Icon name="time" className="w-5 h-5 ml-2" />
                        تسجيل وقت
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <SummaryCard title="إجمالي الإيرادات" value={`${projectData.totalRevenue.toLocaleString()} ر.س`} icon="upArrow" color="green" />
                <SummaryCard title="إجمالي التكاليف" value={`${projectData.totalCost.toLocaleString()} ر.س`} icon="downArrow" color="red" />
                <SummaryCard title="إجمالي الربح" value={`${projectData.profit.toLocaleString()} ر.س`} icon="cash" color="blue" />
                <SummaryCard title="هامش الربح" value={`${projectData.profitMargin.toFixed(1)}%`} icon="reports" color="purple" />
                <SummaryCard title="إجمالي الساعات" value={`${projectData.totalHours.toLocaleString()} ساعة`} icon="time" color="orange" />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="border-b border-slate-200 mb-4">
                    <nav className="flex -mb-px gap-6">
                        <button onClick={() => setActiveTab('invoices')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'invoices' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>الفواتير ({projectData.projectInvoices.length})</button>
                        <button onClick={() => setActiveTab('pos')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'pos' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>أوامر الشراء ({projectData.projectPOs.length})</button>
                        <button onClick={() => setActiveTab('offers')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'offers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>عروض الأسعار ({projectData.projectOffers.length})</button>
                        <button onClick={() => setActiveTab('time')} className={`py-3 px-1 border-b-2 font-semibold ${activeTab === 'time' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>سجل الوقت ({projectData.projectTimeLogs.length})</button>
                    </nav>
                </div>
                <div className="overflow-x-auto">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;