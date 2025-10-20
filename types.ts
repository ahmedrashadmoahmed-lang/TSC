export type IconName = 
  'dashboard' | 'receivable' | 'payable' | 'reports' | 'cash' | 'upArrow' | 'downArrow' |
  'search' | 'notification' | 'settings' | 'add' | 'ai' | 'edit' | 'delete' | 'close' |
  'offers' | 'info' | 'checkmark' | 'send' | 'customers' | 'suppliers' | 'inventory' |
  'purchase-order' | 'email' | 'whatsapp' | 'invoice';

export interface DashboardCardData {
  title: string;
  value: string;
  icon: IconName;
  change?: string;
  changeType?: 'positive' | 'negative';
  color: string;
}

export type TransactionStatus = 'مدفوعة' | 'مستحقة' | 'متأخرة';

export interface Transaction {
    id: string;
    client?: string;
    supplier?: string;
    date: string;
    amount: string;
    status: TransactionStatus;
}

export type InvoiceStatus = TransactionStatus;

export interface Invoice {
    id: string;
    customerId: string;
    customerName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: InvoiceStatus;
}

export interface Customer {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
    registrationDate: string;
}

export type PayableStatus = TransactionStatus;

export interface Payable {
    id: string;
    supplierId: string;
    supplierName: string;
    issueDate: string;
    dueDate: string;
    amount: number;
    status: PayableStatus;
}

export type OfferStatus = 'جديد' | 'قيد التسعير' | 'مرسل' | 'مقبول' | 'مرفوض' | 'قيد التفاوض' | 'تحول لفاتورة' | 'تم إنشاء أمر شراء';

export interface SupplierQuote {
    supplierId: string;
    supplierName: string;
    price: number;
}

export interface OfferItem {
    id: string;
    description: string;
    quantity: number;
    supplierQuotes: SupplierQuote[];
    sellingPricePerUnit?: number;
}

export interface Offer {
    id: string;
    customerId: string;
    customerName: string;
    subject: string;
    issueDate: string;
    validUntil: string;
    status: OfferStatus;
    items: OfferItem[];
    totalSellingPrice: number;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}

export type InventoryStatus = 'متوفر' | 'كمية قليلة' | 'نفذ المخزون';

export interface InventoryItem {
    id:string;
    name: string;
    sku: string;
    category: string;
    quantity: number;
    reorderPoint: number;
    supplierId: string;
    costPrice: number;
    sellingPrice: number;
    status: InventoryStatus;
    salesVelocity: number;
    leadTimeDays: number;
}

export type PurchaseOrderStatus = 'مسودة' | 'مرسل' | 'مستلم جزئياً' | 'مستلم' | 'ملغي';

export interface PurchaseOrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface PurchaseOrder {
    id: string;
    supplierId: string;
    supplierName: string;
    orderDate: string;
    expectedDeliveryDate: string;
    items: PurchaseOrderItem[];
    totalAmount: number;
    status: PurchaseOrderStatus;
}

export interface Communication {
    id: string;
    customerId: string;
    date: string;
    type: 'Email' | 'WhatsApp';
    summary: string;
    offerId?: string;
}