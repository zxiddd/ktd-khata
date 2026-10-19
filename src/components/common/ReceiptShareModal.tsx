import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { Contact, LedgerEntry } from '../../types';
import { ArrowLeft, MessageCircle, Printer, Share2, Check, Download } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../db/storage';

interface ReceiptShareModalProps {
  contact: Contact;
  entries: LedgerEntry[];
}

export const ReceiptShareModal: React.FC<ReceiptShareModalProps> = ({ contact, entries }) => {
  const { closeModal, shop, activeBook, triggerWhatsAppShare } = useKhata();

  const handleShareToWhatsApp = () => {
    let msg = `*${shop.name}* (${activeBook.name})\n*Customer Statement: ${contact.name}*\n\n`;
    entries.slice(0, 10).forEach((e) => {
      msg += `${e.type === 'GAVE' ? '🔴 Gave' : '🟢 Got'}: ${formatCurrency(e.amount)} on ${new Date(
        e.date
      ).toLocaleDateString('en-IN')}\n`;
    });
    msg += `\nThank you for choosing ${shop.name}!`;
    triggerWhatsAppShare(contact.phone, msg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#0e8354] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Customer Statement</h2>
          </div>
          <button
            onClick={() => window.print()}
            className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-emerald-100"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Paper Card */}
        <div className="p-6 bg-[#fbfbfb] overflow-y-auto space-y-4 flex-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            {/* Shop Brand Header */}
            <div className="text-center border-b border-dashed border-slate-300 pb-4">
              <h3 className="text-xl font-black text-slate-900">{shop.name}</h3>
              <p className="text-xs text-slate-500 font-medium">{shop.address}</p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Phone: {shop.phone}</p>
            </div>

            {/* Customer Details */}
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">CUSTOMER:</span>
                <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                <span className="text-slate-500 block">{contact.phone}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block font-semibold">DATE:</span>
                <span className="font-bold text-slate-800">
                  {new Date().toLocaleDateString('en-IN')}
                </span>
                <span className="text-slate-500 block">Ledger: {activeBook.name}</span>
              </div>
            </div>

            {/* Entries Table */}
            <div className="border-t border-slate-200 pt-3">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Date & Details</span>
                <span>Amount (₹)</span>
              </div>

              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {entries.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">
                        {new Date(item.date).toLocaleDateString('en-IN')}{' '}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            item.type === 'GAVE'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          {item.type === 'GAVE' ? 'Gave' : 'Got'}
                        </span>
                      </div>
                      {item.notes && <div className="text-[11px] text-slate-400">{item.notes}</div>}
                    </div>
                    <div
                      className={`font-bold ${
                        item.type === 'GAVE' ? 'text-[#d9383a]' : 'text-[#0e8354]'
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Digital seal */}
            <div className="pt-3 border-t border-dashed border-slate-300 text-center">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" />
                <span>Verified by Ok Khata Digital Bahi</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white border-t border-slate-200 space-y-2">
          <button
            onClick={handleShareToWhatsApp}
            className="w-full py-3 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Share Statement to WhatsApp</span>
          </button>
          <button
            onClick={closeModal}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
