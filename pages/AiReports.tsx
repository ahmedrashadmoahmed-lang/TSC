import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Icon } from '../components/shared/Icon';
import Button from '../components/shared/Button';

// Importing data from other modules
import { initialInvoices } from './AccountsReceivable';
import { initialPayables } from './AccountsPayable';
import { initialOffers } from './Offers';
import { initialCustomers } from './Customers';
import { initialInventoryItems } from './Inventory';
// FIX: `initialPurchaseOrders` is exported from `App.tsx`, not `PurchaseOrders.tsx`.
import { initialPurchaseOrders } from '../App';

interface AiResponse {
    summary: string;
    chartType: 'line' | 'bar' | 'pie' | 'none';
    chartData: any[];
}

const examplePrompts = [
    "قارن إجمالي المبيعات (الفواتير المدفوعة) مقابل إجمالي المصروفات (فواتير الموردين المدفوعة) خلال الأشهر الثلاثة الماضية.",
    "ما هي توقعات التدفق النقدي للشهر القادم بناءً على الفواتير المستحقة للدفع والمستحقة للتحصيل؟",
    "من هم أكبر 3 عملاء من حيث قيمة الفواتير الإجمالية؟ اعرض النتيجة في مخطط دائري.",
    "حلل ربحية عرض السعر Q-2024-003.",
];

const AiReports: React.FC = () => {
    const [query, setQuery] = useState<string>('');
    const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateReport = async () => {
        if (!query.trim()) {
            setError("يرجى إدخال سؤال للبدء.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAiResponse(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            
            // Format the data for the prompt
            const dataContext = `
                **بيانات الذمم المدينة (الفواتير):**
                ${JSON.stringify(initialInvoices.slice(0, 10), null, 2)}

                **بيانات الذمم الدائنة (فواتير الموردين):**
                ${JSON.stringify(initialPayables.slice(0, 10), null, 2)}
                
                **بيانات عروض الأسعار:**
                ${JSON.stringify(initialOffers.slice(0, 10).map(o => ({...o, items: o.items.length})), null, 2)}

                **بيانات أوامر الشراء:**
                ${JSON.stringify(initialPurchaseOrders.slice(0, 10).map(po => ({...po, items: po.items.length})), null, 2)}
            `;

            const prompt = `
                أنت محلل مالي وخبير في ذكاء الأعمال. مهمتك هي تحليل البيانات المالية التالية لشركة صغيرة والإجابة على سؤال المستخدم.
                
                **البيانات المتاحة:**
                ${dataContext}

                **سؤال المستخدم:**
                "${query}"

                **المطلوب:**
                قدم إجابتك بتنسيق JSON حصريًا. يجب أن يحتوي كائن JSON على المفاتيح التالية:
                1.  "summary": سلسلة نصية (string) تحتوي على إجابة نصية مفصلة وواضحة لسؤال المستخدم. استخدم تنسيق الماركداون الخفيف (مثل **للنص العريض** والقوائم النقطية) لجعل الملخص سهل القراءة.
                2.  "chartType": سلسلة نصية (string) تكون إحدى هذه القيم: 'line', 'bar', 'pie', أو 'none'. اختر أفضل نوع مخطط لتصور البيانات المتعلقة بالإجابة. استخدم 'none' إذا لم يكن المخطط مناسبًا.
                3.  "chartData": مصفوفة (array) من الكائنات (objects) مناسبة لمكتبة الرسوم البيانية مثل Recharts. مثال لمخطط شريطي: \`[{"name": "العميل أ", "Value": 45000}, {"name": "العميل ب", "Value": 30000}]\`. إذا كان chartType هو 'none'، يجب أن تكون هذه مصفوفة فارغة. يجب أن يكون مفتاح القيمة (مثل "Value" في المثال) ثابتًا ومتسقًا.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: prompt,
            });
            
            const rawText = response.text.trim();
            const jsonText = rawText.startsWith('```json') ? rawText.replace(/```json\n|```/g, '') : rawText;

            try {
                const parsedResponse: AiResponse = JSON.parse(jsonText);
                setAiResponse(parsedResponse);
            } catch (parseError) {
                console.error("JSON Parsing Error:", parseError, "Raw Text:", jsonText);
                setError("لم يتمكن الذكاء الاصطناعي من تنسيق الاستجابة بشكل صحيح. يرجى محاولة تعديل سؤالك.");
            }

        } catch (e) {
            console.error("Error generating AI report:", e);
            setError("حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى المحاولة مرة أخرى.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderChart = () => {
        if (!aiResponse || aiResponse.chartType === 'none' || aiResponse.chartData.length === 0) {
            return null;
        }

        const dataKey = Object.keys(aiResponse.chartData[0]).find(key => key !== 'name') || 'Value';

        return (
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    {aiResponse.chartType === 'bar' && (
                        <BarChart data={aiResponse.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={dataKey} fill="#8884d8" />
                        </BarChart>
                    )}
                    {aiResponse.chartType === 'line' && (
                         <LineChart data={aiResponse.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey={dataKey} stroke="#82ca9d" />
                        </LineChart>
                    )}
                     {aiResponse.chartType === 'pie' && (
                        <PieChart>
                            <Pie data={aiResponse.chartData} dataKey={dataKey} nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {aiResponse.chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    )}
                </ResponsiveContainer>
            </div>
        )
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <Icon name="ai" className="w-12 h-12 mx-auto text-indigo-600"/>
                <h2 className="text-2xl font-bold text-slate-800 mt-2">التقارير الذكية</h2>
                <p className="text-slate-500 mt-1 max-w-2xl mx-auto">اطرح سؤالاً باللغة الطبيعية واحصل على تحليلات ورؤى فورية حول بيانات عملك.</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm">
                <div className="space-y-3">
                    <label htmlFor="ai-query" className="font-semibold text-slate-700">سؤالك لـ "محاسبي برو":</label>
                    <textarea 
                        id="ai-query"
                        rows={3}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="مثال: ما هو إجمالي الذمم المدينة المتأخرة؟"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                     <div className="text-xs text-slate-500">
                        <span className="font-semibold">أمثلة:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                        {examplePrompts.map(p => (
                            <button key={p} onClick={() => setQuery(p)} className="px-2 py-1 bg-slate-100 rounded hover:bg-slate-200 transition">
                                {p}
                            </button>
                        ))}
                        </div>
                    </div>
                    <div className="text-right">
                        <Button onClick={handleGenerateReport} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></span>
                                    جاري التحليل...
                                </>
                            ) : (
                                <>
                                    <Icon name="reports" className="w-5 h-5 ml-2"/>
                                    إنشاء التقرير
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg" role="alert">
                    <p className="font-bold">خطأ في التحليل</p>
                    <p>{error}</p>
                </div>
            )}

            {aiResponse && (
                <div className="bg-white p-6 rounded-2xl shadow-sm animate-fade-in">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">نتائج التحليل</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap leading-relaxed">
                            {aiResponse.summary}
                        </div>
                        <div className="lg:border-r lg:pr-6 border-slate-200">
                           {renderChart() || <p className="text-center text-slate-400 p-8">لا يوجد مخطط بياني لهذه الإجابة.</p>}
                        </div>
                    </div>
                </div>
            )}
             <style>{`
                @keyframes fade-in {
                    0% { opacity: 0; transform: translateY(10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
             `}</style>
        </div>
    );
};

export default AiReports;