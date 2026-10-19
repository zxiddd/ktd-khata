import {
  AuditEvent,
  Book,
  Contact,
  CustomLabels,
  LedgerEntry,
  Loan,
  Obligation,
  ReminderLog,
  Shop,
  ChecklistCategory,
} from '../types';
import {
  INITIAL_BOOKS,
  INITIAL_CONTACTS,
  INITIAL_CUSTOM_LABELS,
  INITIAL_ENTRIES,
  INITIAL_LOANS,
  INITIAL_SHOP,
  MASTER_CHECKLIST_SECTIONS,
} from './initialData';

const STORAGE_KEYS = {
  SHOP: 'ok_khata_shop_v1',
  BOOKS: 'ok_khata_books_v1',
  ACTIVE_BOOK_ID: 'ok_khata_active_book_id_v1',
  CONTACTS: 'ok_khata_contacts_v1',
  ENTRIES: 'ok_khata_entries_v1',
  OBLIGATIONS: 'ok_khata_obligations_v1',
  LOANS: 'ok_khata_loans_v1',
  REMINDERS: 'ok_khata_reminders_v1',
  AUDIT_LOGS: 'ok_khata_audit_logs_v1',
  CUSTOM_LABELS: 'ok_khata_labels_v1',
  CHECKLIST: 'ok_khata_checklist_v1',
  LANGUAGE: 'ok_khata_language_v1',
  OFFLINE_MODE: 'ok_khata_offline_v1',
  APP_PIN: 'ok_khata_pin_v1',
  IS_LOCKED: 'ok_khata_locked_v1',
  AUTH_USER: 'ktd_khata_auth_user_v2',
};

// Safe JSON parser
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading key ${key} from localStorage`, e);
    return fallback;
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving key ${key} to localStorage`, e);
  }
}

