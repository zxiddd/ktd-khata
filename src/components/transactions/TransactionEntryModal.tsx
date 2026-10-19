import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { TransactionType, Contact } from '../../types';
import { ArrowLeft, ArrowUp, ArrowDown, Calendar, PlusCircle, Camera, Check, ChevronRight } from 'lucide-react';
import { NumericKeypad } from '../common/NumericKeypad';
import { formatDate } from '../../db/storage';

interface TransactionEntryModalProps {
  contact: Contact;
  initialType?: TransactionType;
}

export const TransactionEntryModal: React.FC<TransactionEntryModalProps> = ({
  contact,
  initialType = 'GAVE',
}) => {
  const { addTransaction, closeModal, openModal, triggerConfettiCelebration } = useKhata();
  const [type, setType] = useState<TransactionType>(initialType);
  const [amountStr, setAmountStr] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [entryDate, setEntryDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [returnDate, setReturnDate] = useState<string>('');
  const [attachmentUrl, setAttachmentUrl] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showReturnDatePicker, setShowReturnDatePicker] = useState<boolean>(false);

  const isGave = type === 'GAVE';
  const headerBg = isGave ? 'bg-[#d9383a]' : 'bg-[#0e8354]';
  const headerTitle = isGave ? `You Gave ${contact.name}` : `${contact.name} Gave You`;

  const amountVal = parseFloat(amountStr) || 0;

  const handleSave = () => {
    if (amountVal <= 0) return;

    const savedEntry = addTransaction({
      contactId: contact.id,
      type,
      amount: amountVal,
      date: new Date(entryDate).toISOString(),
      returnDate: returnDate ? new Date(returnDate).toISOString() : undefined,
      notes: notes.trim(),
      attachmentUrl: attachmentUrl || undefined,
    });

    triggerConfettiCelebration();

    // Open Entry Saved confirmation modal
    openModal('ENTRY_SAVED', {
      contact,
      entry: savedEntry,
    });
  };

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAttachmentUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAttachPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      // Offline fallback sample SVG receipt
      const svgReceipt = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23f8fafc"/><rect x="20" y="20" width="160" height="160" rx="8" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><text x="100" y="60" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a" text-anchor="middle">OFFICIAL BILL</text><line x1="40" y1="80" x2="160" y2="80" stroke="%23e2e8f0" stroke-width="2"/><text x="100" y="110" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Bill Verified</text><circle cx="100" cy="145" r="16" fill="%230e8354"/><path d="M93 145l5 5 10-10" fill="none" stroke="%23ffffff" stroke-width="2.5"/></svg>`;
      setAttachmentUrl(svgReceipt);
    }
  };

  const handleConvertToLoan = () => {
    if (amountVal > 0) {
      openModal('CREATE_LOAN', {
        contact,
        presetPrincipal: amountVal,
        presetNotes: notes,
      });
    } else {
      openModal('CREATE_LOAN', { contact });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-[#f7f9fa] w-full max-w-lg min-h-screen sm:min-h-0 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto justify-between">
        {/* Top Header matching screenshots 8 & 9 */}
        <div>
          <div className={`${headerBg} text-white px-4 py-3 flex items-center justify-between shadow-xs transition-colors duration-200`}>
            <div className="flex items-center space-x-3">
              <button
                onClick={closeModal}
                className="p-1 rounded-full hover:bg-black/20 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold tracking-tight truncate max-w-[200px] sm:max-w-xs">
                {headerTitle}
              </h2>
            </div>

            {/* Toggle Switch [↑] [↓] */}
            <div className="bg-white/95 rounded-full p-0.5 flex items-center shadow-xs">
              <button
                type="button"
                onClick={() => setType('GAVE')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isGave ? 'bg-[#d9383a] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="You Gave (Paise Dale)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => setType('GOT')}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  !isGave ? 'bg-[#0e8354] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
                title="You Got (Paise Mile)"
              >
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-4 space-y-3.5">
            {/* Amount input card */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center text-slate-400 font-bold text-2xl mr-2">
                <span>₹</span>
              </div>
              <input
                type="text"
                readOnly
                value={amountStr ? Number(amountStr).toLocaleString('en-IN') : ''}
                placeholder="Enter Amount"
                className="w-full text-2xl font-bold text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <div className="text-emerald-700 p-1">
                <div className="grid grid-cols-3 gap-0.5 w-5 h-5">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Note input */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-xs">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes, bill number or item details"
                rows={2}
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none resize-none"
              />
            </div>

            {/* Date and Camera action pills */}
            <div className="grid grid-cols-12 gap-2">
              {/* Entry Date */}
              <div className="col-span-5 bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
                <div className="text-[10px] font-bold text-[#0e8354] uppercase tracking-wider mb-0.5">
                  Entry Date
                </div>
                <div
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formatDate(entryDate)}</span>
                </div>
                {showDatePicker && (
                  <input
                    type="date"
                    value={entryDate}
                    onChange={(e) => {
                      setEntryDate(e.target.value);
                      setShowDatePicker(false);
                    }}
                    className="mt-1 text-xs border rounded p-1 w-full"
                  />
                )}
              </div>

              {/* Return Date */}
              <div className="col-span-5 bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
                <div className="text-[10px] font-bold text-[#0e8354] uppercase tracking-wider mb-0.5">
                  Return Date
                </div>
                <div
                  onClick={() => setShowReturnDatePicker(!showReturnDatePicker)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{returnDate ? formatDate(returnDate) : 'Add'}</span>
                </div>
                {showReturnDatePicker && (
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      setShowReturnDatePicker(false);
                    }}
                    className="mt-1 text-xs border rounded p-1 w-full"
                  />
                )}
              </div>

              {/* Camera Photo Attachment */}
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={handleAttachPhotoClick}
                  className="p-3 text-emerald-700 hover:text-emerald-800 flex flex-col items-center justify-center relative cursor-pointer"
                  title="Attach Bill Receipt Photo"
                >
                  <Camera className="w-6 h-6 stroke-[1.8]" />
                  {attachmentUrl && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Bill Attachment preview if present */}
            {attachmentUrl && (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-white p-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={attachmentUrl}
                    alt="Receipt preview"
                    className="w-12 h-12 object-cover rounded-lg border"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Bill Photo Attached</div>
                    <div className="text-[10px] text-slate-400">Attached to this entry</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentUrl('')}
                  className="text-xs text-rose-600 font-semibold hover:underline px-2"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Save & Convert to Loan row */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={amountVal <= 0}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-base transition-all shadow-md ${
                  amountVal > 0
                    ? isGave
                      ? 'bg-[#d9383a] hover:bg-rose-700 text-white cursor-pointer active:scale-[0.99]'
                      : 'bg-[#0e8354] hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.99]'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Save
              </button>

              {isGave && (
                <button
                  type="button"
                  onClick={handleConvertToLoan}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 px-2 py-3 cursor-pointer"
                >
                  <span>Convert to Loan</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Built-in Onscreen Calculator Keypad */}
        <div className="mt-2">
          <NumericKeypad
            value={amountStr}
            onChange={(val) => setAmountStr(val)}
          />
        </div>
      </div>
    </div>
  );
};
