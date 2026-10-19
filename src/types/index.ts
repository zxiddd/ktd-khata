export type TransactionType = 'GAVE' | 'GOT';

export interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  shopName: string;
  email?: string;
  isLoggedIn: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  shopId: string;
  name: string;
  role: 'Owner' | 'Manager' | 'Staff';
  isDefault: boolean;
  createdAt: string;
}

export interface Contact {
  id: string;
  bookId: string;
  name: string;
  phone: string;
  countryCode: string;
  notes?: string;
  customerType: 'customer' | 'supplier';
  status: 'active' | 'archived' | 'deleted';
  tag?: string; // e.g. "Mall aya", "They'll Pay", "VIP"
  createdAt: string;
  updatedAt: string;
}

export interface LedgerEntry {
  id: string;
  bookId: string;
  contactId: string;
  type: TransactionType; // 'GAVE' (You Gave / Paise Dale) or 'GOT' (You Got / Paise Mile)
  amount: number;
  date: string; // ISO string
  returnDate?: string; // Optional due date for follow-up
  notes?: string;
  attachmentUrl?: string; // Bill/Receipt photo data URI
  linkedObligationId?: string;
  linkedLoanId?: string;
  isDeleted: boolean;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Obligation {
  id: string;
  bookId: string;
  contactId: string;
  ledgerEntryId: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
}

export interface Installment {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  principalComponent: number;
  interestComponent: number;
  paidAmount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE';
  paidDate?: string;
}

export interface Loan {
  id: string;
  bookId: string;
  contactId: string;
  contactName: string;
  principal: number;
  interestRateAnnual: number;
  termMonths: number;
  frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
  startDate: string;
  totalInterest: number;
  totalPayable: number;
  emiAmount: number;
  lateFeePerDay: number;
  notes?: string;
  status: 'ACTIVE' | 'SETTLED' | 'DEFAULTED';
  installments: Installment[];
  createdAt: string;
}

export interface ReminderLog {
  id: string;
  bookId: string;
  contactId: string;
  contactName: string;
  amount: number;
  dueDate: string;
  message: string;
  channel: 'WHATSAPP' | 'SMS';
  sentAt: string;
}

export interface AuditEvent {
  id: string;
  bookId: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface CustomLabels {
  gaveLabel: string; // default "Paise Dale" or "You Gave"
  gotLabel: string; // default "You Got" or "Paise Mile"
  bookTitle: string; // default "Ok Khata"
}

export interface ChecklistCategory {
  title: string;
  code: string;
  items: {
    id: string;
    title: string;
    desc: string;
    completed: boolean;
  }[];
}
