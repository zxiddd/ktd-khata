import React from 'react';
import { useKhata } from '../../context/KhataContext';
import {
  formatCurrency,
  calculateContactBalance,
} from '../../db/storage';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  UserPlus,
  Zap,
  CheckCheck,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { Contact } from '../../types';

export const ContactsTab: React.FC = () => {
  const {
    filteredContacts,
    dashboardTotals,
    contactSearchQuery,
    setContactSearchQuery,
    contactFilter,
    setContactFilter,
    contactSort,
    setContactSort,
    setActiveContact,
    openModal,
    entries,
  } = useKhata();

  // Helper for avatar background colors
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-[#0e8354]',
      'bg-emerald-600',
      'bg-teal-600',
      'bg-cyan-700',
      'bg-emerald-700',
      'bg-green-700',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getRelativeTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="pb-24 pt-2">
      {/* Top Floating Summary Card matching screenshot 11 */}
      <div className="mx-4 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 divide-x divide-slate-100 pb-3">
            {/* You will get (Receivables) */}
            <div className="pr-3">
              <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <span>You will get</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#d9383a] tracking-tight">
                {formatCurrency(dashboardTotals.totalYouWillGet)}
              </div>
            </div>

            {/* You will give (Payables) */}
            <div className="pl-3">
              <div className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <span>You will give</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold text-[#0e8354] tracking-tight">
                {formatCurrency(dashboardTotals.totalYouWillGive)}
              </div>
            </div>
          </div>

          {/* Quick Collect Action */}
          <button
            onClick={() => openModal('BULK_REMINDER')}
            className="w-full mt-1 py-2.5 px-4 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
            <span>Collect Payments Now</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
      </div>


      {/* Search & Filter Bar */}
      <div className="px-4 py-2 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={contactSearchQuery}
            onChange={(e) => setContactSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-3 py-2 bg-slate-100 hover:bg-slate-200/80 focus:bg-white border border-transparent focus:border-emerald-500 rounded-xl text-sm placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Sort Cycle */}
        <button
          onClick={() => {
            const nextSort =
              contactSort === 'RECENT'
                ? 'AMOUNT_HIGH'
                : contactSort === 'AMOUNT_HIGH'
                ? 'NAME_ASC'
                : 'RECENT';
            setContactSort(nextSort);
          }}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shadow-xs"
          title={`Sort: ${contactSort}`}
        >
          <ArrowUpDown className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Tabs Chips */}
      <div className="px-4 py-1 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'ALL', label: 'All' },
          { id: 'GET', label: "You'll Get" },
          { id: 'GIVE', label: "You'll Give" },
          { id: 'SETTLED', label: 'Settled' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setContactFilter(tab.id as any)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              contactFilter === tab.id
                ? 'bg-emerald-100 text-[#0e8354] border border-emerald-300'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contacts List */}
      <div className="mt-2 divide-y divide-slate-100 bg-white">
        {filteredContacts.length === 0 ? (
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 bg-emerald-50 text-[#0e8354] rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-xs border border-emerald-100">
              <UserPlus className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Your Ledger is Clean & Ready</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
              {contactSearchQuery
                ? `No contact matches "${contactSearchQuery}"`
                : 'No dummy data. Add your first customer or vendor to start recording credit and payments.'}
            </p>
            <button
              onClick={() => openModal('ADD_CONTACT')}
              className="mt-5 px-6 py-3 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Your First Contact</span>
            </button>
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const balance = calculateContactBalance(contact.id, entries);
            const isGet = balance > 0;
            const isGive = balance < 0;
            const isSettled = balance === 0;

            const initial = contact.name.trim().charAt(0).toUpperCase() || 'C';

            return (
              <div
                key={contact.id}
                onClick={() => setActiveContact(contact)}
                className="px-4 py-3 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors active:bg-slate-100 select-none"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  {/* Initial Avatar */}
                  <div
                    className={`w-11 h-11 rounded-full ${getAvatarColor(
                      contact.name
                    )} text-white font-bold text-lg flex items-center justify-center flex-shrink-0 shadow-xs`}
                  >
                    {initial}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                      {contact.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                      <span>{getRelativeTime(contact.updatedAt)}</span>
                      {contact.notes && (
                        <span className="hidden sm:inline truncate max-w-[120px] text-slate-400">
                          • {contact.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Amount and Status Badge matching screenshot 11 */}
                <div className="text-right flex-shrink-0 pl-2">
                  <div
                    className={`text-sm sm:text-base font-bold tracking-tight ${
                      isGet ? 'text-[#d9383a]' : isGive ? 'text-[#0e8354]' : 'text-slate-500'
                    }`}
                  >
                    {formatCurrency(balance)}
                  </div>

                  {/* Status Badge e.g. "Mall aya" or "They'll Pay" */}
                  <div className="mt-0.5">
                    {isGet ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                        {contact.tag || "They'll Pay"}
                      </span>
                    ) : isGive ? (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {contact.tag || 'Mall aya'}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                        Settled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Action Button (+ Add Contact) matching screenshot 11 */}
      <div className="fixed bottom-20 right-4 sm:right-auto sm:left-1/2 sm:translate-x-32 z-20">
        <button
          onClick={() => openModal('ADD_CONTACT')}
          className="flex items-center gap-2 px-5 py-3.5 bg-[#0e8354] hover:bg-emerald-700 text-white font-bold text-sm rounded-full shadow-lg hover:shadow-emerald-900/30 active:scale-95 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5 stroke-[2.5]" />
          <span>Add Contact</span>
        </button>
      </div>
    </div>
  );
};
