import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { Contact, LedgerEntry } from '../../types';
import { Check, Bell, Share2 } from 'lucide-react';
import { formatCurrency } from '../../db/storage';

interface EntrySavedModalProps {
  contact: Contact;
  entry: LedgerEntry;
}

export const EntrySavedModal: React.FC<EntrySavedModalProps> = ({ contact, entry }) => {
  const { closeModal, openModal, shop, triggerWhatsAppShare } = useKhata();

  const isGave = entry.type === 'GAVE';
  const actionText = isGave
    ? `You Gave ${contact.name} ${formatCurrency(entry.amount)}`
    : `${contact.name} Gave You ${formatCurrency(entry.amount)}`;

  const buttonText = isGave ? 'Send Payment Reminder' : 'Share Receipt Confirmation';

  const handleShareClick = () => {
    // Construct friendly WhatsApp confirmation/reminder text
    let message = '';
    if (isGave) {
      message = `Dear ${contact.name}, a credit entry of ${formatCurrency(
        entry.amount
      )} has been recorded at ${shop.name} on ${new Date(entry.date).toLocaleDateString(
        'en-IN'
      )}. Thank you for your business!`;
    } else {
      message = `Dear ${contact.name}, payment received of ${formatCurrency(
        entry.amount
      )} has been credited to your account at ${shop.name} on ${new Date(entry.date).toLocaleDateString(
        'en-IN'
      )}. Thank you!`;
    }

    triggerWhatsAppShare(contact.phone, message);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Big Green Circle Checkmark matching screenshots 3 & 7 */}
        <div className="w-24 h-24 rounded-full bg-[#18b872] flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Check className="w-14 h-14 text-white stroke-[3.5]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-[#141b2d] tracking-tight">Entry Saved!</h2>

        {/* Transaction Summary Card */}
        <div className="w-full py-4 px-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs">
          <p className="text-base font-bold text-slate-800">{actionText}</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          <button
            onClick={handleShareClick}
            className="w-full py-3.5 px-4 bg-[#0e8354] hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm text-sm transition-all"
          >
            <Bell className="w-4 h-4 fill-current" />
            <span>{buttonText}</span>
          </button>

          <button
            onClick={closeModal}
            className="w-full py-3.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 active:scale-[0.99] text-slate-700 font-bold rounded-2xl text-sm transition-all shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
