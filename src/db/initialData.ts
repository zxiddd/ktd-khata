import { Book, Contact, CustomLabels, LedgerEntry, Loan, Shop, ChecklistCategory } from '../types';

export const INITIAL_SHOP: Shop = {
  id: 'shop-1',
  name: 'Kachhi Textiles',
  ownerName: 'Owner',
  phone: '+91 9876543210',
  email: 'support@ktdkhata.app',
  address: 'Main Market, City',
  currency: '₹',
  createdAt: new Date().toISOString(),
};

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-1',
    shopId: 'shop-1',
    name: 'Main Khata',
    role: 'Owner',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];

// Clean empty database - zero dummy/mock contacts or fake balances
export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_ENTRIES: LedgerEntry[] = [];
export const INITIAL_LOANS: Loan[] = [];

export const INITIAL_CUSTOM_LABELS: CustomLabels = {
  gaveLabel: 'PAISE DALE',
  gotLabel: 'YOU GOT ₹',
  bookTitle: 'ktd khata',
};

export const MASTER_CHECKLIST_SECTIONS: ChecklistCategory[] = [
  {
    title: 'A. Shop and book management',
    code: 'A',
    items: [
      { id: 'A1', title: 'Shop profile', desc: 'Shop name, owner, phone, address and currency', completed: true },
      { id: 'A2', title: 'Book selector', desc: 'Switch between books and view the active book', completed: true },
      { id: 'A3', title: 'Create book', desc: 'Create another ledger book for the same shop', completed: true },
      { id: 'A4', title: 'Book ownership', desc: 'Owner profile and book-specific settings', completed: true },
      { id: 'A5', title: 'Business summary', desc: 'Contacts count, receivables and payables', completed: true },
      { id: 'A6', title: 'Data isolation', desc: 'Keep transactions and reports scoped to the selected book', completed: true },
    ],
  },
  {
    title: 'B. Contacts and customer management',
    code: 'B',
    items: [
      { id: 'B1', title: 'Add contact', desc: 'Name, phone, country code and optional details', completed: true },
      { id: 'B2', title: 'Phone contacts', desc: 'Optional contact permission and contact picker', completed: true },
      { id: 'B3', title: 'Search and filters', desc: 'Search names and numbers; filter by balances', completed: true },
      { id: 'B4', title: 'Customer profile', desc: 'Contact details, balance, ledger and loan history', completed: true },
      { id: 'B5', title: 'Contact notes', desc: 'Record useful customer information', completed: true },
      { id: 'B6', title: 'Archive contact', desc: 'Hide inactive contacts without losing history', completed: true },
      { id: 'B7', title: 'Duplicate detection', desc: 'Warn about matching phone numbers', completed: true },
      { id: 'B8', title: 'Share customer statement', desc: 'Share the selected customer’s ledger', completed: true },
    ],
  },
  {
    title: 'C. Ledger and transactions',
    code: 'C',
    items: [
      { id: 'C1', title: 'Money given', desc: 'Record credit or money the shop gives out', completed: true },
      { id: 'C2', title: 'Money received', desc: 'Record customer payments or money received', completed: true },
      { id: 'C3', title: 'Transaction amount', desc: 'Numeric keypad, paise precision and validation', completed: true },
      { id: 'C4', title: 'Transaction date', desc: 'Choose entry date and record creation time', completed: true },
      { id: 'C5', title: 'Return/due date', desc: 'Optional date for payment follow-up', completed: true },
      { id: 'C6', title: 'Notes and attachments', desc: 'Descriptions, bill images and receipt photos', completed: true },
      { id: 'C7', title: 'Success confirmation', desc: 'Show amount, contact and transaction direction', completed: true },
      { id: 'C8', title: 'Edit transaction', desc: 'Correct details while preserving history', completed: true },
      { id: 'C9', title: 'Delete and restore', desc: 'Move entries to recycle bin and restore them', completed: true },
      { id: 'C10', title: 'Running balance', desc: 'Calculate balance from posted ledger entries', completed: true },
      { id: 'C11', title: 'Share receipt', desc: 'Share a transaction confirmation via WhatsApp or SMS', completed: true },
      { id: 'C12', title: 'Ledger statement', desc: 'Date-filtered entries with opening and closing balances', completed: true },
    ],
  },
  {
    title: 'D. Dues and payment tracking',
    code: 'D',
    items: [
      { id: 'D1', title: 'Due today summary', desc: 'Track payments expected on current date', completed: true },
      { id: 'D2', title: 'Overdue detection', desc: 'Automatic overdue flag when return date lapses', completed: true },
      { id: 'D3', title: 'Partial payment allocation', desc: 'Allocate payments towards oldest obligation', completed: true },
      { id: 'D4', title: 'Explicit return date tracking', desc: 'Follow-ups grounded in contract dates', completed: true },
      { id: 'D5', title: 'Customer dues tab', desc: 'Dedicated Due tab under each customer', completed: true },
      { id: 'D6', title: 'Quick payment collection', desc: 'Collect Payments Now shortcut flow', completed: true },
      { id: 'D7', title: 'Due notification generator', desc: 'Direct WhatsApp message template for dues', completed: true },
      { id: 'D8', title: 'Settlement status', desc: 'Real-time Settled status when balance hits 0', completed: true },
      { id: 'D9', title: 'Upcoming due schedule', desc: 'Calendar timeline of incoming receivables', completed: true },
    ],
  },
  {
    title: 'E. Loan management',
    code: 'E',
    items: [
      { id: 'E1', title: 'Loan creation', desc: 'Principal, interest rate, term, frequency', completed: true },
      { id: 'E2', title: 'Auto repayment schedule', desc: 'Monthly/Weekly/Daily EMI installment calculation', completed: true },
      { id: 'E3', title: 'Installment tracking', desc: 'Pending, paid, overdue states per installment', completed: true },
      { id: 'E4', title: 'Late fee engine', desc: 'Automated late fee per day policy calculation', completed: true },
      { id: 'E5', title: 'Loan settlement', desc: 'Pay off installments and mark loan settled', completed: true },
      { id: 'E6', title: 'Convert transaction to loan', desc: 'Convert large credit entry directly to loan', completed: true },
      { id: 'E7', title: 'Loan due dashboard', desc: 'Due today & late installment summary card', completed: true },
      { id: 'E8', title: 'Loan WhatsApp reminders', desc: 'Installment reminder with principal & interest breakdown', completed: true },
    ],
  },
  {
    title: 'F. Reports and accounting tools',
    code: 'F',
    items: [
      { id: 'F1', title: 'Dashboard', desc: 'Receivables, payables, due amounts and collections', completed: true },
      { id: 'F2', title: 'Day book', desc: 'Date-wise money-in and money-out entries', completed: true },
      { id: 'F3', title: 'Date-range reports', desc: 'Daily, weekly, monthly and custom periods', completed: true },
      { id: 'F4', title: 'Contact report', desc: 'Balances and transactions by customer', completed: true },
      { id: 'F5', title: 'Loan report', desc: 'Outstanding loans and repayment performance', completed: true },
      { id: 'F6', title: 'PDF export', desc: 'Readable statements and business reports', completed: true },
      { id: 'F7', title: 'CSV export', desc: 'Data for spreadsheets and accounting', completed: true },
      { id: 'F8', title: 'Calculator', desc: 'Basic arithmetic for shop calculations', completed: true },
      { id: 'F9', title: 'EMI calculator', desc: 'Estimate instalments using principal, rate and term', completed: true },
      { id: 'F10', title: 'Recycle bin', desc: 'Recover deleted contacts and transactions', completed: true },
    ],
  },
  {
    title: 'G. Reminders and sharing',
    code: 'G',
    items: [
      { id: 'G1', title: 'Bulk WhatsApp reminder', desc: 'Select multiple customers with outstanding dues', completed: true },
      { id: 'G2', title: 'Message preview', desc: 'Preview formatted text with customer name, shop and due amount', completed: true },
      { id: 'G3', title: 'Direct WhatsApp deep link', desc: 'Open wa.me with prefilled message', completed: true },
      { id: 'G4', title: 'Reminder history & status', desc: 'Track reminder log with timestamp', completed: true },
      { id: 'G5', title: 'Share transaction receipt', desc: 'Instant share card after entry is saved', completed: true },
      { id: 'G6', title: 'Share customer ledger', desc: 'Full transaction statement shareable on WhatsApp', completed: true },
      { id: 'G7', title: 'UPI payment QR code', desc: 'Generate shop payment QR for customer remittance', completed: true },
      { id: 'G8', title: 'SMS fallback template', desc: 'Formatted SMS text for non-WhatsApp users', completed: true },
    ],
  },
  {
    title: 'H. Security, backup and preferences',
    code: 'H',
    items: [
      { id: 'H1', title: 'App lock / PIN protection', desc: '4-digit security PIN to guard shop ledger', completed: true },
      { id: 'H2', title: 'Work without internet toggle', desc: 'Offline-first state persistence', completed: true },
      { id: 'H3', title: 'Sync status monitor', desc: 'View pending uploads and cached data state', completed: true },
      { id: 'H4', title: 'Multi-language support', desc: 'English, Hindi (हिंदी), Gujarati (ગુજરાતી), Urdu (اردو)', completed: true },
      { id: 'H5', title: 'Customize labels', desc: 'Rename Paise Dale / You Got to custom phrases', completed: true },
      { id: 'H6', title: 'Data backup export', desc: 'Download full JSON database snapshot', completed: true },
      { id: 'H7', title: 'Data backup restore', desc: 'Restore database from previous snapshot JSON', completed: true },
      { id: 'H8', title: 'Audit event logging', desc: 'Keep log of critical updates and entries', completed: true },
      { id: 'H9', title: 'Shop profile customization', desc: 'Update business address, owner phone, currency', completed: true },
      { id: 'H10', title: 'Team member simulation', desc: 'Role-based access view (Owner, Staff)', completed: true },
    ],
  },
  {
    title: 'I. Reliability and quality',
    code: 'I',
    items: [
      { id: 'I1', title: 'Single source of truth', desc: 'All views observe same database state', completed: true },
      { id: 'I2', title: 'Paise precision calculations', desc: 'Accurate floating point arithmetic', completed: true },
      { id: 'I3', title: 'Reactive totals update', desc: 'Adding/editing/restoring updates dashboard in real-time', completed: true },
      { id: 'I4', title: 'Safe deletion & undo', desc: 'Soft-delete preserves history in recycle bin', completed: true },
      { id: 'I5', title: 'Multi-book isolation', desc: 'Strict scoping by active bookId', completed: true },
      { id: 'I6', title: 'Native mobile ergonomics', desc: 'Fast keypad, big touch targets, bottom bar', completed: true },
      { id: 'I7', title: 'Visual delight & feedback', desc: 'Confetti on entry saved, sound toggle feedback', completed: true },
      { id: 'I8', title: 'Zero crash test suite', desc: 'Edge cases: 0 balance, negative balance, empty state handling', completed: true },
    ],
  },
];
