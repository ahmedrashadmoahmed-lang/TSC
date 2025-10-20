import React, { useState, useMemo } from 'react';
import type { Supplier } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import SupplierModal from '../components/crm/SupplierModal';

export const initialSuppliers: Supplier[] = [
    { id: 'S-001', name: 'موردون ألفا', contactPerson: 'علي حسن', email: 'ali@alpha.com', phone: '0512345678' },
    { id: 'S-002', name: 'شركة بيتا للتوريدات', contactPerson: 'مريم يوسف', email: 'mariam@beta-supplies.sa', phone: '0598765432' },
    { id: 'S-003', name: 'مؤسسة جاما', contactPerson: 'ياسر محمد', email: 'yasser@gamma.org', phone: '0522233344' },
    { id: 'S-004', name: 'خدمات الشبكة المتقدمة', contactPerson: 'نورة خالد', email: 'noura@ans.net', phone: '0567890123' },
];

interface SuppliersProps {
    suppliers: Supplier[];
    onSave: (supplierData: Omit<Supplier, 'id'> & { id?: string }) => void;
    onDelete: (supplierId: string) => void;
}

const Suppliers: React.FC<SuppliersProps> = ({ suppliers, onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [suppliers, searchTerm]);

    const handleOpenModal = (supplier: Supplier | null = null) => {
        setSelectedSupplier(supplier);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedSupplier(null);
        setModalOpen(false);
    };

    const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'> & { id?: string }) => {
        onSave(supplierData);
        handleCloseModal();
    };
    
    const handleDeleteSupplier = (supplierId: string) => {
        if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا المورد؟')) {
           onDelete(supplierId);
        }
    }

    return (
        <div className="space-y-6">
            {isModalOpen && (
                <SupplierModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveSupplier}
                    supplier={selectedSupplier}
                />
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة الموردين</h2>
                    <p className="text-slate-500 mt-1">عرض وإدارة جميع معلومات الموردين.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Icon name="add" className="w-5 h-5 ml-2"/>
                    إضافة مورد جديد
                </Button>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between gap-4 mb-4">
                     <div className="relative">
                        <Icon name="search" className="w-5 h-5 text-slate-400 absolute top-1/2 -translate-y-1/2 right-3" />
                        <input
                            type="text"
                            placeholder="بحث بالاسم، جهة الاتصال، أو البريد الإلكتروني..."
                            className="bg-slate-50 rounded-lg py-2 pr-10 pl-4 w-full md:w-96 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">اسم المورد</th>
                                <th scope="col" className="px-6 py-3">جهة الاتصال</th>
                                <th scope="col" className="px-6 py-3">البريد الإلكتروني</th>
                                <th scope="col" className="px-6 py-3">الهاتف</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map(supplier => (
                                <tr key={supplier.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{supplier.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{supplier.contactPerson}</td>
                                    <td className="px-6 py-4">{supplier.email}</td>
                                    <td className="px-6 py-4">{supplier.phone}</td>
                                    <td className="px-6 py-4 flex items-center gap-3 justify-end">
                                        <button onClick={() => handleOpenModal(supplier)} className="text-slate-500 hover:text-indigo-600"><Icon name="edit" className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-slate-500 hover:text-red-600"><Icon name="delete" className="w-5 h-5"/></button>
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

export default Suppliers;