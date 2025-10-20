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
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import type { Communication, Customer, Supplier, PurchaseOrder, Offer, Invoice, Project, TimeLog, SavedReport, AiResponse } from './types';

// Centralized Data Store
export const initialProjects: Project[] = [
    { id: 'PROJ-24-01', name: 'تطوير البنية التحتية لشبكة مدارس الأجيال', customerId: 'C-003', customerName: 'مدارس الأجيال الجديدة', status: 'قيد التنفيذ' },
    { id: 'PROJ-24-02', name: 'توريد وتركيب نظام ERP لشركة الحلول المبتكرة', customerId: 'C-001', customerName: 'شركة الحلول المبتكرة', status: 'مكتمل' },
    { id: 'PROJ-24-03', name: 'نظام المراقبة الأمنية لمجموعة البناء الحديث', customerId: 'C-002', customerName: 'مجموعة البناء الحديث', status: 'تخطيط' },
];

export const initialOffers: Offer[] = [
    { 
        id: 'Q-24-01', 
        customerId: 'C-003', 
        customerName: 'مدارس الأجيال الجديدة', 
        subject: 'تطوير شبكة المدرسة الرئيسية', 
        issueDate: '2024-07-05', 
        validUntil: '2024-07-20', 
        status: 'مقبول', 
        items: [
            { id: 'item-1', description: '50x Routers', quantity: 50, supplierQuotes: [{ supplierId: 'S-001', supplierName: 'تقنيات المستقبل للتجارة', price: 1000 }] },
            { id: 'item-2', description: '10x Switches', quantity: 10, supplierQuotes: [{ supplierId: 'S-001', supplierName: 'تقنيات المستقبل للتجارة', price: 3000 }] },
            { id: 'item-3', description: 'Network installation services', quantity: 1, supplierQuotes: [{ supplierId: 'S-003', supplierName: 'خبراء التركيب والصيانة', price: 20000 }] },
        ], 
        totalSellingPrice: 150000, 
        commission: 7500, 
        projectId: 'PROJ-24-01' 
    },
    { 
        id: 'Q-24-02', 
        customerId: 'C-001', 
        customerName: 'شركة الحلول المبتكرة', 
        subject: 'تطبيق نظام ERP متكامل', 
        issueDate: '2024-05-10', 
        validUntil: '2024-05-25', 
        status: 'تم إنشاء أمر شراء', 
        items: [
            { id: 'item-4', description: 'ERP Software License', quantity: 1, supplierQuotes: [{ supplierId: 'S-002', supplierName: 'الإبداع الرقمي للبرمجيات', price: 120000 }] },
            { id: 'item-5', description: 'Implementation Service', quantity: 1, supplierQuotes: [{ supplierId: 'S-003', supplierName: 'خبراء التركيب والصيانة', price: 60000 }] },
        ], 
        totalSellingPrice: 250000, 
        commission: 12500, 
        projectId: 'PROJ-24-02' 
    },
    { 
        id: 'Q-24-03', 
        customerId: 'C-002', 
        customerName: 'مجموعة البناء الحديث', 
        subject: 'تأمين المقر الرئيسي بنظام كاميرات مراقبة', 
        issueDate: '2024-07-18', 
        validUntil: '2024-08-02', 
        status: 'قيد التسعير', 
        items: [
             { id: 'item-6', description: '30x Cameras', quantity: 30, supplierQuotes: [] },
             { id: 'item-7', description: '2x NVRs', quantity: 2, supplierQuotes: [] },
        ], 
        totalSellingPrice: 0, 
        projectId: 'PROJ-24-03' 
    },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
    {
        id: 'PO-24-01',
        supplierId: 'S-001',
        supplierName: 'تقنيات المستقبل للتجارة',
        orderDate: '2024-07-08',
        expectedDeliveryDate: '2024-07-22',
        items: [
            { productId: 'item-1', productName: '50x Routers', quantity: 50, unitPrice: 1000 },
            { productId: 'item-2', productName: '10x Switches', quantity: 10, unitPrice: 3000 }
        ],
        totalAmount: 80000,
        status: 'مرسل',
        projectId: 'PROJ-24-01',
    },
    {
        id: 'PO-24-02',
        supplierId: 'S-003',
        supplierName: 'خبراء التركيب والصيانة',
        orderDate: '2024-07-08',
        expectedDeliveryDate: '2024-08-01',
        items: [
            { productId: 'item-3', productName: 'Network installation services', quantity: 1, unitPrice: 20000 }
        ],
        totalAmount: 20000,
        status: 'مرسل',
        projectId: 'PROJ-24-01',
    },
    {
        id: 'PO-24-03',
        supplierId: 'S-002',
        supplierName: 'الإبداع الرقمي للبرمجيات',
        orderDate: '2024-05-28',
        expectedDeliveryDate: '2024-06-05',
        items: [
            { productId: 'item-4', productName: 'ERP Software License', quantity: 1, unitPrice: 120000 }
        ],
        totalAmount: 120000,
        status: 'مستلم',
        projectId: 'PROJ-24-02',
    },
    {
        id: 'PO-24-04',
        supplierId: 'S-003',
        supplierName: 'خبراء التركيب والصيانة',
        orderDate: '2024-05-28',
        expectedDeliveryDate: '2024-07-15',
        items: [
             { productId: 'item-5', productName: 'Implementation Service', quantity: 1, unitPrice: 60000 }
        ],
        totalAmount: 60000,
        status: 'مستلم',
        projectId: 'PROJ-24-02',
    }
];

