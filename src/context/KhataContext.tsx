import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Book,
  Contact,
  CustomLabels,
  LedgerEntry,
  Loan,
  Shop,
  ChecklistCategory,
  TransactionType,
  Installment,
} from '../types';
import {
  calculateBookDashboardTotals,
  calculateContactBalance,
  calculateRunningBalances,
  EntryWithRunningBalance,
  formatCurrency,
  StorageEngine,
} from '../db/storage';
import confetti from 'canvas-confetti';

export type ActiveTab = 'contacts' | 'loans' | 'tools' | 'settings';

export type ContactFilter = 'ALL' | 'GET' | 'GIVE' | 'SETTLED';

export type ContactSort = 'RECENT' | 'AMOUNT_HIGH' | 'NAME_ASC';

interface KhataContextType {
  // Authentication
  user: any;
  login: (data: { phone: string; name?: string; shopName?: string }) => void;
  signup: (data: { shopName: string; ownerName: string; phone: string }) => void;
  logout: () => void;
  clearAllShopData: () => void;

  // Navigation
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Shop & Books
  shop: Shop;
  updateShop: (shop: Shop) => void;
  books: Book[];
  activeBookId: string;
  activeBook: Book;
  switchBook: (bookId: string) => void;
  createBook: (name: string) => void;

  // Contacts
  contacts: Contact[];
  activeContact: Contact | null;
  setActiveContact: (contact: Contact | null) => void;
  addContact: (data: { name: string; phone: string; countryCode: string; notes?: string; customerType?: 'customer' | 'supplier' }) => Contact;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  restoreContact: (id: string) => void;

  // Filter & Search
  contactSearchQuery: string;
  setContactSearchQuery: (q: string) => void;
  contactFilter: ContactFilter;
  setContactFilter: (f: ContactFilter) => void;
  contactSort: ContactSort;
  setContactSort: (s: ContactSort) => void;
  filteredContacts: Contact[];

  // Ledger Entries
  entries: LedgerEntry[];
  addTransaction: (data: {
    contactId: string;
    type: TransactionType;
    amount: number;
    date: string;
    returnDate?: string;
    notes?: string;
    attachmentUrl?: string;
  }) => LedgerEntry;
  updateTransaction: (id: string, updates: Partial<LedgerEntry>) => void;
  deleteTransaction: (id: string) => void;
  restoreTransaction: (id: string) => void;
  getContactRunningEntries: (contactId: string) => EntryWithRunningBalance[];
  getContactBalanceAmount: (contactId: string) => number;

  // Loans
  loans: Loan[];
  createLoan: (data: {
    contactId: string;
    principal: number;
    interestRateAnnual: number;
    termMonths: number;
    frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
    startDate: string;
    notes?: string;
  }) => Loan;
  recordInstallmentPayment: (loanId: string, installmentId: string, amount: number) => void;
  settleLoanFull: (loanId: string) => void;

  // Dashboard Totals
  dashboardTotals: ReturnType<typeof calculateBookDashboardTotals>;

  // Recycle Bin
  deletedEntries: LedgerEntry[];
  deletedContacts: Contact[];

  // Labels & Preferences
  customLabels: CustomLabels;
  updateCustomLabels: (labels: CustomLabels) => void;
  offlineMode: boolean;
  toggleOfflineMode: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  appPin: string | null;
  setAppPin: (pin: string | null) => void;
  isAppLocked: boolean;
  unlockApp: (enteredPin: string) => boolean;

  // Master Checklist
  checklist: ChecklistCategory[];
  toggleChecklistItem: (sectionCode: string, itemId: string) => void;
  resetChecklistTicks: () => void;
  checklistCompletedCount: number;
  checklistTotalCount: number;

  // Modals / Overlays
  activeModal: string | null;
  openModal: (modalName: string, modalProps?: any) => void;
  closeModal: () => void;
  modalProps: any;

