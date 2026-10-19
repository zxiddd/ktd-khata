import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, MessageCircle, CheckSquare, Square, Send, Search, Bell } from 'lucide-react';
import { formatCurrency, calculateContactBalance } from '../../db/storage';

export const BulkReminderModal: React.FC = () => {
  const { contacts, entries, closeModal, shop, triggerWhatsAppShare } = useKhata();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [customNote, setCustomNote] = useState('Kindly clear your pending account balance at your earliest convenience.');

  // Find contacts who owe money (balance > 0)
  const contactsWithDues = contacts.filter((c) => {
    if (c.status !== 'active') return false;
    const bal = calculateContactBalance(c.id, entries);
    return bal > 0;
  });

  const filteredDues = contactsWithDues.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredDues.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDues.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSendSingle = (contact: (typeof contacts)[0]) => {
    const bal = calculateContactBalance(contact.id, entries);
    const msg = `Dear ${contact.name}, gentle reminder from ${shop.name} regarding your outstanding balance of ${formatCurrency(
      bal
    )}. ${customNote} Thank you for your continued business!`;
    triggerWhatsAppShare(contact.phone, msg);
  };

  const handleSendBulkNext = () => {
    if (selectedIds.length === 0) return;
    const firstContact = contacts.find((c) => c.id === selectedIds[0]);
    if (firstContact) {
      handleSendSingle(firstContact);
      // Remove from selection as sent
      setSelectedIds((prev) => prev.slice(1));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Bulk WhatsApp Reminders</h2>
          </div>
          <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full font-bold">
            {contactsWithDues.length} with Dues
          </span>
        </div>

        {/* Search & Select All */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customers with dues..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 font-bold text-[#0e8354]"
            >
              {selectedIds.length === filteredDues.length && filteredDues.length > 0 ? (
                <CheckSquare className="w-4 h-4" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>Select All ({filteredDues.length})</span>
            </button>
            <span className="text-slate-500 font-semibold">{selectedIds.length} Selected</span>
          </div>
        </div>

        {/* List of Contacts with Dues */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100">
          {filteredDues.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No outstanding dues found! All customer accounts are settled.
            </div>
          ) : (
            filteredDues.map((contact) => {
              const bal = calculateContactBalance(contact.id, entries);
              const isChecked = selectedIds.includes(contact.id);

              return (
                <div
                  key={contact.id}
                  className="pt-2 pb-2 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div
                    onClick={() => toggleSelect(contact.id)}
                    className="flex items-center space-x-2.5 cursor-pointer flex-1"
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-[#0e8354] flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
                      <p className="text-[11px] text-slate-400">{contact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-extrabold text-[#d9383a]">
                      {formatCurrency(bal)}
                    </span>
                    <button
                      onClick={() => handleSendSingle(contact)}
                      className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0e8354] transition-colors"
                      title="Send WhatsApp Reminder"
                    >
                      <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Bulk Send Trigger */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="text-[11px] text-slate-500 mb-2 font-medium">
            Opens WhatsApp with prefilled payment reminder including customer name and exact due balance.
          </div>
          <button
            onClick={handleSendBulkNext}
            disabled={selectedIds.length === 0}
            className="w-full py-3 bg-[#0e8354] hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>
              {selectedIds.length > 0
                ? `Send Reminder to Next Customer (${selectedIds.length} left)`
                : 'Select Customers to Send'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
