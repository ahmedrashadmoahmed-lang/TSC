import React, { useState, useMemo } from 'react';
import type { Project, Invoice, PurchaseOrder, Customer } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import ProjectModal from '../components/projects/ProjectModal'; 

interface ProjectsProps {
    projects: Project[];
    invoices: Invoice[];
    purchaseOrders: PurchaseOrder[];
    customers: Customer[];
    onSave: (projectData: Omit<Project, 'id'> & { id?: string }) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, invoices, purchaseOrders, customers, onSave }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const projectsWithProfitability = useMemo(() => {
        return projects.map(project => {
            const projectInvoices = invoices.filter(inv => inv.projectId === project.id);
            const projectPOs = purchaseOrders.filter(po => po.projectId === project.id);

            const totalRevenue = projectInvoices.reduce((sum, inv) => sum + inv.amount, 0);
            const totalCost = projectPOs.reduce((sum, po) => sum + po.totalAmount, 0);
            const profit = totalRevenue - totalCost;

            return {
                ...project,
                totalRevenue,
                totalCost,
                profit
            };
        });
    }, [projects, invoices, purchaseOrders]);
    
    const handleSaveProject = (projectData: Omit<Project, 'id'> & { id?: string }) => {
        onSave(projectData);
        setModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <ProjectModal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveProject}
                customers={customers}
                project={null}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة المشاريع</h2>
                    <p className="text-slate-500 mt-1">نظرة شاملة على ربحية وأداء مشاريعك.</p>
                </div>
                <Button onClick={() => setModalOpen(true)}>
                    <Icon name="add" className="w-5 h-5 ml-2"/>
                    إضافة مشروع جديد
                </Button>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المشروع</th>
                                <th scope="col" className="px-6 py-3">العميل</th>
                                <th scope="col" className="px-6 py-3">الحالة</th>
                                <th scope="col" className="px-6 py-3">إجمالي الإيرادات</th>
                                <th scope="col" className="px-6 py-3">إجمالي التكاليف</th>
                                <th scope="col" className="px-6 py-3">الربح</th>
                                <th scope="col" className="px-6 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projectsWithProfitability.map(p => (
                                <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-indigo-600">
                                        <a href={`#project-detail?id=${p.id}`}>{p.name}</a>
                                    </td>
                                    <td className="px-6 py-4">{p.customerName}</td>
                                    <td className="px-6 py-4"><StatusBadge status={p.status as any} /></td>
                                    <td className="px-6 py-4 text-green-600 font-semibold">{p.totalRevenue.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4 text-red-600 font-semibold">{p.totalCost.toLocaleString()} ر.س</td>
                                    <td className={`px-6 py-4 font-bold ${p.profit >= 0 ? 'text-slate-800' : 'text-red-700'}`}>{p.profit.toLocaleString()} ر.س</td>
                                    <td className="px-6 py-4 text-left">
                                        <a href={`#project-detail?id=${p.id}`} className="text-indigo-600 hover:text-indigo-800">
                                            عرض التفاصيل
                                        </a>
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

export default Projects;