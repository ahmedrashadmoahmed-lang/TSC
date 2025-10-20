import React, { useState, useEffect } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import AccountsReceivable from './pages/AccountsReceivable';
import Customers, { initialCustomers } from './pages/Customers';
import AccountsPayable from './pages/AccountsPayable';
import Suppliers, { initialSuppliers } from './pages/Suppliers';
import Offers from './pages/Offers';
import PurchaseOrders from './pages/PurchaseOrders';
import Inventory from './pages/Inventory';
import AiReports from './pages/AiReports';
import type { Communication, Customer, Supplier, PurchaseOrder, PurchaseOrderItem } from './types';

// Moved from PurchaseOrders.tsx to centralize data
export const initialPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'PO-2024-001',
        supplierId: 'S-004',
        supplierName: 'خدمات الشبكة المتقدمة',
        orderDate: '2024-07-16',
        expectedDeliveryDate: '2024-08-01',
        items: [
            { productId: 'SRV-MAINT-01', productName: 'عقد صيانة سنوي شامل', quantity: 1, unitPrice: 40000 }
        ],
        totalAmount: 40000,
        status: 'مرسل'
    },
    {
        id: 'PO-2024-002',
        supplierId: 'S-001',
        supplierName: 'موردون ألفا',
        orderDate: '2024-07-21',
        expectedDeliveryDate: '2024-07-28',
        items: [
            { productId: 'CAM-4K-01', productName: 'كاميرا مراقبة خارجية 4K', quantity: 10, unitPrice: 350 },
            { productId: 'NVR-16CH-01', productName: 'جهاز تسجيل شبكي (NVR) 16 قناة', quantity: 1, unitPrice: 1200 }
        ],
        totalAmount: 4700,
        status: 'مستلم'
    }
];


type Page = 'dashboard' | 'offers' | 'customers' | 'receivable' | 'suppliers' | 'purchase-orders' | 'payable' | 'inventory' | 'reports' | 'settings';

const pageComponents: Record<Page, React.ComponentType<any>> = {
  dashboard: Dashboard,
  receivable: AccountsReceivable,
  customers: Customers,
  payable: AccountsPayable,
  suppliers: Suppliers,
  offers: Offers,
  'purchase-orders': PurchaseOrders,
  inventory: Inventory,
  reports: AiReports,
  settings: () => <div className="p-6 bg-white rounded-2xl shadow-sm"><h2 className="text-2xl font-bold text-slate-800">الإعدادات</h2><p className="text-slate-500 mt-2">سيتم تفعيل هذه الميزة قريباً.</p></div>,
};

const pageTitles: Record<Page, string> = {
    dashboard: 'لوحة القيادة الرئيسية',
    receivable: 'حسابات العملاء (الذمم المدينة)',
    customers: 'إدارة العملاء',
    payable: 'حسابات الموردين (الذمم الدائنة)',
    suppliers: 'إدارة الموردين',
    offers: 'إدارة عروض الأسعار',
    'purchase-orders': 'إدارة أوامر الشراء',
    inventory: 'إدارة المخزون',
    reports: 'التقارير الذكية',
    settings: 'الإعدادات'
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  
  // Centralized state
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [communications, setCommunications] = useState<Communication[]>([]);

  // Customer Handlers
  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }): Customer => {
    if (customerData.id) {
        // Update
        const existingCustomer = customers.find(c => c.id === customerData.id);
        if (!existingCustomer) {
             // This case should not be reachable from the current UI but is a safe guard.
             // Treat as a new customer if not found.
            const newCustomer: Customer = {
                ...customerData,
                id: `C-${Date.now()}`,
                registrationDate: new Date().toISOString().split('T')[0],
            };
            setCustomers(prev => [newCustomer, ...prev]);
            return newCustomer;
        }
        
        const updatedCustomer: Customer = { ...existingCustomer, ...customerData };
        setCustomers(prev => prev.map(c => c.id === customerData.id ? updatedCustomer : c));
        return updatedCustomer;
    } else {
        // Add new
        const newCustomer: Customer = {
            ...customerData,
            id: `C-${Date.now()}`,
            registrationDate: new Date().toISOString().split('T')[0],
        };
        setCustomers(prev => [newCustomer, ...prev]);
        return newCustomer;
    }
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
  };
  
  // Supplier Handlers
  const handleSaveSupplier = (supplierData: Omit<Supplier, 'id'> & { id?: string }): Supplier => {
     if (supplierData.id) {
        // Update
        const existingSupplier = suppliers.find(s => s.id === supplierData.id);
         if (!existingSupplier) {
            const newSupplier: Supplier = { ...supplierData, id: `S-${Date.now()}` };
            setSuppliers(prev => [newSupplier, ...prev]);
            return newSupplier;
        }

        const updatedSupplier: Supplier = { ...existingSupplier, ...supplierData };
        setSuppliers(prev => prev.map(s => s.id === supplierData.id ? updatedSupplier : s));
        return updatedSupplier;
    } else {
        // Add new
        const newSupplier: Supplier = {
            ...supplierData,
            id: `S-${Date.now()}`,
        };
        setSuppliers(prev => [newSupplier, ...prev]);
        return newSupplier;
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };


  const handleAddPurchaseOrders = (newOrders: Omit<PurchaseOrder, 'id'>[]) => {
    const ordersWithIds: PurchaseOrder[] = newOrders.map((order, index) => ({
      ...order,
      id: `PO-${Date.now()}-${index}`
    }));
    setPurchaseOrders(prev => [...ordersWithIds, ...prev]);
  };
  
  const handleLogCommunication = (commData: Omit<Communication, 'id'>) => {
    const newComm: Communication = {
      ...commData,
      id: `COMM-${Date.now()}`,
    };
    setCommunications(prev => [newComm, ...prev]);
  };


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && pageComponents[hash as Page]) {
        setActivePage(hash as Page);
      } else {
        setActivePage('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const pageProps: any = {
      customers,
      suppliers
  };
    if (activePage === 'offers') {
        pageProps.onAddPurchaseOrders = handleAddPurchaseOrders;
        pageProps.onLogCommunication = handleLogCommunication;
        pageProps.onSaveCustomer = handleSaveCustomer;
        pageProps.communications = communications;
    }
    if (activePage === 'purchase-orders') {
        pageProps.purchaseOrders = purchaseOrders;
    }
    if (activePage === 'customers') {
        pageProps.communications = communications;
        pageProps.onSave = handleSaveCustomer;
        pageProps.onDelete = handleDeleteCustomer;
    }
     if (activePage === 'suppliers') {
        pageProps.onSave = handleSaveSupplier;
        pageProps.onDelete = handleDeleteSupplier;
    }
    if (activePage === 'receivable') {
        pageProps.onSaveCustomer = handleSaveCustomer;
    }
    if(activePage === 'payable') {
        pageProps.onSaveSupplier = handleSaveSupplier;
    }


  const ActivePageComponent = pageComponents[activePage];

  return (
    <div className="flex h-screen bg-slate-50" dir="rtl">
      <Sidebar activePage={activePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitles[activePage]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          <ActivePageComponent {...pageProps} />
        </main>
      </div>
    </div>
  );
};

export default App;