export const StorageEngine = {
  getShop: (): Shop => getStored<Shop>(STORAGE_KEYS.SHOP, INITIAL_SHOP),
  saveShop: (shop: Shop): void => setStored(STORAGE_KEYS.SHOP, shop),

  getBooks: (): Book[] => getStored<Book[]>(STORAGE_KEYS.BOOKS, INITIAL_BOOKS),
  saveBooks: (books: Book[]): void => setStored(STORAGE_KEYS.BOOKS, books),

  getActiveBookId: (): string => getStored<string>(STORAGE_KEYS.ACTIVE_BOOK_ID, 'book-1'),
  saveActiveBookId: (id: string): void => setStored(STORAGE_KEYS.ACTIVE_BOOK_ID, id),

  getContacts: (): Contact[] => getStored<Contact[]>(STORAGE_KEYS.CONTACTS, INITIAL_CONTACTS),
  saveContacts: (contacts: Contact[]): void => setStored(STORAGE_KEYS.CONTACTS, contacts),

  getEntries: (): LedgerEntry[] => getStored<LedgerEntry[]>(STORAGE_KEYS.ENTRIES, INITIAL_ENTRIES),
  saveEntries: (entries: LedgerEntry[]): void => setStored(STORAGE_KEYS.ENTRIES, entries),

  getLoans: (): Loan[] => getStored<Loan[]>(STORAGE_KEYS.LOANS, INITIAL_LOANS),
  saveLoans: (loans: Loan[]): void => setStored(STORAGE_KEYS.LOANS, loans),

  getReminders: (): ReminderLog[] => getStored<ReminderLog[]>(STORAGE_KEYS.REMINDERS, []),
  saveReminders: (reminders: ReminderLog[]): void => setStored(STORAGE_KEYS.REMINDERS, reminders),

  getAuditLogs: (): AuditEvent[] => getStored<AuditEvent[]>(STORAGE_KEYS.AUDIT_LOGS, [
    {
      id: 'audit-init',
      bookId: 'book-1',
      action: 'APP_INITIALIZED',
      details: 'ktd khata ledger initialized',
      timestamp: new Date().toISOString(),
    },
  ]),
  saveAuditLogs: (logs: AuditEvent[]): void => setStored(STORAGE_KEYS.AUDIT_LOGS, logs),

  getCustomLabels: (): CustomLabels => getStored<CustomLabels>(STORAGE_KEYS.CUSTOM_LABELS, INITIAL_CUSTOM_LABELS),
  saveCustomLabels: (labels: CustomLabels): void => setStored(STORAGE_KEYS.CUSTOM_LABELS, labels),

  getChecklist: (): ChecklistCategory[] => getStored<ChecklistCategory[]>(STORAGE_KEYS.CHECKLIST, MASTER_CHECKLIST_SECTIONS),
  saveChecklist: (sections: ChecklistCategory[]): void => setStored(STORAGE_KEYS.CHECKLIST, sections),

  getLanguage: (): string => getStored<string>(STORAGE_KEYS.LANGUAGE, 'en'),
  saveLanguage: (lang: string): void => setStored(STORAGE_KEYS.LANGUAGE, lang),

  getOfflineMode: (): boolean => getStored<boolean>(STORAGE_KEYS.OFFLINE_MODE, true),
  saveOfflineMode: (enabled: boolean): void => setStored(STORAGE_KEYS.OFFLINE_MODE, enabled),

  getAppPin: (): string | null => getStored<string | null>(STORAGE_KEYS.APP_PIN, null),
  saveAppPin: (pin: string | null): void => setStored(STORAGE_KEYS.APP_PIN, pin),

  // Backup & Restore
  exportFullBackup: () => {
    return {
      version: '4.8.82',
      exportedAt: new Date().toISOString(),
      shop: StorageEngine.getShop(),
      books: StorageEngine.getBooks(),
      contacts: StorageEngine.getContacts(),
      entries: StorageEngine.getEntries(),
      loans: StorageEngine.getLoans(),
      reminders: StorageEngine.getReminders(),
      auditLogs: StorageEngine.getAuditLogs(),
      customLabels: StorageEngine.getCustomLabels(),
    };
  },

  importBackup: (backupData: any): boolean => {
    try {
      if (backupData.shop) StorageEngine.saveShop(backupData.shop);
      if (backupData.books) StorageEngine.saveBooks(backupData.books);
      if (backupData.contacts) StorageEngine.saveContacts(backupData.contacts);
      if (backupData.entries) StorageEngine.saveEntries(backupData.entries);
      if (backupData.loans) StorageEngine.saveLoans(backupData.loans);
      if (backupData.reminders) StorageEngine.saveReminders(backupData.reminders);
      if (backupData.customLabels) StorageEngine.saveCustomLabels(backupData.customLabels);
      return true;
    } catch (e) {
      console.error('Backup restore failed', e);
      return false;
    }
  },

  getAuthUser: (): any => getStored<any>(STORAGE_KEYS.AUTH_USER, null),
  saveAuthUser: (user: any): void => setStored(STORAGE_KEYS.AUTH_USER, user),

  resetToDefault: () => {
    localStorage.clear();
  },

  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.CONTACTS);
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.LOANS);
    localStorage.removeItem(STORAGE_KEYS.OBLIGATIONS);
    localStorage.removeItem(STORAGE_KEYS.REMINDERS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_LOGS);
  },
};

// --- Currency & Accounting Calculations ---

/**
 * Format Indian Rupee currency format (e.g. 1968743 -> ₹19,68,743)
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  // Format with Indian numbering system
  const formatted = absAmount.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format Date to readable string e.g. "19 Oct '26" or "8 Oct 2026 • 4:15 pm"
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    }).replace(/ /g, ' ').replace(/'/, " '");
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dateStr = d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).toLowerCase();
    return `${dateStr} • ${timeStr}`;
  } catch {
    return isoString;
  }
}

/**
 * Calculate net balance for a contact
 * balance = sum(GAVE) - sum(GOT)
 * positive (> 0): Customer owes you (You will get)
 * negative (< 0): You owe customer (You will give)
 * zero (= 0): Settled
 */
