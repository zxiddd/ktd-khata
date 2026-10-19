import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { Contact, LedgerEntry, TransactionType } from '../../types';
import {
  ArrowLeft,
  MoreVertical,
  Share2,
  Phone,
  MessageCircle,
  FileText,
  Trash2,
  Calendar,
  AlertCircle,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Edit,
} from 'lucide-react';
import {
  calculateContactBalance,
  calculateRunningBalances,
  formatCurrency,
  formatDateTime,
  formatDate,
} from '../../db/storage';

export const CustomerDetailView: React.FC<{ contact: Contact }> = ({ contact }) => {
  const {
    setActiveContact,
    entries,
    openModal,
    deleteTransaction,
    customLabels,
    shop,
    triggerWhatsAppShare,
    deleteContact,
    loans,
  } = useKhata();

  const [activeSubTab, setActiveSubTab] = useState<'LEDGER' | 'DUE' | 'DISCOUNTS' | 'LOANS'>('LEDGER');
  const [showMenu, setShowMenu] = useState(false);
  const [selectedEntryForActions, setSelectedEntryForActions] = useState<LedgerEntry | null>(null);

  const balance = calculateContactBalance(contact.id, entries);
  const isGet = balance > 0;
  const isGive = balance < 0;
  const isSettled = balance === 0;

  // Running balance entries
  const runningEntries = calculateRunningBalances(contact.id, entries).reverse(); // latest first

  // Dues / Overdue entries
  const contactDues = entries.filter(
    (e) => e.contactId === contact.id && !e.isDeleted && e.returnDate && e.type === 'GAVE'
  );

  // Contact Loans
  const contactLoans = loans.filter((l) => l.contactId === contact.id && l.status === 'ACTIVE');

  const handleShareReport = () => {
    let reportText = `*${shop.name} - Customer Ledger Statement*\nCustomer: ${contact.name}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\n`;
    if (balance > 0) {
      reportText += `*Total Balance Due:* ${formatCurrency(balance)} (You will get)\n\n`;
    } else if (balance < 0) {
      reportText += `*Total Balance Payable:* ${formatCurrency(Math.abs(balance))} (You will give)\n\n`;
    } else {
      reportText += `*Account Status:* Fully Settled (₹0)\n\n`;
    }

    reportText += `Recent Transactions:\n`;
    runningEntries.slice(0, 5).forEach((item) => {
      reportText += `• ${new Date(item.date).toLocaleDateString('en-IN')}: ${item.type === 'GAVE' ? 'Gave' : 'Got'} ${formatCurrency(item.amount)} (Bal: ${formatCurrency(item.runningBalance)})\n`;
    });

    reportText += `\nThank you for choosing ${shop.name}!`;
    triggerWhatsAppShare(contact.phone, reportText);
  };

  const handleOpenTransactionModal = (type: TransactionType) => {
    openModal('TRANSACTION_ENTRY', { contact, initialType: type });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] pb-24 flex flex-col justify-between select-none">
      <div>
        {/* Top Header matching screenshots 12, 13, 14 */}
        <div className="bg-[#0e8354] text-white px-4 py-3 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveContact(null)}
                className="p-1 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight capitalize">{contact.name}</h1>
                <p className="text-[11px] text-emerald-200">
                  {contact.countryCode} {contact.phone}
                </p>
              </div>
            </div>

            {/* Menu button */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-full hover:bg-emerald-800 transition-colors cursor-pointer"
              >
                <MoreVertical className="w-6 h-6" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-40 text-slate-800 text-sm">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      triggerWhatsAppShare(contact.phone, `Hello ${contact.name}, greeting from ${shop.name}!`);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 font-medium text-emerald-700"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      window.location.href = `tel:${contact.phone}`;
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      openModal('RECEIPT_SHARE', { contact, entries: runningEntries });
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download Statement</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      openModal('CREATE_LOAN', { contact });
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2.5 font-medium text-slate-700"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Create Loan for Customer</span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (window.confirm(`Delete ${contact.name} and move to Recycle Bin?`)) {
                        deleteContact(contact.id);
                        setActiveContact(null);
                      }
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-rose-50 text-rose-600 flex items-center gap-2.5 font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Contact</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Subtabs bar matching screenshot 12: Ledger | Due | Discounts | Loans */}
          <div className="flex space-x-6 mt-3 text-sm font-semibold border-b border-emerald-600/40">
            {(['LEDGER', 'DUE', 'DISCOUNTS', 'LOANS'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`pb-2 capitalize transition-all relative ${
                  activeSubTab === tab ? 'text-white font-bold' : 'text-emerald-100/70 hover:text-white'
                }`}
              >
                {tab.toLowerCase()}
                {activeSubTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Top Balance Card matching screenshot 12 */}
        <div className="mx-3 -mt-1 pt-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-slate-600">
                  {isSettled
                    ? 'Settled'
                    : isGet
                    ? 'You will get'
                    : 'You will give'}
                </span>
                <div
                  className={`text-2xl font-extrabold tracking-tight mt-0.5 ${
                    isSettled ? 'text-slate-800' : isGet ? 'text-[#d9383a]' : 'text-[#0e8354]'
                  }`}
                >
                  {formatCurrency(balance)}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShareReport}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs shadow-xs transition-colors"
                >
                  Share Report
                </button>
                <div className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                  <span>✖ Not Shared</span>
                </div>
                <button
                  onClick={handleShareReport}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Banner matching screenshot 12 */}
        <div className="mx-3 mt-2">
          <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl px-3.5 py-2.5 flex items-start space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-slate-700 font-medium">
                Only you and {contact.name} can see these entries
              </span>
              <div className="text-[#0e8354] font-bold underline cursor-pointer mt-0.5">
                No, hide my data
              </div>
            </div>
          </div>
        </div>

        {/* Column Subheaders (ENTRIES | YOU GAVE | YOU GOT) matching screenshot 14 */}
        {activeSubTab === 'LEDGER' && (
          <div className="px-5 py-2.5 mt-2 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 bg-white">
            <span className="w-1/2">Entries</span>
            <span className="w-1/4 text-right text-[#d9383a]">You Gave</span>
            <span className="w-1/4 text-right text-[#0e8354]">You Got</span>
          </div>
        )}

        {/* Tab Content */}
        <div className="mt-1">
          {/* TAB 1: LEDGER */}
          {activeSubTab === 'LEDGER' && (
            <div className="divide-y divide-slate-100 bg-white">
              {runningEntries.length === 0 ? (
                <div className="py-20 text-center px-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-700">Add first transaction of Contact</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Tap "PAISE DALE" (You Gave) or "YOU GOT ₹" below to record credit or payment
                  </p>
                </div>
              ) : (
                runningEntries.map((entry) => {
                  const isGave = entry.type === 'GAVE';

                  return (
                    <div
                      key={entry.id}
                      onClick={() => setSelectedEntryForActions(entry)}
                      className="px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors relative"
                    >
                      <div className="flex items-start justify-between">
                        {/* Left: Date, Time, Notes, Image */}
                        <div className="space-y-1 max-w-[60%]">
                          <div className="text-xs font-semibold text-slate-700">
                            {formatDateTime(entry.date)}
                          </div>
                          {entry.notes && (
                            <div className="text-sm font-medium text-slate-800 break-words">
                              {entry.notes}
                            </div>
                          )}
                          {entry.attachmentUrl && (
                            <div className="pt-1">
                              <img
                                src={entry.attachmentUrl}
                                alt="Bill thumbnail"
                                className="w-14 h-14 object-cover rounded-lg border border-slate-200 shadow-xs"
                              />
                            </div>
                          )}
                          <div className="text-xs font-bold text-slate-500 pt-0.5">
                            Bal.{' '}
                            <span className={entry.runningBalance >= 0 ? 'text-[#d9383a]' : 'text-[#0e8354]'}>
                              {formatCurrency(Math.abs(entry.runningBalance))}
                            </span>
                          </div>
                        </div>

                        {/* Right: Amount in corresponding column */}
                        <div className="text-right">
                          <div
                            className={`text-base font-bold tracking-tight ${
                              isGave ? 'text-[#d9383a]' : 'text-[#0e8354]'
                            }`}
                          >
                            {formatCurrency(entry.amount)}
                          </div>
                          {entry.returnDate && (
                            <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                              Due: {formatDate(entry.returnDate)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: DUE matching screenshot 13 */}
          {activeSubTab === 'DUE' && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                <div className="text-xs font-semibold text-slate-500">Due Today</div>
                <div className="text-2xl font-extrabold text-[#0e8354] mt-0.5">₹0</div>
              </div>

              {contactDues.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center shadow-xs border border-slate-200 space-y-3">
                  <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                  <h3 className="font-bold text-slate-800 text-base">No entries overdue now.</h3>
                  <div className="text-xs text-slate-500 space-y-1.5 pt-2">
                    <p>To mark entries overdue:</p>
                    <div
                      onClick={() => openModal('CREATE_LOAN', { contact })}
                      className="text-[#0e8354] font-bold hover:underline cursor-pointer"
                    >
                      • Create a new loan.
                    </div>
                    <div
                      onClick={() => handleOpenTransactionModal('GAVE')}
                      className="text-[#0e8354] font-bold hover:underline cursor-pointer"
                    >
                      • Create an entry with return date.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Tracked Return Dates
                  </div>
                  {contactDues.map((due) => (
                    <div
                      key={due.id}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between"
                    >
                      <div>
                        <div className="text-base font-bold text-slate-800">
                          {formatCurrency(due.amount)}
                        </div>
                        <div className="text-xs text-slate-500">
                          Return Due: {due.returnDate ? formatDate(due.returnDate) : 'Not specified'}
                        </div>
                        {due.notes && <div className="text-xs text-slate-400 mt-0.5">{due.notes}</div>}
                      </div>
                      <button
                        onClick={() => {
                          const msg = `Dear ${contact.name}, reminder from ${shop.name} for payment of ${formatCurrency(
                            due.amount
                          )} due on ${formatDate(due.returnDate || '')}. Kindly remit at your earliest convenience. Thank you!`;
                          triggerWhatsAppShare(contact.phone, msg);
                        }}
                        className="px-3 py-1.5 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                      >
                        Remind on WhatsApp
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISCOUNTS */}
          {activeSubTab === 'DISCOUNTS' && (
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-800 text-base">Cash Discount / Kasar</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Record settlements, rounded-off discounts or seasonal rebates given to {contact.name}.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const amount = prompt('Enter discount / Kasar amount in ₹:');
                      if (amount && parseFloat(amount) > 0) {
                        openModal('TRANSACTION_ENTRY', {
                          contact,
                          initialType: 'GOT',
                          notes: `Cash Discount / Kasar adjustment: ₹${amount}`,
                        });
                      }
                    }}
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    + Give Discount
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LOANS */}
          {activeSubTab === 'LOANS' && (
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-base">Customer Loans</h3>
                <button
                  onClick={() => openModal('CREATE_LOAN', { contact })}
                  className="px-3 py-1.5 bg-[#0e8354] hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  + New Loan
                </button>
              </div>

              {contactLoans.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700">No active loans for {contact.name}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-generate monthly EMI schedules, late fees, and reminders
                  </p>
                </div>
              ) : (
                contactLoans.map((loan) => (
                  <div key={loan.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-semibold text-slate-500">Principal</div>
                        <div className="text-xl font-extrabold text-slate-900">
                          {formatCurrency(loan.principal)}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {loan.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl">
                      <div>
                        <span className="text-[10px] text-slate-400 block">EMI</span>
                        <span className="font-bold">{formatCurrency(loan.emiAmount)}/mo</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Rate</span>
                        <span className="font-bold">{loan.interestRateAnnual}% p.a.</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Tenure</span>
                        <span className="font-bold">{loan.termMonths} mos</span>
                      </div>
                    </div>

                    {/* Installments preview */}
                    <div className="text-xs font-bold text-slate-700 pt-1">Installment Schedule</div>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {loan.installments.map((inst) => (
                        <div
                          key={inst.id}
                          className="flex justify-between items-center text-xs py-1 border-b border-slate-100 last:border-0"
                        >
                          <div>
                            <span className="font-semibold text-slate-800">
                              #{inst.installmentNumber} • Due {formatDate(inst.dueDate)}
                            </span>
                            <span className="text-[10px] text-slate-400 block">
                              Principal {formatCurrency(inst.principalComponent)} + Int{' '}
                              {formatCurrency(inst.interestComponent)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{formatCurrency(inst.amount)}</span>
                            {inst.status === 'PAID' ? (
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                Paid
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                Due
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Entry Context Actions Modal */}
      {selectedEntryForActions && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3">
          <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Transaction Details</h3>
            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1">
              <div>
                <span className="text-slate-400">Type:</span>{' '}
                <span className="font-bold">
                  {selectedEntryForActions.type === 'GAVE' ? 'You Gave' : 'You Got'}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Amount:</span>{' '}
                <span className="font-bold text-slate-800">
                  {formatCurrency(selectedEntryForActions.amount)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Date:</span>{' '}
                <span>{formatDateTime(selectedEntryForActions.date)}</span>
              </div>
              {selectedEntryForActions.notes && (
                <div>
                  <span className="text-slate-400">Note:</span> <span>{selectedEntryForActions.notes}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  const receiptText = `Receipt from ${shop.name}\nCustomer: ${contact.name}\n${selectedEntryForActions.type === 'GAVE' ? 'Credit Given' : 'Payment Received'}: ${formatCurrency(selectedEntryForActions.amount)}\nDate: ${new Date(selectedEntryForActions.date).toLocaleDateString('en-IN')}`;
                  triggerWhatsAppShare(contact.phone, receiptText);
                  setSelectedEntryForActions(null);
                }}
                className="w-full py-2.5 px-3 bg-[#0e8354] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Share Receipt Confirmation
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Delete this entry and move to Recycle Bin?')) {
                    deleteTransaction(selectedEntryForActions.id);
                    setSelectedEntryForActions(null);
                  }
                }}
                className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200"
              >
                Delete Entry
              </button>
              <button
                onClick={() => setSelectedEntryForActions(null)}
                className="w-full py-2 px-3 text-slate-600 text-xs font-semibold hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar matching screenshots 12, 13, 14 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t border-slate-200 p-3 z-20 shadow-lg">
        <div className="grid grid-cols-2 gap-3 mb-2">
          {/* PAISE DALE (You Gave) */}
          <button
            onClick={() => handleOpenTransactionModal('GAVE')}
            className="py-3 px-4 bg-[#d9383a] hover:bg-rose-700 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{customLabels.gaveLabel || 'PAISE DALE'}</span>
          </button>

          {/* YOU GOT ₹ (Money In) */}
          <button
            onClick={() => handleOpenTransactionModal('GOT')}
            className="py-3 px-4 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-sm uppercase tracking-wide rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>{customLabels.gotLabel || 'YOU GOT ₹'}</span>
          </button>
        </div>

        {/* Go to Home link matching screenshot 12 */}
        <div className="text-center pt-1">
          <button
            onClick={() => setActiveContact(null)}
            className="text-xs font-bold text-[#0e8354] hover:underline cursor-pointer"
          >
            ← Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};
