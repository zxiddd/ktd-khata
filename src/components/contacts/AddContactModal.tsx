import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Users, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';

const SAMPLE_PHONE_CONTACTS = [
  { name: 'Arjun Verma (Wholesaler)', phone: '9820011223' },
  { name: 'Bhavna Ben (Saree House)', phone: '9833445566' },
  { name: 'Chirag Parekh (Textiles)', phone: '9845566778' },
  { name: 'Deepak Mills Agent', phone: '9876501234' },
];

export const AddContactModal: React.FC = () => {
  const { addContact, closeModal, contacts, setActiveContact } = useKhata();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [notes, setNotes] = useState('');
  const [customerType, setCustomerType] = useState<'customer' | 'supplier'>('customer');
  const [showPhonePicker, setShowPhonePicker] = useState(false);

  // Check duplicate
  const cleanPhone = phone.trim();
  const duplicateContact = cleanPhone && cleanPhone.length >= 7
    ? contacts.find((c) => c.status === 'active' && c.phone.endsWith(cleanPhone.slice(-8)))
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newContact = addContact({
      name: name.trim(),
      phone: cleanPhone || '0000000000',
      countryCode,
      notes,
      customerType,
    });

    closeModal();
    setActiveContact(newContact);
  };

  const handlePickPhoneContact = (picked: { name: string; phone: string }) => {
    setName(picked.name);
    setPhone(picked.phone);
    setShowPhonePicker(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg min-h-screen sm:min-h-0 sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto">
        {/* Header matching screenshot 10 */}
        <div className="bg-[#0e8354] text-white px-4 py-3.5 flex items-center space-x-3">
          <button
            onClick={closeModal}
            className="p-1 rounded-full hover:bg-emerald-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">Add Contact</h2>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 flex-1">
          {/* Customer / Supplier segment */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setCustomerType('customer')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                customerType === 'customer'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Customer (Grahak)
            </button>
            <button
              type="button"
              onClick={() => setCustomerType('supplier')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                customerType === 'supplier'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Supplier (Vendor)
            </button>
          </div>

          {/* Name input */}
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8354] focus:border-transparent transition-all shadow-xs"
              autoFocus
              required
            />
          </div>

          {/* Phone input with Country Code */}
          <div className="flex rounded-xl border border-slate-300 overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-[#0e8354] focus-within:border-transparent">
            <div className="bg-slate-50 border-r border-slate-300 px-3 flex items-center space-x-1.5 text-slate-700 text-sm font-semibold">
              <span className="text-base">🇮🇳</span>
              <span>{countryCode}</span>
              <span className="text-xs text-slate-400">▼</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Mobile number"
              className="w-full px-4 py-3 bg-white text-base text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* Duplicate warning */}
          {duplicateContact && (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-2.5 text-amber-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <span className="font-bold">Duplicate detected:</span> An existing contact "
                {duplicateContact.name}" uses this phone number.
              </div>
            </div>
          )}

          {/* Optional Notes */}
          <div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Address or contact notes (optional)"
              rows={2}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3.5 bg-[#54b88d] hover:bg-[#0e8354] disabled:opacity-50 text-white font-bold text-base rounded-xl transition-all shadow-md active:scale-[0.99] mt-2 cursor-pointer"
          >
            Save
          </button>

          {/* Access Phone Contacts Card */}
          <div className="mt-8 pt-4">
            <div className="p-5 border border-slate-200 rounded-2xl bg-white shadow-xs text-center space-y-3">
              <h3 className="font-bold text-slate-900 text-base">Access Phone Contacts</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Allow access to your phone contacts to easily add customers from your contact list.
              </p>

              {!showPhonePicker ? (
                <button
                  type="button"
                  onClick={() => setShowPhonePicker(true)}
                  className="text-[#0e8354] font-bold text-sm hover:underline py-1 px-4 cursor-pointer"
                >
                  Allow Access
                </button>
              ) : (
                <div className="mt-3 pt-3 border-t border-slate-100 text-left space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select from phone contacts:
                  </div>
                  <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                    {SAMPLE_PHONE_CONTACTS.map((sample, idx) => (
                      <div
                        key={idx}
                        onClick={() => handlePickPhoneContact(sample)}
                        className="py-2 px-2 hover:bg-emerald-50 rounded-lg cursor-pointer flex justify-between items-center text-xs"
                      >
                        <span className="font-semibold text-slate-800">{sample.name}</span>
                        <span className="text-slate-500">{sample.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