export const initialInvoices: Invoice[] = [
    {id: 'INV-24-01', customerId: 'C-003', customerName: 'مدارس الأجيال الجديدة', issueDate: '2024-07-10', dueDate: '2024-08-09', amount: 75000, status: 'مستحقة', projectId: 'PROJ-24-01'},
    {id: 'INV-24-02', customerId: 'C-001', customerName: 'شركة الحلول المبتكرة', issueDate: '2024-06-01', dueDate: '2024-07-01', amount: 125000, status: 'مدفوعة', projectId: 'PROJ-24-02'},
    {id: 'INV-24-03', customerId: 'C-001', customerName: 'شركة الحلول المبتكرة', issueDate: '2024-07-15', dueDate: '2024-08-14', amount: 125000, status: 'مدفوعة', projectId: 'PROJ-24-02'},
    {id: 'INV-24-04', customerId: 'C-002', customerName: 'مجموعة البناء الحديث', issueDate: '2024-05-20', dueDate: '2024-06-20', amount: 15000, status: 'متأخرة'},
];

export const initialTimeLogs: TimeLog[] = [
    { id: 'TL-01', projectId: 'PROJ-24-01', userName: 'أحمد محمود', date: '2024-07-20', hours: 5, task: 'تثبيت وتكوين الراوترات الأساسية في الموقع.' },
    { id: 'TL-02', projectId: 'PROJ-24-02', userName: 'سارة عبدالله', date: '2024-07-18', hours: 8, task: 'جلسة تدريب للمستخدمين على نظام ERP.' },
    { id: 'TL-03', projectId: 'PROJ-24-01', userName: 'أحمد محمود', date: '2024-07-21', hours: 3.5, task: 'اختبار الاتصال بالشبكة وتصحيح الأخطاء.' },
    { id: 'TL-04', projectId: 'PROJ-24-02', userName: 'خالد الغامدي', date: '2024-07-22', hours: 6, task: 'تخصيص وحدات الفواتير والمخزون في النظام.' },
];

export const initialSavedReports: SavedReport[] = [
    {
        id: 'REP-1721832145',
        savedAt: '2024-07-24',
        query: 'ما هي حالة الذمم المدينة الحالية؟',
        response: {
            summary: '**ملخص الذمم المدينة:**\n\n*   **إجمالي المبلغ:** 265,000 ر.س\n*   **مدفوع:** 250,000 ر.س\n*   **مستحق:** 75,000 ر.س\n*   **متأخر:** 15,000 ر.س\n\nيجب التركيز على تحصيل المبلغ المتأخر من **مجموعة البناء الحديث**.',
            chartType: 'pie',
            chartData: [
                { name: 'مدفوع', value: 250000 },
                { name: 'مستحق', value: 75000 },
                { name: 'متأخر', value: 15000 }
            ]
        }
    }
];

type Page = 'dashboard' | 'projects' | 'project-detail' | 'offers' | 'customers' | 'receivable' | 'suppliers' | 'purchase-orders' | 'payable' | 'inventory' | 'reports' | 'settings';