  // Helpers
  triggerWhatsAppShare: (phone: string, message: string) => void;
  triggerConfettiCelebration: () => void;
  exportDatabaseJson: () => void;
  importDatabaseJson: (file: File) => Promise<boolean>;
  exportLedgerCsv: () => void;
}

const KhataContext = createContext<KhataContextType | null>(null);

export const KhataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('contacts');

  // Load from StorageEngine
  const [shop, setShopState] = useState<Shop>(() => StorageEngine.getShop());
  const [books, setBooksState] = useState<Book[]>(() => StorageEngine.getBooks());
  const [activeBookId, setActiveBookIdState] = useState<string>(() => StorageEngine.getActiveBookId());
  const [contacts, setContactsState] = useState<Contact[]>(() => StorageEngine.getContacts());
  const [entries, setEntriesState] = useState<LedgerEntry[]>(() => StorageEngine.getEntries());
  const [loans, setLoansState] = useState<Loan[]>(() => StorageEngine.getLoans());
  const [customLabels, setCustomLabelsState] = useState<CustomLabels>(() => StorageEngine.getCustomLabels());
  const [checklist, setChecklistState] = useState<ChecklistCategory[]>(() => StorageEngine.getChecklist());
  const [offlineMode, setOfflineModeState] = useState<boolean>(() => StorageEngine.getOfflineMode());
  const [language, setLanguageState] = useState<string>(() => StorageEngine.getLanguage());
  const [appPin, setAppPinState] = useState<string | null>(() => StorageEngine.getAppPin());
  const [isAppLocked, setIsAppLocked] = useState<boolean>(() => !!StorageEngine.getAppPin());
  const [user, setUserState] = useState<any>(() => StorageEngine.getAuthUser());

  const login = (data: { phone: string; name?: string; shopName?: string }) => {
    const authUser = {
      id: `user-${Date.now()}`,
      name: data.name || shop.ownerName || 'Shop Owner',
      phone: data.phone,
      shopName: data.shopName || shop.name,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    setUserState(authUser);
    StorageEngine.saveAuthUser(authUser);
  };

  const signup = (data: { shopName: string; ownerName: string; phone: string }) => {
    const authUser = {
      id: `user-${Date.now()}`,
      name: data.ownerName,
      phone: data.phone,
      shopName: data.shopName,
      isLoggedIn: true,
      createdAt: new Date().toISOString(),
    };
    setUserState(authUser);
    StorageEngine.saveAuthUser(authUser);

    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      name: data.shopName,
      ownerName: data.ownerName,
      phone: data.phone,
      email: '',
      address: 'Main Market',
      currency: '₹',
      createdAt: new Date().toISOString(),
    };
    const newBooks: Book[] = [
      {
        id: `book-${Date.now()}`,
        shopId: newShop.id,
        name: data.shopName,
        role: 'Owner',
        isDefault: true,
        createdAt: new Date().toISOString(),
      },
    ];

    setShopState(newShop);
    StorageEngine.saveShop(newShop);
    setBooksState(newBooks);
    StorageEngine.saveBooks(newBooks);
    setActiveBookIdState(newBooks[0].id);
    StorageEngine.saveActiveBookId(newBooks[0].id);

    setContactsState([]);
    StorageEngine.saveContacts([]);
    setEntriesState([]);
    StorageEngine.saveEntries([]);
    setLoansState([]);
    StorageEngine.saveLoans([]);
  };

  const logout = () => {
    setUserState(null);
    StorageEngine.saveAuthUser(null);
    setActiveContact(null);
  };

  const clearAllShopData = () => {
    setContactsState([]);
    StorageEngine.saveContacts([]);
    setEntriesState([]);
    StorageEngine.saveEntries([]);
    setLoansState([]);
    StorageEngine.saveLoans([]);
    setActiveContact(null);
  };

  // Active contact for detail view
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  // Search & Filter
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState<ContactFilter>('ALL');
  const [contactSort, setContactSort] = useState<ContactSort>('RECENT');

  // Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalProps, setModalProps] = useState<any>(null);

  const activeBook = books.find((b) => b.id === activeBookId) || books[0] || {
    id: 'book-1',
    shopId: 'shop-1',
    name: 'Kachhi Textiles',
    role: 'Owner',
    isDefault: true,
    createdAt: new Date().toISOString(),
  };

  // Sync state mutations to storage
  const updateShop = (newShop: Shop) => {
    setShopState(newShop);
    StorageEngine.saveShop(newShop);
    if (user) {
      const updatedUser = {
        ...user,
        name: newShop.ownerName || user.name,
        shopName: newShop.name || user.shopName,
        phone: newShop.phone || user.phone,
      };
      setUserState(updatedUser);
      StorageEngine.saveAuthUser(updatedUser);
    }
  };

  const switchBook = (bookId: string) => {
    setActiveBookIdState(bookId);
    StorageEngine.saveActiveBookId(bookId);
    setActiveContact(null);
  };

  const createBook = (name: string) => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      shopId: shop.id,
      name,
      role: 'Owner',
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [...books, newBook];
    setBooksState(updated);
    StorageEngine.saveBooks(updated);
    switchBook(newBook.id);
  };

  const addContact = (data: {
    name: string;
    phone: string;
    countryCode: string;
    notes?: string;
    customerType?: 'customer' | 'supplier';
  }): Contact => {
    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      bookId: activeBookId,
      name: data.name.trim(),
      phone: data.phone.trim(),
      countryCode: data.countryCode || '+91',
      notes: data.notes || '',
      customerType: data.customerType || 'customer',
      status: 'active',
      tag: "They'll Pay",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [newContact, ...contacts];
    setContactsState(updated);
    StorageEngine.saveContacts(updated);
    return newContact;
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c));
    setContactsState(updated);
    StorageEngine.saveContacts(updated);
    if (activeContact && activeContact.id === id) {
      setActiveContact((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteContact = (id: string) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, status: 'deleted' as const, updatedAt: new Date().toISOString() } : c));
    setContactsState(updated);
    StorageEngine.saveContacts(updated);
    if (activeContact?.id === id) {
      setActiveContact(null);
    }
  };

  const restoreContact = (id: string) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, status: 'active' as const, updatedAt: new Date().toISOString() } : c));
    setContactsState(updated);
    StorageEngine.saveContacts(updated);
  };

  const addTransaction = (data: {
    contactId: string;
    type: TransactionType;
    amount: number;
    date: string;
    returnDate?: string;
    notes?: string;
    attachmentUrl?: string;
  }): LedgerEntry => {
    const newEntry: LedgerEntry = {
      id: `entry-${Date.now()}`,
      bookId: activeBookId,
      contactId: data.contactId,
      type: data.type,
      amount: data.amount,
      date: data.date || new Date().toISOString(),
      returnDate: data.returnDate,
      notes: data.notes || '',
      attachmentUrl: data.attachmentUrl,
      isDeleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newEntry, ...entries];
    setEntriesState(updated);
    StorageEngine.saveEntries(updated);

    // Update contact timestamp
    updateContact(data.contactId, { updatedAt: new Date().toISOString() });

    return newEntry;
  };

  const updateTransaction = (id: string, updates: Partial<LedgerEntry>) => {
    const updated = entries.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
    setEntriesState(updated);
    StorageEngine.saveEntries(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, isDeleted: true, deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : e
    );
    setEntriesState(updated);
    StorageEngine.saveEntries(updated);
  };

  const restoreTransaction = (id: string) => {
    const updated = entries.map((e) =>
      e.id === id ? { ...e, isDeleted: false, deletedAt: undefined, updatedAt: new Date().toISOString() } : e
    );
    setEntriesState(updated);
    StorageEngine.saveEntries(updated);
  };

  const getContactRunningEntries = (contactId: string) => {
    return calculateRunningBalances(contactId, entries);
  };

  const getContactBalanceAmount = (contactId: string) => {
    return calculateContactBalance(contactId, entries);
  };

  // Loans
  const createLoan = (data: {
    contactId: string;
    principal: number;
    interestRateAnnual: number;
    termMonths: number;
    frequency: 'MONTHLY' | 'WEEKLY' | 'DAILY';
    startDate: string;
    notes?: string;
  }): Loan => {
    const targetContact = contacts.find((c) => c.id === data.contactId);
    const contactName = targetContact ? targetContact.name : 'Unknown';

    // Calculate EMI: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = data.interestRateAnnual / 100 / 12;
    const n = Math.max(1, data.termMonths);
    let emi = 0;
    if (monthlyRate === 0) {
      emi = Math.round(data.principal / n);
    } else {
      emi = Math.round(
        (data.principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1)
      );
    }

    const totalPayable = emi * n;
    const totalInterest = Math.max(0, totalPayable - data.principal);

    // Generate installment schedules
    const installments: Installment[] = [];
    const baseDate = new Date(data.startDate);

    for (let i = 1; i <= n; i++) {
      const instDueDate = new Date(baseDate);
      if (data.frequency === 'DAILY') {
        instDueDate.setDate(instDueDate.getDate() + i);
      } else if (data.frequency === 'WEEKLY') {
        instDueDate.setDate(instDueDate.getDate() + i * 7);
      } else {
        instDueDate.setMonth(instDueDate.getMonth() + i);
      }

      installments.push({
        id: `inst-${Date.now()}-${i}`,
        loanId: '',
        installmentNumber: i,
        dueDate: instDueDate.toISOString().split('T')[0],
        amount: emi,
        principalComponent: Math.round(data.principal / n),
        interestComponent: Math.round(totalInterest / n),
        paidAmount: 0,
        status: 'PENDING',
      });
    }

    const newLoan: Loan = {
      id: `loan-${Date.now()}`,
      bookId: activeBookId,
      contactId: data.contactId,
      contactName,
      principal: data.principal,
      interestRateAnnual: data.interestRateAnnual,
      termMonths: data.termMonths,
      frequency: data.frequency,
      startDate: data.startDate,
      totalInterest,
      totalPayable,
      emiAmount: emi,
      lateFeePerDay: 50,
      notes: data.notes,
      status: 'ACTIVE',
      installments,
      createdAt: new Date().toISOString(),
    };

    // link loanId to installments
    newLoan.installments.forEach((inst) => {
      inst.loanId = newLoan.id;
    });

    const updated = [newLoan, ...loans];
    setLoansState(updated);
    StorageEngine.saveLoans(updated);

    // Also record a ledger entry for loan disbursement (You Gave money)
    addTransaction({
      contactId: data.contactId,
      type: 'GAVE',
      amount: data.principal,
      date: new Date().toISOString(),
      notes: `Loan Disbursed #${newLoan.id.slice(-4)} (${n} ${data.frequency.toLowerCase()} installments)`,
    });

    return newLoan;
  };

  const recordInstallmentPayment = (loanId: string, installmentId: string, amount: number) => {
    const updatedLoans = loans.map((l) => {
      if (l.id !== loanId) return l;
      const updatedInstallments = l.installments.map((inst) => {
        if (inst.id !== installmentId) return inst;
        const newPaid = (inst.paidAmount || 0) + amount;
        const isFull = newPaid >= inst.amount;
        return {
          ...inst,
          paidAmount: newPaid,
          status: isFull ? ('PAID' as const) : ('PARTIAL' as const),
          paidDate: isFull ? new Date().toISOString() : undefined,
        };
      });

      const allPaid = updatedInstallments.every((i) => i.status === 'PAID');
      return {
        ...l,
        installments: updatedInstallments,
        status: allPaid ? ('SETTLED' as const) : l.status,
      };
    });

    setLoansState(updatedLoans);
    StorageEngine.saveLoans(updatedLoans);

    // Also record a ledger entry (Customer Paid installment / You Got money)
    const targetLoan = loans.find((l) => l.id === loanId);
    if (targetLoan) {
      addTransaction({
        contactId: targetLoan.contactId,
        type: 'GOT',
        amount,
        date: new Date().toISOString(),
        notes: `Loan Repayment #${loanId.slice(-4)}`,
      });
    }
  };

  const settleLoanFull = (loanId: string) => {
    const targetLoan = loans.find((l) => l.id === loanId);
    if (!targetLoan) return;

    let remainingTotal = 0;
    const updatedLoans = loans.map((l) => {
      if (l.id !== loanId) return l;
      const settledInstallments = l.installments.map((inst) => {
        const remaining = Math.max(0, inst.amount - (inst.paidAmount || 0));
        remainingTotal += remaining;
        return {
          ...inst,
          paidAmount: inst.amount,
          status: 'PAID' as const,
          paidDate: new Date().toISOString(),
        };
      });
      return {
        ...l,
        installments: settledInstallments,
        status: 'SETTLED' as const,
      };
    });

    setLoansState(updatedLoans);
    StorageEngine.saveLoans(updatedLoans);

    if (remainingTotal > 0) {
      addTransaction({
        contactId: targetLoan.contactId,
        type: 'GOT',
        amount: remainingTotal,
        date: new Date().toISOString(),
        notes: `Full Loan Early Settlement #${loanId.slice(-4)}`,
      });
    }
  };

  // Dashboard Totals
  const dashboardTotals = calculateBookDashboardTotals(
    activeBookId,
    contacts,
    entries,
    loans
  );

  // Filtered contacts
  const activeBookContacts = contacts.filter(
    (c) => c.bookId === activeBookId && c.status === 'active'
  );

  const filteredContacts = activeBookContacts.filter((c) => {
    const q = contactSearchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      (c.tag && c.tag.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    const balance = calculateContactBalance(c.id, entries);
    if (contactFilter === 'GET') return balance > 0;
    if (contactFilter === 'GIVE') return balance < 0;
    if (contactFilter === 'SETTLED') return balance === 0;
    return true;
  }).sort((a, b) => {
    if (contactSort === 'NAME_ASC') return a.name.localeCompare(b.name);
    if (contactSort === 'AMOUNT_HIGH') {
      const balA = Math.abs(calculateContactBalance(a.id, entries));
      const balB = Math.abs(calculateContactBalance(b.id, entries));
      return balB - balA;
    }
    // RECENT
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  // Recycle bin items
  const deletedEntries = entries.filter((e) => e.bookId === activeBookId && e.isDeleted);
  const deletedContacts = contacts.filter((c) => c.bookId === activeBookId && c.status === 'deleted');

  // Labels & Preferences
  const updateCustomLabels = (labels: CustomLabels) => {
    setCustomLabelsState(labels);
    StorageEngine.saveCustomLabels(labels);
  };

  const toggleOfflineMode = () => {
    const nextVal = !offlineMode;
    setOfflineModeState(nextVal);
    StorageEngine.saveOfflineMode(nextVal);
  };

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    StorageEngine.saveLanguage(lang);
  };

  const setAppPin = (pin: string | null) => {
    setAppPinState(pin);
    StorageEngine.saveAppPin(pin);
  };

  const unlockApp = (enteredPin: string): boolean => {
    if (!appPin || enteredPin === appPin) {
      setIsAppLocked(false);
      return true;
    }
    return false;
  };

  // Master Checklist
  const toggleChecklistItem = (sectionCode: string, itemId: string) => {
    const updated = checklist.map((sec) => {
      if (sec.code !== sectionCode) return sec;
      return {
        ...sec,
        items: sec.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
      };
    });
    setChecklistState(updated);
    StorageEngine.saveChecklist(updated);
  };

  const resetChecklistTicks = () => {
    const updated = checklist.map((sec) => ({
      ...sec,
      items: sec.items.map((item) => ({ ...item, completed: false })),
    }));
    setChecklistState(updated);
    StorageEngine.saveChecklist(updated);
  };

  let checklistCompletedCount = 0;
  let checklistTotalCount = 0;
  checklist.forEach((sec) => {
    sec.items.forEach((item) => {
      checklistTotalCount++;
      if (item.completed) checklistCompletedCount++;
    });
  });

  // Modal helpers
  const openModal = (modalName: string, props: any = null) => {
    setActiveModal(modalName);
    setModalProps(props);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalProps(null);
  };

  // Confetti celebration
  const triggerConfettiCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0e8354', '#22c55e', '#10b981', '#34d399', '#f59e0b'],
      });
    } catch {
      // ignore
    }
  };

  // WhatsApp reminder deep link
  const triggerWhatsAppShare = (phone: string, message: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const encodedMsg = encodeURIComponent(message);
    const targetUrl = cleanPhone.length >= 10
      ? `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : '91' + cleanPhone}?text=${encodedMsg}`
      : `https://wa.me/?text=${encodedMsg}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  // Backup / Export
  const exportDatabaseJson = () => {
    const snapshot = StorageEngine.exportFullBackup();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(snapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ok_khata_backup_${shop.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importDatabaseJson = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          const success = StorageEngine.importBackup(parsed);
          if (success) {
            // Reload states
            setShopState(StorageEngine.getShop());
            setBooksState(StorageEngine.getBooks());
            setContactsState(StorageEngine.getContacts());
            setEntriesState(StorageEngine.getEntries());
            setLoansState(StorageEngine.getLoans());
            setCustomLabelsState(StorageEngine.getCustomLabels());
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  };

  const exportLedgerCsv = () => {
    const bookEntries = entries.filter((e) => e.bookId === activeBookId && !e.isDeleted);
    let csv = 'Entry ID,Date,Contact Name,Type,Amount (INR),Notes,Return Date\n';
    bookEntries.forEach((entry) => {
      const contact = contacts.find((c) => c.id === entry.contactId);
      const contactName = contact ? `"${contact.name.replace(/"/g, '""')}"` : 'Unknown';
      const notes = entry.notes ? `"${entry.notes.replace(/"/g, '""')}"` : '';
      csv += `${entry.id},${entry.date},${contactName},${entry.type},${entry.amount},${notes},${entry.returnDate || ''}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ok_khata_${activeBook.name.replace(/\s+/g, '_')}_entries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <KhataContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        clearAllShopData,
        activeTab,
        setActiveTab,
        shop,
        updateShop,
        books,
        activeBookId,
        activeBook,
        switchBook,
        createBook,
        contacts,
        activeContact,
        setActiveContact,
        addContact,
        updateContact,
        deleteContact,
        restoreContact,
        contactSearchQuery,
        setContactSearchQuery,
        contactFilter,
        setContactFilter,
        contactSort,
        setContactSort,
        filteredContacts,
        entries,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        restoreTransaction,
        getContactRunningEntries,
        getContactBalanceAmount,
        loans,
        createLoan,
        recordInstallmentPayment,
        settleLoanFull,
        dashboardTotals,
        deletedEntries,
        deletedContacts,
        customLabels,
        updateCustomLabels,
        offlineMode,
        toggleOfflineMode,
        language,
        setLanguage,
        appPin,
        setAppPin,
        isAppLocked,
        unlockApp,
        checklist,
        toggleChecklistItem,
        resetChecklistTicks,
        checklistCompletedCount,
        checklistTotalCount,
        activeModal,
        openModal,
        closeModal,
        modalProps,
        triggerWhatsAppShare,
        triggerConfettiCelebration,
        exportDatabaseJson,
        importDatabaseJson,
        exportLedgerCsv,
      }}
    >
      {children}
    </KhataContext.Provider>
  );
};

export const useKhata = () => {
  const context = useContext(KhataContext);
  if (!context) {
    throw new Error('useKhata must be used within a KhataProvider');
  }
  return context;
};
