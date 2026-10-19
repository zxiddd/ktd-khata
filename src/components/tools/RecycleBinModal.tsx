import React from 'react';
import { useKhata } from '../../context/KhataContext';
import { ArrowLeft, Trash2, RotateCcw, AlertTriangle, FileText, User } from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../db/storage';

export const RecycleBinModal: React.FC = () => {
  const {
    deletedEntries,
    deletedContacts,
    restoreTransaction,
    restoreContact,
    closeModal,
    contacts,
  } = useKhata();

  const totalDeleted = deletedEntries.length + deletedContacts.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-rose-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={closeModal}
              className="p-1 rounded-full hover:bg-rose-800 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>Recycle Bin</span>
              <span className="text-amber-300 text-sm">👑</span>
            </h2>
          </div>
          <span className="text-xs bg-rose-800 px-2.5 py-0.5 rounded-full font-bold">
            {totalDeleted} items
          </span>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {totalDeleted === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <Trash2 className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">Recycle Bin is empty</p>
              <p className="text-xs text-slate-400">
                Any deleted contacts or entries will be stored here safely for recovery.
              </p>
            </div>
          ) : (
            <>
              {/* Deleted Contacts */}
              {deletedContacts.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Deleted Contacts ({deletedContacts.length})
                  </div>
                  {deletedContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
                          <p className="text-[11px] text-slate-400">{contact.phone}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => restoreContact(contact.id)}
                        className="px-3 py-1.5 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Deleted Transactions */}
              {deletedEntries.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Deleted Transactions ({deletedEntries.length})
                  </div>
                  {deletedEntries.map((entry) => {
                    const contact = contacts.find((c) => c.id === entry.contactId);
                    const isGave = entry.type === 'GAVE';

                    return (
                      <div
                        key={entry.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2.5">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-800 text-sm">
                                {contact ? contact.name : 'Unknown'}
                              </span>
                              <span
                                className={`text-xs font-extrabold ${
                                  isGave ? 'text-[#d9383a]' : 'text-[#0e8354]'
                                }`}
                              >
                                {formatCurrency(entry.amount)}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {formatDateTime(entry.date)} {entry.notes ? `• ${entry.notes}` : ''}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => restoreTransaction(entry.id)}
                          className="px-3 py-1.5 bg-[#0e8354] hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Restore</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={closeModal}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