const pageComponents: Record<Page, React.ComponentType<any>> = {
  dashboard: Dashboard,
  projects: Projects,
  'project-detail': ProjectDetail,
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
    projects: 'إدارة المشاريع',
    'project-detail': 'تفاصيل المشروع',
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
  const [activePage, setActivePage] = useState<string>('dashboard');
  
  // Centralized state
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(initialTimeLogs);
  const [savedReports, setSavedReports] = useState<SavedReport[]>(initialSavedReports);

  // Customer Handlers
  const handleSaveCustomer = (customerData: Omit<Customer, 'id' | 'registrationDate'> & { id?: string }): Customer => {
    if (customerData.id) {
        // Update
        const existingCustomer = customers.find(c => c.id === customerData.id);
        if (!existingCustomer) {
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
        const newSupplier: Supplier = { ...supplierData, id: `S-${Date.now()}` };
        setSuppliers(prev => [newSupplier, ...prev]);
        return newSupplier;
    }
  };

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
  };

  // Offer Handlers
  const handleAddOffer = (newOfferData: Omit<Offer, 'id' | 'status' | 'items' | 'totalSellingPrice' | 'commission'>) => {
    const newOffer: Offer = {
        ...newOfferData,
        id: `Q-${new Date().getFullYear()}-${String(offers.length + 1).padStart(3, '0')}`,
        status: 'جديد',
        items: [],
        totalSellingPrice: 0,
    };
    setOffers(prev => [newOffer, ...prev]);
  };

  const handleUpdateOffer = (updatedOffer: Offer) => {
    setOffers(prev => prev.map(o => o.id === updatedOffer.id ? updatedOffer : o));
  };

  // Project Handlers
  const handleSaveProject = (projectData: Omit<Project, 'id'> & { id?: string }) => {
      if (projectData.id) {
          setProjects(prev => prev.map(p => p.id === projectData.id ? { ...p, ...projectData } : p));
      } else {
          const newProject: Project = {
              ...projectData,
              id: `PROJ-${Date.now()}`,
          };
          setProjects(prev => [newProject, ...prev]);
      }
  };

  const handleAddPurchaseOrders = (newOrders: Omit<PurchaseOrder, 'id'>[]) => {
    const ordersWithIds: PurchaseOrder[] = newOrders.map((order, index) => ({
      ...order,
      id: `PO-${Date.now()}-${index}`
    }));
    setPurchaseOrders(prev => [...ordersWithIds, ...prev]);
  };
  
  const handleUpdatePurchaseOrder = (updatedOrder: PurchaseOrder) => {
    setPurchaseOrders(prevOrders => prevOrders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    ));
  };

  const handleLogCommunication = (commData: Omit<Communication, 'id'>) => {
    const newComm: Communication = {
      ...commData,
      id: `COMM-${Date.now()}`,
    };
    setCommunications(prev => [newComm, ...prev]);
  };
  
  // Time Log Handler
  const handleLogTime = (timeLogData: Omit<TimeLog, 'id'>) => {
      const newTimeLog: TimeLog = {
          ...timeLogData,
          id: `TL-${Date.now()}`,
      };
      setTimeLogs(prev => [newTimeLog, ...prev]);
  };

  // AI Report Handlers
  const handleSaveReport = (reportData: { query: string; response: AiResponse }) => {
    const newReport: SavedReport = {
        ...reportData,
        id: `REP-${Date.now()}`,
        savedAt: new Date().toISOString().split('T')[0],
    };
    setSavedReports(prev => [newReport, ...prev]);
  };

  const handleDeleteReport = (reportId: string) => {
      setSavedReports(prev => prev.filter(r => r.id !== reportId));
  };


  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const pageId = hash.split('?')[0];

      if (pageId && pageComponents[pageId as Page]) {
        setActivePage(pageId as Page);
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

  const pageId = activePage.split('?')[0];

  const pageProps: any = {
      customers,
      suppliers,
      projects,
      invoices,
      offers,
      purchaseOrders,
      communications,
      timeLogs,
      savedReports,
  };
    
    if (pageId === 'offers') {
        pageProps.onAddPurchaseOrders = handleAddPurchaseOrders;
        pageProps.onLogCommunication = handleLogCommunication;
        pageProps.onSaveCustomer = handleSaveCustomer;
        pageProps.onAddOffer = handleAddOffer;
        pageProps.onUpdateOffer = handleUpdateOffer;
    }
    if (pageId === 'customers') {
        pageProps.onSave = handleSaveCustomer;
        pageProps.onDelete = handleDeleteCustomer;
    }
     if (pageId === 'suppliers') {
        pageProps.onSave = handleSaveSupplier;
        pageProps.onDelete = handleDeleteSupplier;
    }
    if (pageId === 'receivable') {
        pageProps.setInvoices = setInvoices;
        pageProps.onSaveCustomer = handleSaveCustomer;
    }
    if(pageId === 'payable') {
        pageProps.onSaveSupplier = handleSaveSupplier;
    }
    if (pageId === 'projects') {
        pageProps.onSave = handleSaveProject;
    }
    if (pageId === 'project-detail') {
        pageProps.onLogTime = handleLogTime;
    }
    if (pageId === 'reports') {
        pageProps.onSaveReport = handleSaveReport;
        pageProps.onDeleteReport = handleDeleteReport;
    }
    if (pageId === 'purchase-orders') {
        pageProps.onUpdatePurchaseOrder = handleUpdatePurchaseOrder;
    }


  const ActivePageComponent = pageComponents[pageId as Page];

  return (
    <div className="flex h-screen bg-slate-50" dir="rtl">
      <Sidebar activePage={pageId} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header pageTitle={pageTitles[pageId as Page]} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
          {ActivePageComponent ? <ActivePageComponent {...pageProps} /> : <div>Page not found</div>}
        </main>
      </div>
    </div>
  );
};

export default App;