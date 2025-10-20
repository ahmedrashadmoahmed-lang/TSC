
import React, { useState, useMemo } from 'react';
import type { Customer, Communication } from '../types';
import Button from '../components/shared/Button';
import { Icon } from '../components/shared/Icon';
import CustomerModal from '../components/crm/CustomerModal';

export const initialCustomers: Customer[] = [
    { id: 'C-001', name: 'شركة الحلول المبتكرة', contactPerson: 'عبدالله السالم', email: 'a.salem@innovative.sa', phone: '0501112222', registrationDate: '2023-02-10' },
    { id: 'C-002', name: 'مجموعة البناء الحديث', contactPerson: 'سليمان الحمد', email: 's.alhamad@modern-cg.com', phone: '0553334444', registrationDate: '2023-04-18' },
    { id: 'C-003', name: 'مدارس الأجيال الجديدة', contactPerson: 'هند العتيبي', email: 'h.alotaibi@ngs.edu.sa', phone: '0535556666', registrationDate: '2023-06-05' },
];

interface CustomersProps {
    customers: Customer[];
    communications: Communication[];
    onSave: (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }) => void;
    onDelete: (customerId: string) => void;
}

const Customers: React.FC<CustomersProps> = ({ customers, communications = [], onSave, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [selectedCustomerCommunications, setSelectedCustomerCommunications] = useState<Communication[]>([]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [customers, searchTerm]);

    const handleOpenModal = (customer: Customer | null = null) => {
        setSelectedCustomer(customer);
        if (customer) {
            const customerComms = communications.filter(c => c.customerId === customer.id);
            setSelectedCustomerCommunications(customerComms);
        } else {
            setSelectedCustomerCommunications([]);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedCustomer(null);
        setModalOpen(false);
    };

    const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }) => {
        onSave(customerData);
        handleCloseModal();
    };
    
    const handleDeleteCustomer = (customerId: string) => {
        if(window.confirm('هل أنت متأكد من رغبتك في حذف هذا العميل؟')) {
           onDelete(customerId);
        }
    }

    return (
        <div className="space-y-6">
            {isModalOpen && (
                <CustomerModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveCustomer}
                    customer={selectedCustomer}
                    communications={selectedCustomerCommunications}
                />
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">إدارة العملاء (CRM)</h2>
                    <p className="text-slate-500 mt-1">عرض وإدارة جميع معلومات العملاء.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Icon name="add" className="w-5 h-5 ml-2"/>
                    إضافة عميل جديد
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
                                <th scope="col" className="px-6 py-3">اسم الشركة</th>
                                <th scope="col" className="px-6 py-3">جهة الاتصال</th>
                                <th scope="col" className="px-6 py-3">البريد الإلكتروني</th>
                                <th scope="col" className="px-6 py-3">الهاتف</th>
                                <th scope="col" className="px-6 py-3 text-center">سجل التواصل</th>
                                <th scope="col" className="px-6 py-3">تاريخ الانضمام</th>
                                <th scope="col" className="px-6 py-3">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map(customer => {
                                const commsCount = communications.filter(c => c.customerId === customer.id).length;
                                return (
                                <tr key={customer.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{customer.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{customer.contactPerson}</td>
                                    <td className="px-6 py-4">{customer.email}</td>
                                    <td className="px-6 py-4">{customer.phone}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center" title={`${commsCount} تواصل مسجل`}>
                                            <Icon name="email" className="w-4 h-4 text-slate-400 ml-2" />
                                            <span className="font-semibold text-slate-600">{commsCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{customer.registrationDate}</td>
                                    <td className="px-6 py-4 flex items-center gap-3 justify-end">
                                        <button onClick={() => handleOpenModal(customer)} className="text-slate-500 hover:text-indigo-600" title="تعديل العميل"><Icon name="edit" className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteCustomer(customer.id)} className="text-slate-500 hover:text-red-600" title="حذف العميل"><Icon name="delete" className="w-5 h-5"/></button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Customers;
