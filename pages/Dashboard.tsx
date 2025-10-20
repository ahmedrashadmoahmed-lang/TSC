import React, { useState, useMemo } from 'react';
import DashboardCard from '../components/DashboardCard';
import type { DashboardCardData, Transaction, Offer } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Icon } from '../components/shared/Icon';
import StatusBadge from '../components/shared/StatusBadge';
import Button from '../components/shared/Button';

const cashFlowData = [
  { name: 'يناير', 'تدفق وارد': 4000, 'تدفق خارج': 2400, date: '2024-01-15' },
  { name: 'فبراير', 'تدفق وارد': 3000, 'تدفق خارج': 1398, date: '2024-02-15' },
  { name: 'مارس', 'تدفق وارد': 2000, 'تدفق خارج': 9800, date: '2024-03-15' },
  { name: 'أبريل', 'تدفق وارد': 2780, 'تدفق خارج': 3908, date: '2024-04-15' },
  { name: 'مايو', 'تدفق وارد': 1890, 'تدفق خارج': 4800, date: '2024-05-15' },
  { name: 'يونيو', 'تدفق وارد': 2390, 'تدفق خارج': 3800, date: '2024-06-15' },
  { name: 'يوليو', 'تدفق وارد': 3490, 'تدفق خارج': 4300, date: '2024-07-15' },
];

const agingData = [
    { name: '0-30 يوم', value: 400 },
    { name: '31-60 يوم', value: 300 },
    { name: '61-90 يوم', value: 300 },
    { name: '> 90 يوم', value: 200 },
];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const transactions: Transaction[] = [
    {id: 'INV-001', client: 'شركة ألفا', date: '2024-07-25', amount: '١٥,٠٠٠ ر.س', status: 'مدفوعة'},
    {id: 'INV-002', supplier: 'موردون بيتا', date: '2024-07-24', amount: '٨,٢٠٠ ر.س', status: 'مستحقة'},
    {id: 'INV-003', client: 'عملاء جاما', date: '2024-06-22', amount: '٣٤,٥٠٠ ر.س', status: 'متأخرة'},
    {id: 'INV-004', client: 'شركة ألفا', date: '2024-06-20', amount: '٧,٠٠٠ ر.س', status: 'مدفوعة'},
    {id: 'INV-005', supplier: 'موردون زيتا', date: '2024-05-19', amount: '١٢,٠٠٠ ر.س', status: 'مستحقة'},
];

interface DashboardProps {
    offers: Offer[];
}

const Dashboard: React.FC<DashboardProps> = ({ offers }) => {
    
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  const totalCommission = useMemo(() => {
    return offers.reduce((sum, offer) => sum + (offer.commission || 0), 0);
  }, [offers]);

  const totalExpenses = useMemo(() => {
    return cashFlowData.reduce((sum, item) => sum + item['تدفق خارج'], 0);
  }, []);

  const filteredCashFlowData = useMemo(() => {
    return cashFlowData.filter(item => {
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        return true;
    });
  }, [startDate, endDate]);

  const filteredAgingData = useMemo(() => {
    // This is a simulation as we don't have raw invoice data on the dashboard.
    // In a real app, this would be recalculated based on all invoices due within the selected range.
    if (!startDate && !endDate) {
        return agingData;
    }
    // Use a combination of start and end dates for a more "realistic" simulation
    const seedDate = startDate ? new Date(startDate) : new Date(endDate || new Date());
    const seed = seedDate.getTime();
    
    return agingData.map((item, index) => {
        const pseudoRandomFactor = (Math.sin(seed + index) + 1) / 2; // 0 to 1
        return {...item, value: Math.floor(item.value * (0.7 + pseudoRandomFactor * 0.6)) };
    });
  }, [startDate, endDate]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(item => {
        if (startDate && item.date < startDate) return false;
        if (endDate && item.date > endDate) return false;
        return true;
    });
  }, [startDate, endDate]);


  const dashboardCardsData: DashboardCardData[] = [
    {
      title: 'إجمالي الذمم المدينة',
      value: '١,٢٥٠,٠٠٠ ر.س',
      icon: 'receivable',
      change: '+٥.٤٪',
      changeType: 'positive',
      color: 'bg-blue-500',
    },
    {
      title: 'إجمالي الذمم الدائنة',
      value: '٧٥٠,٠٠٠ ر.س',
      icon: 'payable',
      change: '+٢.١٪',
      changeType: 'positive',
      color: 'bg-orange-500',
    },
    {
      title: 'إجمالي العمولات',
      value: `${totalCommission.toLocaleString()} ر.س`,
      icon: 'cash',
      color: 'bg-green-500',
    },
    {
      title: 'إجمالي المصروفات',
      value: `${totalExpenses.toLocaleString()} ر.س`,
      icon: 'downArrow',
      color: 'bg-red-500',
    },
    {
      title: 'العملاء النشطين',
      value: '٤٥ عميل',
      icon: 'customers',
      color: 'bg-teal-500',
    },
    {
      title: 'عروض الأسعار المفتوحة',
      value: '١٢ عرض',
      icon: 'offers',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
       <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4 flex-wrap">
          <h3 className="font-bold text-slate-700 ml-2">تصفية حسب النطاق الزمني:</h3>
          <div className="flex items-center gap-2">
              <label htmlFor="start-date" className="text-sm text-slate-600">من:</label>
              <input 
                  type="date" 
                  id="start-date"
                  value={startDate || ''} 
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
              />
          </div>
          <div className="flex items-center gap-2">
              <label htmlFor="end-date" className="text-sm text-slate-600">إلى:</label>
              <input 
                  type="date"
                  id="end-date" 
                  value={endDate || ''} 
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm"
              />
          </div>
          <Button 
              onClick={() => { setStartDate(null); setEndDate(null); }} 
              variant="secondary" 
              size="sm"
          >
              إعادة تعيين
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCardsData.map((data) => (
          <DashboardCard key={data.title} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">تحليل التدفقات النقدية</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={filteredCashFlowData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="تدفق وارد" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="تدفق خارج" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">أعمار الديون (العملاء)</h3>
             <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={filteredAgingData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={(entry) => entry.name}>
                            {filteredAgingData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-4">أحدث المعاملات</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">المعرف</th>
                            <th scope="col" className="px-6 py-3">العميل/المورد</th>
                            <th scope="col" className="px-6 py-3">التاريخ</th>
                            <th scope="col" className="px-6 py-3">المبلغ</th>
                            <th scope="col" className="px-6 py-3">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{t.id}</td>
                                <td className="px-6 py-4">{t.client || t.supplier}</td>
                                <td className="px-6 py-4">{t.date}</td>
                                <td className="px-6 py-4">{t.amount}</td>
                                <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
      </div>
    </div>
  );
};

export default Dashboard;
