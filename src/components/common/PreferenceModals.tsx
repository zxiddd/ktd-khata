import React, { useState } from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Check, RefreshCw, Languages, Tag, Store, ShieldCheck, X } from 'lucide-react';

export const AppLockSettingsModal: React.FC = () => {
  const { appPin, setAppPin, closeModal } = useKhata();
  const [newPin, setNewPin] = useState(appPin || '');
  const [enabled, setEnabled] = useState(!!appPin);

  const handleSave = () => {
    if (enabled) {
      if (newPin.length !== 4) {
        alert('PIN must be 4 digits');
        return;
      }
      setAppPin(newPin);
    } else {
      setAppPin(null);
    }
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">App Lock & PIN</h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <span className="text-sm font-semibold text-slate-700">Enable 4-digit PIN Lock</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="w-4 h-4 accent-[#0e8354]"
          />
        </div>

        {enabled && (
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Enter 4-Digit PIN</label>
            <input
              type="password"
              maxLength={4}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 1234"
              className="w-full text-center text-2xl font-mono tracking-widest px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full py-2.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export const ChangeLanguageModal: React.FC = () => {
  const { language, setLanguage, closeModal } = useKhata();

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Select Language</h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {languages.map((l) => (
            <div
              key={l.code}
              onClick={() => {
                setLanguage(l.name);
                closeModal();
              }}
              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                language.toLowerCase() === l.name.toLowerCase()
                  ? 'border-[#0e8354] bg-emerald-50/70 font-bold'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-sm text-slate-900 block">{l.name}</span>
                <span className="text-xs text-slate-500">{l.native}</span>
              </div>
              {language.toLowerCase() === l.name.toLowerCase() && (
                <Check className="w-5 h-5 text-[#0e8354]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CustomizeLabelsModal: React.FC = () => {
  const { customLabels, updateCustomLabels, closeModal } = useKhata();
  const [gave, setGave] = useState(customLabels.gaveLabel);
  const [got, setGot] = useState(customLabels.gotLabel);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomLabels({
      ...customLabels,
      gaveLabel: gave.trim() || 'PAISE DALE',
      gotLabel: got.trim() || 'YOU GOT ₹',
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-1.5">
            <span>Customize Labels</span>
            <span className="text-amber-500 text-xs">👑</span>
          </h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              "Money Given / Credit" Button Label (Red)
            </label>
            <input
              type="text"
              value={gave}
              onChange={(e) => setGave(e.target.value)}
              placeholder="e.g. PAISE DALE, GAVE, DEBIT"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              "Money Received / Payment" Button Label (Green)
            </label>
            <input
              type="text"
              value={got}
              onChange={(e) => setGot(e.target.value)}
              placeholder="e.g. YOU GOT ₹, PAISE MILE, CREDIT"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
          >
            Update Button Labels
          </button>
        </form>
      </div>
    </div>
  );
};

export const SyncStatusModal: React.FC = () => {
  const { closeModal } = useKhata();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Sync Status</h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
          <RefreshCw className="w-8 h-8 text-[#0e8354] mx-auto animate-spin" />
          <h4 className="font-bold text-emerald-950 text-sm">All Entries Synced</h4>
          <p className="text-xs text-emerald-800">
            Pending uploads: 0 • Downloaded: 100% • Local state is up to date
          </p>
        </div>

        <button
          onClick={closeModal}
          className="w-full py-2.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export const ShopProfileModal: React.FC = () => {
  const { shop, updateShop, closeModal } = useKhata();
  const [name, setName] = useState(shop.name);
  const [owner, setOwner] = useState(shop.ownerName);
  const [phone, setPhone] = useState(shop.phone);
  const [address, setAddress] = useState(shop.address);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateShop({
      ...shop,
      name,
      ownerName: owner,
      phone,
      address,
    });
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3">
      <div className="bg-white w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Edit Shop Profile</h3>
          <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Shop / Business Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Owner Name</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">Market Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0e8354]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