export function calculateContactBalance(contactId: string, entries: LedgerEntry[]): number {
  const activeEntries = entries.filter((e) => e.contactId === contactId && !e.isDeleted);
  const gaveSum = activeEntries
    .filter((e) => e.type === 'GAVE')
    .reduce((sum, e) => sum + e.amount, 0);
  const gotSum = activeEntries
    .filter((e) => e.type === 'GOT')
    .reduce((sum, e) => sum + e.amount, 0);

  return gaveSum - gotSum;
}

/**
 * Calculate running balance for every entry in chronological order
 */
export interface EntryWithRunningBalance extends LedgerEntry {
  runningBalance: number;
}

export function calculateRunningBalances(
  contactId: string,
  entries: LedgerEntry[]
): EntryWithRunningBalance[] {
  const activeEntries = entries
    .filter((e) => e.contactId === contactId && !e.isDeleted)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let running = 0;
  return activeEntries.map((entry) => {
    if (entry.type === 'GAVE') {
      running += entry.amount;
    } else {
      running -= entry.amount;
    }
    return {
      ...entry,
      runningBalance: running,
    };
  });
}

/**
 * Dashboard totals scoped to book
 */
export interface BookDashboardTotals {
  totalYouWillGet: number; // Sum of positive balances (Receivables)
  totalYouWillGive: number; // Sum of negative balances (Payables)
  netCashFlow: number;
  dueTodayCount: number;
  dueTodayAmount: number;
  overdueCount: number;
  overdueAmount: number;
  contactsCount: number;
  activeLoansCount: number;
}

export function calculateBookDashboardTotals(
  bookId: string,
  contacts: Contact[],
  entries: LedgerEntry[],
  loans: Loan[]
): BookDashboardTotals {
  const bookContacts = contacts.filter((c) => c.bookId === bookId && c.status === 'active');
  const bookEntries = entries.filter((e) => e.bookId === bookId && !e.isDeleted);
  const bookLoans = loans.filter((l) => l.bookId === bookId && l.status === 'ACTIVE');

  let totalYouWillGet = 0;
  let totalYouWillGive = 0;

  bookContacts.forEach((contact) => {
    const balance = calculateContactBalance(contact.id, bookEntries);
    if (balance > 0) {
      totalYouWillGet += balance;
    } else if (balance < 0) {
      totalYouWillGive += Math.abs(balance);
    }
  });

  // Today string YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  let dueTodayCount = 0;
  let dueTodayAmount = 0;
  let overdueCount = 0;
  let overdueAmount = 0;

  // Check entries with returnDate
  bookEntries.forEach((entry) => {
    if (entry.returnDate && entry.type === 'GAVE') {
      const returnDateStr = entry.returnDate.split('T')[0];
      if (returnDateStr === todayStr) {
        dueTodayCount++;
        dueTodayAmount += entry.amount;
      } else if (returnDateStr < todayStr) {
        overdueCount++;
        overdueAmount += entry.amount;
      }
    }
  });

  // Check loan installments
  bookLoans.forEach((loan) => {
    loan.installments.forEach((inst) => {
      if (inst.status !== 'PAID') {
        const instDueStr = inst.dueDate.split('T')[0];
        const unpaid = inst.amount - (inst.paidAmount || 0);
        if (instDueStr === todayStr) {
          dueTodayCount++;
          dueTodayAmount += unpaid;
        } else if (instDueStr < todayStr) {
          overdueCount++;
          overdueAmount += unpaid;
        }
      }
    });
  });

  return {
    totalYouWillGet,
    totalYouWillGive,
    netCashFlow: totalYouWillGet - totalYouWillGive,
    dueTodayCount,
    dueTodayAmount,
    overdueCount,
    overdueAmount,
    contactsCount: bookContacts.length,
    activeLoansCount: bookLoans.length,
  };
}
